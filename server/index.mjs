import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import { z } from 'zod'
import { randomBytes, timingSafeEqual } from 'node:crypto'
import { createRecoveryCodes, decryptSecret, encodeBase32, encryptSecret, hashRecoveryCode, verifyTotp } from './mfa.mjs'

const app = express()
const isProduction = process.env.NODE_ENV === 'production'
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  'https://finsight-personal-finance.onrender.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean)
const jwtSecret = process.env.JWT_SECRET
const cookieOptions = { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', path: '/', maxAge: 1000 * 60 * 60 * 24 * 7 }
const mfaChallengeOptions = { ...cookieOptions, path: '/api/auth/mfa', maxAge: 5 * 60 * 1000 }

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    callback(null, false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE']
}))
app.use(express.json({ limit: '32kb' }))
app.use(cookieParser())
app.use((req, res, next) => {
  if (['POST', 'PATCH', 'DELETE'].includes(req.method)) {
    const origin = req.get('origin')
    if (origin && !allowedOrigins.includes(origin)) {
      return res.status(403).json({ error: 'Request origin is not allowed.' })
    }
  }
  next()
})

const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  currency: { type: String, enum: ['INR', 'USD', 'EUR', 'GBP'], default: 'INR' },
  mfaEnabled: { type: Boolean, default: false },
  mfaSecretEnc: { type: String, select: false },
  mfaPendingSecretEnc: { type: String, select: false },
  mfaLastCounter: { type: Number, default: -1 },
  recoveryCodeHashes: { type: [String], default: [], select: false },
}, { timestamps: true }))

const FinanceRecord = mongoose.model('FinanceRecord', new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  kind: { type: String, enum: ['transaction', 'budget', 'goal', 'bill'], required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  category: { type: String, trim: true, maxlength: 60, default: 'Other' },
  type: { type: String, enum: ['income', 'expense'], default: 'expense' },
  amount: { type: Number, min: 0 },
  date: { type: String, match: /^\d{4}-\d{2}-\d{2}$/ },
  method: { type: String, trim: true, maxlength: 40 },
  note: { type: String, trim: true, maxlength: 180 },
  limit: { type: Number, min: 1 },
  target: { type: Number, min: 1 },
  saved: { type: Number, min: 0, default: 0 },
  dueDate: { type: String, match: /^\d{4}-\d{2}-\d{2}$/ },
  frequency: { type: String, enum: ['weekly', 'monthly', 'yearly', 'once'], default: 'monthly' },
  paid: { type: Boolean, default: false },
}, { timestamps: true, strict: 'throw' }))
FinanceRecord.schema.index({ owner: 1, kind: 1, date: -1 })

