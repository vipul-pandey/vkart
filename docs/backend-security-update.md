# Backend dependency security update

## Scope

This update covers the `backend` npm workspace started by `backend/server.js`,
the backend currently being prepared for EC2. It is not a security audit of the
entire application. The independent Docker services under `backend/services/`
and the frontend dependency tree are not covered; do not interpret the backend
audit result as a clean bill of health for those separate deployments.

## Changes

- Upgrade Express within v4 and Mongoose within v6 to patched releases.
- Upgrade Cloudinary to v2, Multer to v2, and jsonwebtoken to v9.
- Replace legacy `mailgun-js` with the maintained `mailgun.js` SDK, preserving
  existing callback call sites. `MAILGUN_DOMAIN` is preferred, with the existing
  `MAILGUN_DOMIAN` spelling retained as a fallback. For EU accounts, set
  `MAILGUN_API_URL=https://api.eu.mailgun.net`.
- Restrict application JWT signing/verification to HS256.
- Cap each image upload at 5 MiB, reject missing/unexpected files, and propagate
  asynchronous Cloudinary failures to Express error middleware.
- Require authenticated admins on the destructive seed endpoint. Never call it
  as a health check or startup step. Initial admin provisioning is a separate,
  explicitly authorized operation.
- `npm start --workspace=backend` now runs Node directly; local watch mode is
  `npm run dev --workspace=backend` (also used by root `dev:backend`).

## Reproduce checks (Node 22)

From the repository root:

```sh
npm ci --workspace=backend --include-workspace-root=false --omit=dev
npm test --workspace=backend
npm audit --workspace=backend --include-workspace-root=false --omit=dev
```

Tests cover JWT claims/rejections, authorization, existing model/route imports,
multipart upload limits, mocked Cloudinary success/failure, and Mailgun requests
against a local fake HTTP endpoint. They do not send real emails, upload real
assets, or modify a production database. Real Atlas/email/Cloudinary integration
smoke tests remain part of deployment verification.

On 2026-09-19 the backend-only production audit reported zero known
vulnerabilities, down from 34. Audit data can change; rerun before deployment.
Do not use `npm audit fix --force` blindly.
