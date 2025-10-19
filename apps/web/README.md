# apps/web

Next.js front-end application for the portfolio experience. This workspace hosts the Vercel-deployed site.

## Status

- Framework: Next.js 14 (App Router)
- Target Host: Vercel (Hobby plan)
- Package Manager: pnpm (managed via root workspace)

## Local Scripts

Scripts are defined in this package's `package.json`. Run them from repo root via `pnpm --filter web <script>`.

## Deployment Guide (Vercel)

1. **Create Vercel Project**

   - Log in to Vercel and create/import the GitHub repository.
   - Set the project root to the repository root; build command stays `pnpm --filter web build` once the app is scaffolded.

2. **Environment Variables**

   - Populate values from `apps/web/.env.example` (at minimum `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CMS_API_URL`, `NEXT_PUBLIC_R2_PUBLIC_BASE_URL`).
   - Mirror variables for Preview and Production environments.

3. **Link Secrets**

   - Store `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_WEB_PROJECT_ID` in GitHub secrets so the CI workflow (`.github/workflows/deploy-web.yml`) can deploy automatically on pushes to `main`.

4. **Install Dependencies & Build (CI)**

   - Quality gates (lint/typecheck/format) run via GitHub Actions before deploy.
   - Deployment job promotes to production when on `main`.

5. **Production Domain**

   - Default: `https://portfolio.vercel.app`
   - Replace with a custom domain via Vercel dashboard when ready.

6. **Health Verification**
   - After deployment, visit the production domain and confirm the placeholder page responds with HTTP 200.
   - Smoke-test dynamic assets once the site is implemented.
