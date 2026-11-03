# Security and privacy

- Production mode requires `MONGODB_URI`, a strong random `JWT_SECRET`, and the exact HTTPS client origin in `CLIENT_ORIGIN`.
- Passwords use bcrypt with work factor 12. Sessions are signed, seven-day, HTTP-only cookies; cookies are Secure and SameSite=None in production. Use HTTPS at both hosts.
- Auth endpoints are rate limited. Helmet sets security headers. CORS and an explicit Origin check restrict browser requests. JSON request size is capped; Zod rejects malformed and unknown fields.
- Every user record query is owner-scoped using the authenticated user id. Errors are generic in production. Request bodies and finance values are not logged.
- Finance records currently live in browser localStorage and are not synchronized to the owner-scoped API. Do not enter real financial information.
- No banking integration, regulatory compliance, independent penetration test, or security certification is claimed.

Before public use, wire finance data CRUD to the API, add password reset delivery and CSRF/session review for the actual deployment topology, verify account deletion/export end to end, run dependency/security scans, and perform a security review. Secrets must be configured in the host's secret manager and must never be committed.