const registration = z.object({ name: z.string().trim().min(1).max(80), email: z.string().trim().email().max(254), password: z.string().min(10).max(128) }).strict()
const credentials = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(128) }).strict()
const otpInput = z.object({ code: z.string().trim().regex(/^(?:\d{6}|[A-Fa-f\d]{16})$/) }).strict()
const disableMfaInput = z.object({ password: z.string().min(1).max(128), code: z.string().trim().regex(/^\d{6}$/) }).strict()
const recordInput = z.object({
  kind: z.enum(['transaction', 'budget', 'goal', 'bill']), name: z.string().trim().min(1).max(100),
  category: z.string().trim().max(60).optional(), type: z.enum(['income', 'expense']).optional(),
  amount: z.number().finite().nonnegative().optional(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  method: z.string().trim().max(40).optional(), note: z.string().trim().max(180).optional(),
  limit: z.number().positive().finite().optional(), target: z.number().positive().finite().optional(),
  saved: z.number().nonnegative().finite().optional(), dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  frequency: z.enum(['weekly', 'monthly', 'yearly', 'once']).optional(), paid: z.boolean().optional(),
}).strict().superRefine((data, ctx) => {
  const add = (field, message) => ctx.addIssue({ code: 'custom', path: [field], message })
  if (data.kind === 'transaction' && !(data.amount > 0)) add('amount', 'Transactions need a positive amount.')
  if (data.kind === 'transaction' && !data.date) add('date', 'Transactions need a date.')
  if (data.kind === 'budget' && !(data.limit > 0)) add('limit', 'Budgets need a positive monthly limit.')
  if (data.kind === 'goal' && !(data.target > 0)) add('target', 'Savings goals need a positive target amount.')
  if (data.kind === 'bill' && !(data.amount > 0)) add('amount', 'Bills need a positive amount.')
  if (data.kind === 'bill' && !data.dueDate) add('dueDate', 'Bills need a due date.')
})

function requireConfig(_req, res, next) {
  if (!jwtSecret || !process.env.MONGODB_URI) return res.status(503).json({ error: 'Account services are not configured.' })
  next()
}
function sign(user) { return jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: '7d', issuer: 'finsight-api', audience: 'finsight-web' }) }
function mfaKey(res) { if (!/^[\da-f]{64}$/iu.test(process.env.MFA_ENCRYPTION_KEY || '')) { res.status(503).json({ error: 'Authenticator setup needs MFA_ENCRYPTION_KEY configured on the API.' }); return null } return process.env.MFA_ENCRYPTION_KEY }
function publicUser(user) { return { id: String(user._id ?? user.id), name: user.name, email: user.email, currency: user.currency, mfaEnabled: Boolean(user.mfaEnabled) } }
function startMfaChallenge(user, res) {
  const token = jwt.sign({ sub: String(user._id), stage: 'mfa' }, jwtSecret, { expiresIn: '5m', issuer: 'finsight-api', audience: 'finsight-mfa' })
  res.clearCookie('finsight_session', { ...cookieOptions, maxAge: undefined }).cookie('finsight_mfa_challenge', token, mfaChallengeOptions).json({ mfaRequired: true })
}
async function authenticate(req, res, next) {
  const token = req.cookies.finsight_session
  if (!token) return res.status(401).json({ error: 'Sign in to continue.' })
  try {
    const payload = jwt.verify(token, jwtSecret, { issuer: 'finsight-api', audience: 'finsight-web' })
    req.user = await User.findById(payload.sub).select('_id name email currency mfaEnabled').lean()
    if (!req.user) return res.status(401).json({ error: 'Your session is no longer valid.' })
    next()
  } catch { res.clearCookie('finsight_session', cookieOptions); res.status(401).json({ error: 'Your session has expired. Sign in again.' }) }
}
function asyncRoute(handler) { return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next) }
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Too many attempts. Wait a little and try again.' } })

