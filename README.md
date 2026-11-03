<div align="center">

<img src="docs/finsight-readme.gif" alt="FinSight animated banner: see your money, understand your future" width="100%" />

# FinSight

### See your money. Understand your future.

**A calmer, clearer view of your income, spending, savings, and plans.**

[Open the live demo](https://finsight-personal-finance.onrender.com) · [Explore the features](docs/FEATURES.md) · [Deployment notes](docs/DEPLOYMENT.md)

[![FinSight checks](https://github.com/Dhruvi-tech/finsight-personal-finance/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Dhruvi-tech/finsight-personal-finance/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-19-173B3A?logo=react&logoColor=9ddcba)
![TypeScript](https://img.shields.io/badge/TypeScript-5-173B3A?logo=typescript&logoColor=9ddcba)
![License](https://img.shields.io/badge/license-not%20specified-d4ad61)

</div>

> **Demo status:** The public site opens in your browser with an empty finance space. Use the small **Demo sign in** link on the account screen to explore it. Account registration, server sign-in, and multi-factor authentication need a deployed API and database. Finance records currently stay in browser storage and are not synced. Please do not enter sensitive financial information.

## A clearer picture of your finances

FinSight is a student-oriented personal finance dashboard for building a steady money routine. It brings everyday activity and longer-term goals together in one responsive workspace.

| See the whole picture | Make a plan | Stay on track |
| --- | --- | --- |
| Balance, income, expenses, cash flow, categories, and recent activity | Budgets, savings goals, bills, reminders, and a 30-day outlook | Search, filters, CSV export, notifications, and explainable insights |

### What you can do

- Record and review income and expenses, filter transactions, confirm deletes, and export a CSV.
- Set category budgets and savings goals, track progress, and record goal contributions.
- Explore cash-flow charts, category reports, recurring-spend signals, and rule-based insights.
- Manage payment reminders, notifications, profile preferences, themes, and sign-out.
- Collapse the desktop sidebar to an icon rail, open the mobile drawer, and use keyboard shortcuts (Ctrl/Cmd+K to search; N to add).
- Customize dashboard widgets, view savings milestones, receive budget and spending alerts, and export period-based PDF reports.
- Use responsive layouts on desktop, tablet, and mobile.
- Preview account creation, sign-in, and optional authenticator-app MFA flows. These require the separately deployed API to work with real accounts.

## Run it locally

Requires Node.js 24 and npm.

```sh
npm ci
npm ci --prefix client
npm run dev
```

The Vite client runs at `http://localhost:5173`; the API runs at `http://localhost:4000`. Without database settings, the API starts in limited mode and account routes are unavailable.

To enable account creation and sign-in locally, copy `.env.example` to `.env` and configure `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_ORIGIN`. Keep secrets in local environment files or your deployment provider’s secret store. Vite proxies `/api` during development; set `VITE_API_URL` when the API is hosted separately.

## Built with

- **Client:** React 19, TypeScript, Vite, Recharts, Lucide, jsPDF, and a custom responsive motion-aware design system.
- **API foundation:** Node.js, Express, MongoDB, Mongoose, bcrypt, signed HTTP-only JWT cookies, Zod, Helmet, CORS checks, and rate limiting.
- **Storage today:** finance records use browser `localStorage`, namespaced by signed-in email. Client/API finance-data sync is not implemented.

See the [architecture](docs/ARCHITECTURE.md), [database schema](docs/DATABASE.md), and [API reference](docs/API.md).

## Checks

```sh
npm test
npm run build
```

The calculation tests cover monthly totals, category totals, savings estimates, large expenses, and health-score boundaries. Database-backed auth, account isolation, and CRUD integration tests need a MongoDB service and credentials. See [testing status](docs/TESTING.md).

## Open or deploy FinSight

The free Render static site is live at **https://finsight-personal-finance.onrender.com**. Render serves static sites from a public `onrender.com` address and supports deploying them free of charge. Use the button below to deploy a separate copy to your own Render workspace.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Dhruvi-tech/finsight-personal-finance)

- **Website:** [finsight-personal-finance.onrender.com](https://finsight-personal-finance.onrender.com)
- **Source:** [FinSight on GitHub](https://github.com/Dhruvi-tech/finsight-personal-finance)
- **Setup:** [deployment guide](docs/DEPLOYMENT.md) · [feature status](docs/FEATURES.md) · [security notes](docs/SECURITY.md)

## Security and privacy

FinSight does not connect to banks or move money. The API foundation hashes passwords and filters stored records by authenticated owner, but needs a configured database, finance-data API synchronization, password recovery, end-to-end integration tests, and security review before handling real records. FinSight does not claim regulatory compliance or a security certification.

Never commit API keys, passwords, signing secrets, connection strings, or personal financial data. Review the [security notes](docs/SECURITY.md) before deploying.

## Project notes

The source repository began with a README and initial commit; the product PDF referenced in the earlier brief was not present among the available files. Contributor and proposed-owner details remain unverified in [contributions and ownership](docs/CONTRIBUTIONS_AND_OWNERSHIP.md). No repository license is included pending ownership and licensing clarification. See the [third-party register](docs/THIRD_PARTY_LICENSES.md).
