import { describe, expect, it } from 'vitest'
import { createRecoveryCodes, decodeBase32, decryptSecret, encodeBase32, encryptSecret, hashRecoveryCode, totpAt, verifyTotp } from './mfa.mjs'

describe('TOTP and MFA secret protection', () => {
  it('matches the RFC 6238 SHA-1 test vector', () => {
    const secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'
    expect(totpAt(secret, 59_000, 8)).toBe('94287082')
  })

  it('round trips base32 values and accepts a TOTP only once', () => {
    const secret = encodeBase32(Buffer.from('finsight-authenticator-secret'))
    expect(decodeBase32(secret).toString()).toBe('finsight-authenticator-secret')
    const now = 1_700_000_005_000
    const code = totpAt(secret, now)
    const counter = verifyTotp(secret, code, now, -1)
    expect(counter).toBe(Math.floor(now / 30_000))
    expect(verifyTotp(secret, code, now, counter)).toBeNull()
  })

  it('encrypts authenticator secrets with authenticated encryption', () => {
    const key = 'c'.repeat(64)
    const encrypted = encryptSecret('MYTOTPSECRET', key)
    expect(encrypted).not.toContain('MYTOTPSECRET')
    expect(decryptSecret(encrypted, key)).toBe('MYTOTPSECRET')
    expect(() => decryptSecret(encrypted, 'd'.repeat(64))).toThrow()
  })

  it('creates unique recovery codes and stores only one-way digests', () => {
    const codes = createRecoveryCodes()
    expect(codes).toHaveLength(8)
    expect(new Set(codes).size).toBe(8)
    expect(hashRecoveryCode(codes[0])).toMatch(/^[\da-f]{64}$/u)
    expect(hashRecoveryCode(codes[0])).not.toBe(codes[0])
  })
})
