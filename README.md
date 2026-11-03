# FinSight

**See Your Money. Understand Your Future.**

FinSight is a student-oriented personal finance experience for understanding everyday income, spending, budgets, and savings goals. The new implementation preserves the source repository's original README and initial commit in its Git history.

> **Current status:** the responsive browser app opens on account creation and sign-in, with a small demo sign-in link on both tabs. The public demo runs in the browser and starts with an empty finance space. Email account creation, sign-in, and MFA require a deployed API with MongoDB and production secrets. Finance records are stored in browser local storage and are not synchronized to the API; do not enter sensitive financial information.

## Product features

- Overview with current balance, income, expenses, savings rate, cash-flow charts, category mix, budget pulse, recent activity, goals, upcoming payment reminders, a 30-day outlook, and repeat-spending detection.
- Income/expense entry, search, type filtering, delete confirmation, and CSV export.
- Category budget limits and usage calculations based on ledger entries.
- Savings goals with progress, contribution recording, completion pace, and goal management.
- Interactive analytics charts and category reporting.
- Rule-based, explainable FinSight insights based on the signed-in account’s browser records.
- Bills and calendar reminders, notifications, report preview, profile preferences, theme toggle, and sign-out control.
- Responsive layouts for desktop, tablet, and mobile.
- Sign-up and sign-in screens using email/password, with clear API readiness feedback and password visibility control.
- Optional authenticator-app MFA with single-use recovery codes and a second sign-in step.

## Architecture

- **Client:** React 19, TypeScript, Vite, Recharts, Lucide icons, and a custom responsive CSS design system.
- **API foundation:** Node.js, Express, MongoDB, Mongoose, bcrypt password hashing, signed HTTP-only JWT session cookie, Zod validation, Helmet, CORS/origin checks, and rate limiting.
- **Finance data:** browser `localStorage`, namespaced by signed-in email until API sync is implemented.
- **Account entry:** API signup/login creates a bcrypt-hashed account and an HTTP-only session cookie. Signed-in portal finance data remains browser-local and per-email namespaced until client/API sync is implemented.

See [architecture](docs/ARCHITECTURE.md), [feature status](docs/FEATURES.md), [database schema](docs/DATABASE.md), and [API reference](docs/API.md).

## Local setup

Requires Node.js 24 and npm.

```sh
npm ci
npm ci --prefix client
npm run dev
```

The Vite client runs at `http://localhost:5173`; the API runs at `http://localhost:4000`. Without database settings, the API starts in limited mode: `/api/health` is available, but account routes are disabled.

Copy `.env.example` to `.env` and configure `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_ORIGIN` to enable account creation and sign-in. Keep secrets in local environment files or the deployment provider's secret store. Vite proxies `/api` to the local API during development; set `VITE_API_URL` for a separately deployed API.

## Checks

```sh
npm test
npm run build
```

The calculation tests cover monthly totals, category totals, savings estimates, large expenses, and health-score boundaries. Database-backed auth, isolation, and CRUD integration tests were not run because no MongoDB service or credentials were provided. Check [testing status](docs/TESTING.md).

## Deployment preparation

The client is published as a static public demo on GitHub Pages. Account authentication and MFA need an API deployment on Render and a configured MongoDB Atlas database. See [deployment instructions](docs/DEPLOYMENT.md) for the current public demo link and remaining setup.

## Links

- **Public demo:** https://dhruvi-tech.github.io/finsight-personal-finance/
- **GitHub repository:** https://github.com/Dhruvi-tech/finsight-personal-finance
- [Deployment setup](docs/DEPLOYMENT.md) · [API reference](docs/API.md) · [Feature status](docs/FEATURES.md)

## Screenshots

No dated product screenshots have been captured yet. See `docs/intellectual-property/SCREENSHOT_REGISTER.md` for the register and capture guidance.

## Security and privacy

The app does not connect to banks or move money. The API foundation hashes passwords and filters stored records by the authenticated owner, but needs a configured database, finance-data API synchronization, password recovery, end-to-end integration tests, and security review before handling real records. FinSight does not claim regulatory compliance or a security certification.

See [security notes](docs/SECURITY.md). Do not commit API keys, passwords, signing secrets, connection strings, or user financial data.

## Contributors and rights

The original repository contains only a README and initial commit; the referenced product PDF was not present among the available files. Contributor and proposed-owner details supplied in the earlier project brief are preserved as unverified project information in [contributions and ownership](docs/CONTRIBUTIONS_AND_OWNERSHIP.md). No repository licence is included pending ownership and licensing clarification. See the [third-party register](docs/THIRD_PARTY_LICENSES.md).
