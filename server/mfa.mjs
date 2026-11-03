import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export function encodeBase32(buffer) {
  let bits = 0
  let value = 0
  let result = ''
  for (const byte of buffer) {
    value = (value << 8) | byte
    bits += 8
    while (bits >= 5) {
      result += alphabet[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits) result += alphabet[(value << (5 - bits)) & 31]
  return result
}

export function decodeBase32(text) {
  let bits = 0
  let value = 0
  const output = []
  for (const char of text.toUpperCase().replace(/=+$/u, '').replace(/\s+/gu, '')) {
    const digit = alphabet.indexOf(char)
    if (digit < 0) throw new Error('Invalid base32 secret.')
    value = (value << 5) | digit
    bits += 5
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }
  return Buffer.from(output)
}

export function totpAt(secret, timestamp = Date.now(), digits = 6) {
  const counter = Math.floor(timestamp / 30_000)
  const message = Buffer.alloc(8)
  message.writeBigUInt64BE(BigInt(counter))
  const hmac = createHmac('sha1', decodeBase32(secret)).update(message).digest()
  const offset = hmac[hmac.length - 1] & 15
  const binary = ((hmac[offset] & 127) << 24) | ((hmac[offset + 1] & 255) << 16) | ((hmac[offset + 2] & 255) << 8) | (hmac[offset + 3] & 255)
  return String(binary % (10 ** digits)).padStart(digits, '0')
}

export function verifyTotp(secret, submitted, timestamp = Date.now(), lastCounter = -1) {
  if (!/^\d{6}$/u.test(String(submitted))) return null
  const current = Math.floor(timestamp / 30_000)
  for (const counter of [current, current - 1, current + 1]) {
    if (counter <= lastCounter || counter < 0) continue
    const expected = Buffer.from(totpAt(secret, counter * 30_000), 'utf8')
    const actual = Buffer.from(String(submitted), 'utf8')
    if (timingSafeEqual(expected, actual)) return counter
  }
  return null
}

function encryptionKey(hexKey) {
  if (!/^[\da-f]{64}$/iu.test(hexKey || '')) throw new Error('MFA_ENCRYPTION_KEY must be a 32-byte (64 hex character) key.')
  return Buffer.from(hexKey, 'hex')
}

export function encryptSecret(secret, hexKey) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(hexKey), iv)
  const ciphertext = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()])
  return [iv.toString('hex'), cipher.getAuthTag().toString('hex'), ciphertext.toString('hex')].join('.')
}

export function decryptSecret(value, hexKey) {
  const [ivHex, tagHex, encryptedHex] = String(value || '').split('.')
  if (!ivHex || !tagHex || !encryptedHex) throw new Error('Encrypted MFA secret is invalid.')
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(hexKey), Buffer.from(ivHex, 'hex'))
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'))
  return Buffer.concat([decipher.update(Buffer.from(encryptedHex, 'hex')), decipher.final()]).toString('utf8')
}

export function createRecoveryCodes(count = 8) {
  return Array.from({ length: count }, () => randomBytes(8).toString('hex').toUpperCase())
}

export function hashRecoveryCode(code) {
  return createHmac('sha256', process.env.JWT_SECRET || 'finsight-local-mfa-test-only').update(String(code).replace(/[-\s]/gu, '').toUpperCase()).digest('hex')
}
