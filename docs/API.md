# API

Base path: `/api`. JSON request and response bodies use `application/json`; session auth uses the `finsight_session` HTTP-only cookie. Unsafe requests must include the configured `CLIENT_ORIGIN` as the browser `Origin`.

| Method | Path | Auth | Purpose |
|---|---|---:|---|
| GET | `/health` | No | API and database readiness |
| POST | `/auth/register` | No | Create account and session |
| POST | `/auth/login` | No | Verify credentials and create session |
| POST | `/auth/logout` | No | Clear session cookie |
| GET | `/auth/me` | Yes | Current account |
| PATCH | `/profile` | Yes | Change display name or currency |
| DELETE | `/account` | Yes | Confirm password and delete user records/account |
| GET/POST | `/transactions` | Yes | List/create transactions |
| PATCH/DELETE | `/transactions/:id` | Yes | Update/delete owned transaction |
| GET/POST | `/budgets`, `/goals`, `/bills` | Yes | List/create owned records |
| PATCH/DELETE | `/budgets/:id`, `/goals/:id`, `/bills/:id` | Yes | Update/delete owned records |
| GET | `/export` | Yes | Export the signed-in user's JSON records |

Registration body: `{ "name": "...", "email": "...", "password": "at least 10 characters" }`. Create record bodies require `name` and accept only documented fields; unknown fields are rejected. API validation errors return a generic message plus field names. Never send credentials or private financial values to logs.

The API endpoints have not been integration-tested against MongoDB in this environment because no database service/URI was supplied. See `TESTING.md` and `DEPLOYMENT.md`.
