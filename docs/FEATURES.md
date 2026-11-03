# Feature status

## Working account portal

- Overview dashboard with balance, current month income and expense, savings rate, spending mix, cash flow, budget usage, goals, and payment reminders.
- Add and delete income or expense entries, search/filter, and CSV export.
- Category budget creation and limit editing; usage is calculated from saved expenses.
- Savings goal creation, contribution, deletion, progress, and estimated monthly pace.
- Analytics, rule-based explanatory insights, bills/calendar, notifications, reports, theme preference, account profile, and sign out.
- Responsive navigation and layouts; records are browser-local and separated by signed-in email.

## Authentication and API

- Registration, sign-in/out, profile update, password hashing, signed HTTP-only cookie, and account deletion.
- Owner-scoped CRUD for transactions, budgets, goals, and bills; JSON data export.
- Input validation, rate limiting, origin checks, security headers, and health endpoint.

## Not yet complete

- Authentication calls the API when its database is configured. Finance CRUD in the client is still local to the browser and is not synchronized to the account API. Password recovery email is not implemented.
- CSV import, transaction editing, recurring-payment generation, PDF reports, persistent notifications, custom categories, and full date-range comparisons are not implemented.
- The calendar contains user-managed reminders; it does not create reminders from a bank feed.
- AI is deterministic rules in the browser. No AI provider is configured or called.
- No live database, production deployment, responsive browser-matrix QA, or security certification is claimed.
# Authentication and entry flow

FinSight opens with a sign-up page and a sign-in tab. Email/password account requests use the Express authentication API, HTTP-only session cookies, bcrypt password hashing, server validation, and rate limiting. There is no demo shortcut or prefilled synthetic ledger; new accounts start empty. The account API requires `MONGODB_URI` and `JWT_SECRET`. The signed-in finance screens still use browser storage in this MVP and are not yet synced to the API.
