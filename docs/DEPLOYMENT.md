# Deployment preparation

The public static demo is published at https://dhruvi-tech.github.io/Finsight-Finance/ from the `gh-pages` branch. It includes the browser-only demo portal and empty starting data. This static site does not provide account registration, sign-in, or MFA until the API and database are deployed. GitHub Pages uses the account name in its default project URL; a shorter `finsight…` address needs a custom domain or a configured hosting provider with an available project subdomain. The repository also keeps Vercel and Render configuration for a future hosted client/API setup.

1. Create a MongoDB Atlas database and restrict network access to the API host. Use a least-privilege application user.
2. Deploy the repository's `render.yaml` as a Render web service. Set `MONGODB_URI`, generated `JWT_SECRET`, `MFA_ENCRYPTION_KEY` (`openssl rand -hex 32`), and `CLIENT_ORIGIN` (the final HTTPS client origin). Keep a protected backup of the MFA encryption key; without it, encrypted authenticator secrets cannot be decrypted. Confirm `/api/health` reports `connected`.
3. For a permanent production setup, deploy `client/` via the root `vercel.json` (or retain GitHub Pages for the browser-only demo). Configure the production API URL in client environment settings to connect authentication to the separately hosted API.
4. Configure production auth and cookie domains/origins, then test registration, session persistence, data isolation, account export and account deletion with two separate test accounts.
5. Enable HTTPS, review host logs for sensitive data, and run the CI workflow before release.

Required API environment variables: `NODE_ENV=production`, `PORT` (provided by Render), `MONGODB_URI`, `JWT_SECRET` (at least 32 bytes of random material), `MFA_ENCRYPTION_KEY` (32 random bytes encoded as 64 hex characters), `CLIENT_ORIGIN`. Optional client build variable: `VITE_API_URL`; the account UI uses it to reach the separately hosted API.

To enable real accounts, create and authorize MongoDB Atlas and Render, configure the environment variables above, and set `CLIENT_ORIGIN` to the public site URL. Do not add local `.env` files to GitHub. The public demo link is verified separately from the API; authenticated account features remain unavailable until `/api/health` reports a connected database.
