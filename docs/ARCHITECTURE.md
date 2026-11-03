# Architecture

FinSight is a small monorepo with a Vite/React/TypeScript client and an Express/Mongoose API. The client is currently a clearly labelled browser-only demo: synthetic sample entries are stored in localStorage, and calculations are derived from those entries. The API is a separate production-oriented foundation with MongoDB-backed records and HTTP-only JWT session cookies. The demo client is not yet wired to sign-in or the API, so demo records are not uploaded to the server.

```text
Browser (Vite / React)
  └─ Demo ledger in localStorage (synthetic only)

Vercel static client (prepared)
  └─ HTTPS + credentialed CORS → Express API (prepared for Render)
       ├─ Helmet, origin check, rate limited auth, Zod validation
       ├─ HTTP-only session cookie; user derived from verified JWT
       └─ MongoDB Atlas / Mongoose
            ├─ users (unique email, bcrypt password hash)
            └─ finance_records (owner + kind index; owner-scoped queries)
```

## Structure

- `client/src/App.tsx`: app shell, screens, and demo interactions.
- `client/src/finance.ts`: pure financial calculations shared with unit tests.
- `client/src/App.css`, `client/src/index.css`: responsive FinSight design system.
- `server/index.mjs`: Express API, validation, auth, and persistence layer.
- `docs/`: technical, deployment, and project-origin records.

The user id for every server data query comes from the signed session, never from a request body or query parameter. Record mutations include both `_id` and `owner` in the database filter. API mode requires MongoDB and a high-entropy JWT secret. Account recovery email and production account workflows need to be configured before public use.
