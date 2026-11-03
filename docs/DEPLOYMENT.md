# Deployment

## Free public website

The default Render Blueprint in [render.yaml](../render.yaml) publishes the client as a static site. The live service is `https://finsight-personal-finance.onrender.com`. To deploy a separate copy into another Render workspace, use the [Deploy to Render](https://render.com/deploy?repo=https://github.com/Dhruvi-tech/Finsight-Finance) button in the README and connect the public repository. Render static sites are free and receive a public `onrender.com` URL.

This is a browser-only demo with empty starting data. Account registration, sign-in, and MFA need the API and database to be deployed separately. Finance records remain in local browser storage and are not synchronized to the API.

## Optional API setup

The API Blueprint is in [render-api.yaml](../render-api.yaml). Create a MongoDB Atlas database before deploying it, then provide the requested secrets and client origin. Without these values, account authentication remains unavailable.

1. Create a MongoDB Atlas database and restrict network access to the API host. Use a least-privilege application user.
2. Deploy `render-api.yaml` as a separate Render Blueprint. Set `MONGODB_URI`, generated `JWT_SECRET`, `MFA_ENCRYPTION_KEY` (`openssl rand -hex 32`), and `CLIENT_ORIGIN` (the final HTTPS client origin). Keep a protected backup of the MFA encryption key; without it, encrypted authenticator secrets cannot be decrypted. Confirm `/api/health` reports `connected`.
3. Configure the production API URL in the Render static site's build environment as `VITE_API_URL` to connect authentication to the separately hosted API.
4. Configure production auth and cookie domains/origins, then test registration, session persistence, data isolation, account export and account deletion with two separate test accounts.
5. Enable HTTPS, review host logs for sensitive data, and run the CI workflow before release.

Required API environment variables: `NODE_ENV=production`, `PORT` (provided by Render), `MONGODB_URI`, `JWT_SECRET` (at least 32 bytes of random material), `MFA_ENCRYPTION_KEY` (32 random bytes encoded as 64 hex characters), `CLIENT_ORIGIN`. Optional client build variable: `VITE_API_URL`; the account UI uses it to reach the separately hosted API.

To enable real accounts, create and authorize MongoDB Atlas and Render, configure the environment variables above, and set `CLIENT_ORIGIN` to the public site URL. Do not add local `.env` files to GitHub. The public demo link is verified separately from the API; authenticated account features remain unavailable until `/api/health` reports a connected database.
