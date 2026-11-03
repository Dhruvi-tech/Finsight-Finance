# Database

MongoDB collections are created by Mongoose models at startup. Production deployments should run with automatic index creation disabled; the expected indexes are listed below and must be created in the database before launch.

## `users`

| Field | Type | Notes |
|---|---|---|
| `name` | string | Required, trimmed, max 80 characters |
| `email` | string | Required, lowercased, unique |
| `passwordHash` | string | bcrypt hash; raw password is never persisted |
| `currency` | enum | INR by default; INR, USD, EUR, GBP |
| `createdAt`, `updatedAt` | date | Mongoose timestamps |

## `financerecords`

Shared typed record schema: `owner` (User ObjectId), `kind` (`transaction`, `budget`, `goal`, `bill`), `name`, `category`, `type`, `amount`, `date`, `method`, `note`, `limit`, `target`, `saved`, `dueDate`, `frequency`, `paid`, and timestamps. Schema is strict. Optional data fields depend on `kind`; request-level validation is performed with Zod. The owner is required and is assigned from the authenticated session only.

Indexes: `{ owner: 1, kind: 1 }` and `{ owner: 1, kind: 1, date: -1 }`. All reads, updates, and deletes filter by the authenticated owner and record kind. Account deletion removes that user's finance records first.

No bank account numbers, card numbers, or bank credentials are stored. The current finance client uses browser localStorage; account finance CRUD has not yet been synchronized to MongoDB.
