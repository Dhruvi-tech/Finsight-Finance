# Security and privacy

- Production mode requires `MONGODB_URI`, a strong random `JWT_SECRET`, and the exact HTTPS client origin in `CLIENT_ORIGIN`.
- Passwords use bcrypt with work factor 12. Sessions are signed, seven-day, HTTP-only cookies; cookies are Secure and SameSite=None in production. Use HTTPS at both hosts.
- Optional authenticator-app MFA uses RFC 6238 TOTP with a 30-second step, one-step clock tolerance, replay prevention, encrypted AES-256-GCM secrets, a five-minute login challenge, and single-use hashed recovery codes. Configure `MFA_ENCRYPTION_KEY` with 32 random bytes encoded as 64 hex characters. Generate with `openssl rand -hex 32` and store only in the API secret manager.
- Auth endpoints are rate limited. Helmet sets security headers. CORS and an explicit Origin check restrict browser requests. JSON request size is capped; Zod rejects malformed and unknown fields.
- Every user record query is owner-scoped using the authenticated user id. Errors are generic in production. Request bodies and finance values are not logged.
- Finance records currently live in browser localStorage and are not synchronized to the owner-scoped API. Do not enter real financial information.
- No banking integration, regulatory compliance, independent penetration test, or security certification is claimed.

Before public use, wire finance data CRUD to the API, add password reset delivery and CSRF/session review for the actual deployment topology, verify account deletion/export and MFA enrollment/recovery end to end, run dependency/security scans, and perform a security review. Secrets must be configured in the host's secret manager and must never be committed.
