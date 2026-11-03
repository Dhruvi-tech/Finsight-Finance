# Feature status

## Working in browser demo mode

- Overview dashboard with balance, current month income and expense, savings rate, spending mix, cash flow, budget usage, goals, and payment reminders.
- Add and delete income or expense entries, search/filter, and CSV export.
- Category budget creation and limit editing; usage is calculated from saved expenses.
- Savings goal creation, contribution, deletion, progress, and estimated monthly pace.
- Analytics, rule-based explanatory insights, bills/calendar, notifications, reports, theme preference, and demo reset.
- Responsive navigation and layouts; all demo financial records are synthetic and browser-local.

## Prepared API foundations

- Registration, sign-in/out, profile update, password hashing, signed HTTP-only cookie, and account deletion.
- Owner-scoped CRUD for transactions, budgets, goals, and bills; JSON data export.
- Input validation, rate limiting, origin checks, security headers, and health endpoint.

## Not yet complete

- The browser demo does not call the API. There is no login/register UI, protected client route, password recovery email flow, account export UI, or MongoDB integration journey yet.
- CSV import, transaction editing, recurring-payment generation, PDF reports, persistent notifications, custom categories, and full date-range comparisons are not implemented.
- The calendar contains user-managed demo reminders; it does not create reminders from a bank feed.
- AI is deterministic rules in the browser. No AI provider is configured or called.
- No live database, production deployment, responsive browser-matrix QA, or security certification is claimed.