app.get('/api/health', (_req, res) => { const connected = mongoose.connection.readyState === 1; res.status(connected ? 200 : 503).json({ status: connected ? 'ok' : 'degraded', database: connected ? 'connected' : 'disconnected' }) })
app.post('/api/auth/register', requireConfig, authLimiter, asyncRoute(async (req, res) => {
  const body = registration.parse(req.body)
  const email = body.email.toLowerCase()
  if (await User.exists({ email })) return res.status(409).json({ error: 'An account with this email already exists.' })
  const passwordHash = await bcrypt.hash(body.password, 12)
  const user = await User.create({ name: body.name, email, passwordHash })
  res.cookie('finsight_session', sign(user), cookieOptions).status(201).json({ user: publicUser(user) })
}))
app.post('/api/auth/login', requireConfig, authLimiter, asyncRoute(async (req, res) => {
  const body = credentials.parse(req.body)
  const user = await User.findOne({ email: body.email.toLowerCase() })
  if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) return res.status(401).json({ error: 'Email or password did not match.' })
  if (user.mfaEnabled) return startMfaChallenge(user, res)
  res.cookie('finsight_session', sign(user), cookieOptions).json({ user: publicUser(user) })
}))
app.post('/api/auth/mfa/verify', requireConfig, authLimiter, asyncRoute(async (req, res) => {
  const input = otpInput.parse(req.body)
  const challenge = req.cookies.finsight_mfa_challenge
  if (!challenge) return res.status(401).json({ error: 'Your verification session expired. Sign in again.' })
  let payload
  try { payload = jwt.verify(challenge, jwtSecret, { issuer: 'finsight-api', audience: 'finsight-mfa' }) } catch { return res.status(401).json({ error: 'Your verification session expired. Sign in again.' }) }
  if (payload.stage !== 'mfa' || !payload.sub) return res.status(401).json({ error: 'Your verification session is invalid. Sign in again.' })
  const user = await User.findById(payload.sub).select('+mfaSecretEnc +recoveryCodeHashes')
  if (!user?.mfaEnabled || !user.mfaSecretEnc) return res.status(401).json({ error: 'MFA is not active for this account. Sign in again.' })
  const key = mfaKey(res)
  if (!key) return
  const secret = decryptSecret(user.mfaSecretEnc, key)
  const counter = verifyTotp(secret, input.code, Date.now(), user.mfaLastCounter)
  if (counter !== null) {
    const updated = await User.updateOne({ _id: user._id, mfaLastCounter: user.mfaLastCounter }, { $set: { mfaLastCounter: counter } })
    if (!updated.modifiedCount) return res.status(401).json({ error: 'That verification code was already used. Wait for the next code.' })
  } else {
    const hash = hashRecoveryCode(input.code)
    const matchingHash = user.recoveryCodeHashes.find(stored => stored.length === hash.length && timingSafeEqual(Buffer.from(stored), Buffer.from(hash)))
    if (!matchingHash) return res.status(401).json({ error: 'That verification code did not match.' })
    const updated = await User.updateOne({ _id: user._id, recoveryCodeHashes: matchingHash }, { $pull: { recoveryCodeHashes: matchingHash } })
    if (!updated.modifiedCount) return res.status(401).json({ error: 'That recovery code was already used.' })
  }
  const recoveryCodesRemaining = await User.findById(user._id).select('recoveryCodeHashes').lean().then(row => row?.recoveryCodeHashes?.length ?? 0)
  res.clearCookie('finsight_mfa_challenge', { ...mfaChallengeOptions, maxAge: undefined })
    .cookie('finsight_session', sign(user), cookieOptions).json({ user: publicUser(user), recoveryCodesRemaining })
}))
app.post('/api/auth/logout', (_req, res) => res.clearCookie('finsight_mfa_challenge', { ...mfaChallengeOptions, maxAge: undefined }).clearCookie('finsight_session', { ...cookieOptions, maxAge: undefined }).status(204).end())
app.get('/api/auth/me', requireConfig, authenticate, (req, res) => res.json({ user: publicUser(req.user) }))
app.post('/api/auth/mfa/setup', requireConfig, authenticate, authLimiter, asyncRoute(async (req, res) => {
  const { password } = z.object({ password: z.string().min(1).max(128) }).strict().parse(req.body)
  const account = await User.findById(req.user._id).select('+passwordHash')
  if (!account || !(await bcrypt.compare(password, account.passwordHash))) return res.status(401).json({ error: 'Password did not match.' })
  const key = mfaKey(res)
  if (!key) return
  const secret = encodeBase32(randomBytes(20))
  await User.updateOne({ _id: req.user._id }, { $set: { mfaPendingSecretEnc: encryptSecret(secret, key) } })
  const label = encodeURIComponent(`FinSight:${req.user.email}`)
  const issuer = encodeURIComponent('FinSight')
  res.json({ secret, otpauthUrl: `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30` })
}))
app.post('/api/auth/mfa/confirm', requireConfig, authenticate, authLimiter, asyncRoute(async (req, res) => {
  const { code } = z.object({ code: z.string().trim().regex(/^\d{6}$/) }).strict().parse(req.body)
  const key = mfaKey(res)
  if (!key) return
  const user = await User.findById(req.user._id).select('+mfaPendingSecretEnc')
  if (!user?.mfaPendingSecretEnc) return res.status(400).json({ error: 'Start authenticator setup first.' })
  const secret = decryptSecret(user.mfaPendingSecretEnc, key)
  const counter = verifyTotp(secret, code)
  if (counter === null) return res.status(400).json({ error: 'That code did not match. Check your authenticator and try again.' })
  const recoveryCodes = createRecoveryCodes()
  user.mfaSecretEnc = user.mfaPendingSecretEnc
  user.mfaPendingSecretEnc = undefined
  user.mfaEnabled = true
  user.mfaLastCounter = counter
  user.recoveryCodeHashes = recoveryCodes.map(hashRecoveryCode)
  await user.save()
  res.json({ enabled: true, recoveryCodes })
}))
app.post('/api/auth/mfa/disable', requireConfig, authenticate, authLimiter, asyncRoute(async (req, res) => {
  const input = disableMfaInput.parse(req.body)
  const key = mfaKey(res)
  if (!key) return
  const user = await User.findById(req.user._id).select('+passwordHash +mfaSecretEnc +mfaPendingSecretEnc +recoveryCodeHashes')
  if (!user?.mfaEnabled || !user.mfaSecretEnc || !(await bcrypt.compare(input.password, user.passwordHash))) return res.status(401).json({ error: 'Password or authenticator code did not match.' })
  const secret = decryptSecret(user.mfaSecretEnc, key)
  const counter = verifyTotp(secret, input.code, Date.now(), user.mfaLastCounter)
  if (counter === null) return res.status(401).json({ error: 'Password or authenticator code did not match.' })
  user.mfaEnabled = false
  user.mfaSecretEnc = undefined
  user.mfaPendingSecretEnc = undefined
  user.mfaLastCounter = -1
  user.recoveryCodeHashes = []
  await user.save()
  res.json({ enabled: false })
}))
app.patch('/api/profile', requireConfig, authenticate, asyncRoute(async (req, res) => {
  const body = z.object({ name: z.string().trim().min(1).max(80).optional(), currency: z.enum(['INR', 'USD', 'EUR', 'GBP']).optional() }).strict().parse(req.body)
  const user = await User.findByIdAndUpdate(req.user._id, body, { new: true, runValidators: true }).select('_id name email currency').lean()
  res.json({ user })
}))
app.delete('/api/account', requireConfig, authenticate, asyncRoute(async (req, res) => {
  const body = z.object({ password: z.string().min(1).max(128) }).strict().parse(req.body)
  const user = await User.findById(req.user._id)
  if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) return res.status(401).json({ error: 'Password did not match.' })
  await FinanceRecord.deleteMany({ owner: user._id })
  await user.deleteOne()
  res.clearCookie('finsight_session', { ...cookieOptions, maxAge: undefined }).status(204).end()
}))

