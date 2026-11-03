# Deployment preparation

The checked-in configuration prepares a Vercel static client and Render Node API. No service has been connected or deployed from this workspace.

1. Create a MongoDB Atlas database and restrict network access to the API host. Use a least-privilege application user.
2. Deploy the repository's `render.yaml` as a Render web service. Set `MONGODB_URI`, generated `JWT_SECRET`, and `CLIENT_ORIGIN` (the final HTTPS Vercel origin). Confirm `/api/health` reports `connected`.
3. Deploy `client/` via the root `vercel.json`. Configure the production API URL in client environment settings if/when the client API integration is implemented.
4. Configure production auth and cookie domains/origins, then test registration, session persistence, data isolation, account export and account deletion with two separate test accounts.
5. Enable HTTPS, review host logs for sensitive data, and run the CI workflow before release.

Required API environment variables: `NODE_ENV=production`, `PORT` (provided by Render), `MONGODB_URI`, `JWT_SECRET` (at least 32 bytes of random material), `CLIENT_ORIGIN`. Optional client build variable: `VITE_API_URL`; currently the demo UI does not consume it.

Manual account actions are still required: create and authorize MongoDB Atlas, Render, and Vercel projects; configure billing/regions and secrets; select final production URLs; then authorize deployments. Do not add the local `.env` to GitHub. Deployment remains unverified until a live URL and database health response are checked.
