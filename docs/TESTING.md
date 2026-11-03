# Testing status

Financial calculation unit tests live in `client/src/finance.test.ts` and cover monthly aggregation, category totals, goal estimates, large expense detection, and health-score bounds.

Run:

```sh
npm ci
npm ci --prefix client
npm test
npm run build
```

API integration tests require a MongoDB instance and two accounts; they were not run in this workspace. Responsive layout review and full browser journeys also remain outstanding. See the delivery summary for commands that were actually executed and their results.
