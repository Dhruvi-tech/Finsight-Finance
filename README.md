# FinSight

**See Your Money. Understand Your Future.**

FinSight is a student-oriented personal finance experience for understanding everyday income, spending, budgets, and savings goals. The new implementation preserves the source repository's original README and initial commit in its Git history.

> **Current status:** the responsive browser app is a synthetic-data demo. Its financial records stay in this browser's `localStorage`. A separate Express/MongoDB API foundation is included, but the browser app is not yet connected to it. Do not enter real financial information or use this as a live account system.

## Product features

- Overview with current balance, income, expenses, savings rate, cash-flow charts, category mix, budget pulse, recent activity, goals, and upcoming payment reminders.
- Income/expense entry, search, type filtering, delete confirmation, and CSV export.
- Category budget limits and usage calculations based on ledger entries.
- Savings goals with progress, contribution recording, completion pace, and goal management.
- Interactive analytics charts and category reporting.
- Rule-based, explainable FinSight insights that use browser-saved demo records.
- Bills and calendar reminders, notifications, report preview, profile preferences, theme toggle, and demo reset.
- Responsive layouts for desktop, tablet, and mobile.

## Architecture

- **Client:** React 19, TypeScript, Vite, Recharts, Lucide icons, and a custom responsive CSS design system.
- **API foundation:** Node.js, Express, MongoDB, Mongoose, bcrypt password hashing, signed HTTP-only JWT session cookie, Zod validation, Helmet, CORS/origin checks, and rate limiting.
- **Demo persistence:** browser `localStorage`, clearly marked as demo mode.
- **Production data:** API `FinanceRecord` documents are scoped by the authenticated user's id. Browser/API integration and production account journeys remain unfinished.

See [architecture](docs/ARCHITECTURE.md), [feature status](docs/FEATURES.md), [database schema](docs/DATABASE.md), and [API reference](docs/API.md).

## Local setup

Requires Node.js 24 and npm.

```sh
npm ci
npm ci --prefix client
npm run dev
```

The Vite client runs at `http://localhost:5173`; the API runs at `http://localhost:4000`. Without database settings, the API starts in limited mode: `/api/health` is available, but account routes are disabled.

Copy `.env.example` to `.env` and configure `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_ORIGIN` to enable the API. Keep secrets in local environment files or the deployment provider's secret store. `client/.env.example` documents `VITE_API_URL`; the current demo client does not yet consume it.

## Checks

```sh
npm test
npm run build
```

The calculation tests cover monthly totals, category totals, savings estimates, large expenses, and health-score boundaries. Database-backed auth, isolation, and CRUD integration tests were not run because no MongoDB service or credentials were provided. Check [testing status](docs/TESTING.md).

## Deployment preparation

The repository includes `vercel.json`, `render.yaml`, and GitHub Actions CI configuration. The client is prepared for Vercel and the API for Render with MongoDB Atlas. No live deployment exists yet. Follow [deployment instructions](docs/DEPLOYMENT.md); external account authorization and database configuration are required.

## Screenshots

No dated product screenshots have been captured yet. See `docs/intellectual-property/SCREENSHOT_REGISTER.md` for the register and capture guidance.

## Security and privacy

The browser demo contains synthetic values only. It does not connect to banks or move money. The API foundation hashes passwords and filters stored records by the authenticated owner, but needs a configured database, browser authentication integration, password recovery, end-to-end integration tests, and security review before handling real records. FinSight does not claim regulatory compliance or a security certification.

See [security notes](docs/SECURITY.md). Do not commit API keys, passwords, signing secrets, connection strings, or user financial data.

## Contributors and rights

The original repository contains only a README and initial commit; the referenced product PDF was not present among the available files. Contributor and proposed-owner details supplied in the earlier project brief are preserved as unverified project information in [contributions and ownership](docs/CONTRIBUTIONS_AND_OWNERSHIP.md). No repository licence is included pending ownership and licensing clarification. See the [third-party register](docs/THIRD_PARTY_LICENSES.md).