for (const kind of ['transaction', 'budget', 'goal', 'bill']) {
  const base = `/api/${kind}s`
  app.get(base, requireConfig, authenticate, asyncRoute(async (req, res) => {
    const rows = await FinanceRecord.find({ owner: req.user._id, kind }).sort({ date: -1, createdAt: -1 }).lean()
    res.json({ data: rows })
  }))
  app.post(base, requireConfig, authenticate, asyncRoute(async (req, res) => {
    const body = recordInput.parse({ ...req.body, kind })
    const data = await FinanceRecord.create({ ...body, owner: req.user._id })
    res.status(201).json({ data })
  }))
  app.patch(`${base}/:id`, requireConfig, authenticate, asyncRoute(async (req, res) => {
    const body = recordInput.omit({ kind: true }).partial().parse(req.body)
    const data = await FinanceRecord.findOneAndUpdate({ _id: req.params.id, owner: req.user._id, kind }, body, { new: true, runValidators: true }).lean()
    if (!data) return res.status(404).json({ error: 'Record not found.' })
    res.json({ data })
  }))
  app.delete(`${base}/:id`, requireConfig, authenticate, asyncRoute(async (req, res) => {
    const result = await FinanceRecord.deleteOne({ _id: req.params.id, owner: req.user._id, kind })
    if (!result.deletedCount) return res.status(404).json({ error: 'Record not found.' })
    res.status(204).end()
  }))
}
app.get('/api/export', requireConfig, authenticate, asyncRoute(async (req, res) => {
  const records = await FinanceRecord.find({ owner: req.user._id }).sort({ date: -1, createdAt: -1 }).lean()
  res.setHeader('Content-Disposition', 'attachment; filename="finsight-export.json"')
  res.json({ exportedAt: new Date().toISOString(), records })
}))

app.use((err, _req, res, _next) => {
  if (err instanceof z.ZodError) return res.status(400).json({ error: 'Some information needs a second look.', fields: err.issues.map(issue => ({ field: issue.path.join('.'), message: issue.message })) })
  if (err?.code === 11000) return res.status(409).json({ error: 'An account with this email already exists.' })
  if (err?.name === 'CastError') return res.status(400).json({ error: 'The requested record ID is invalid.' })
  if (!isProduction) console.error('API request failed:', err?.message || 'Unknown error')
  res.status(500).json({ error: 'Something went wrong. Please try again.' })
})

const port = Number(process.env.PORT || 4000)
if (process.env.MONGODB_URI && jwtSecret) {
  mongoose.connect(process.env.MONGODB_URI, { autoIndex: isProduction ? false : true }).then(() => {
    return Promise.all([User.init(), FinanceRecord.init()]).then(() => app.listen(port, '0.0.0.0', () => console.log(`FinSight API listening on ${port}`)))
  }).catch(() => { console.error('Database connection or index initialization failed.'); process.exitCode = 1 })
} else {
  app.listen(port, '0.0.0.0', () => console.log(`FinSight API listening on ${port}; account endpoints disabled until configured`))
}

export { app }
