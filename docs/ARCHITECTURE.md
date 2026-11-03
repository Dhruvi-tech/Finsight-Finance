# Architecture

FinSight is a small monorepo with a Vite/React/TypeScript client and an Express/Mongoose API. The client opens on email sign-up and sign-in, backed by the API session endpoints. The finance screens start empty and store user-entered records in localStorage namespaced by signed-in email. Finance CRUD is not yet synchronized with the owner-scoped MongoDB API.

```text
Browser (Vite / React)
  ├─ Sign-up / sign-in → HTTP-only session → Express API

Vercel static client (prepared)
  └─ HTTPS + credentialed CORS → Express API (prepared for Render)
       ├─ Helmet, origin check, rate limited auth, Zod validation
       ├─ HTTP-only session cookie; user derived from verified JWT
       └─ MongoDB Atlas / Mongoose
            ├─ users (unique email, bcrypt password hash)
            └─ finance_records (owner + kind index; owner-scoped queries)
```

## Structure

- `client/src/App.tsx`: authentication entry, app shell, and finance screens.
- `client/src/finance.ts`: pure financial calculations shared with unit tests.
- `client/src/App.css`, `client/src/index.css`: responsive FinSight design system.
- `server/index.mjs`: Express API, validation, auth, and persistence layer.
- `docs/`: technical, deployment, and project-origin records.

The user id for every server data query comes from the signed session, never from a request body or query parameter. Record mutations include both `_id` and `owner` in the database filter. API mode requires MongoDB and a high-entropy JWT secret. Finance data synchronization, account recovery email, and production account workflows need to be configured before public use.
