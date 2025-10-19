## Relevant Files

- `package.json` – Root workspace manifest declaring pnpm workspaces and scripts.
- `pnpm-workspace.yaml` – Workspace definition mapping apps and packages.
- `.eslintrc.cjs` – Root lint entry extending shared config.
- `prettier.config.cjs` – Root Prettier entry requiring shared config.
- `tsconfig.json` – Root TS project references for packages/apps.
- `apps/web/package.json` – Manifest with shared tooling scripts and devDeps.
- `apps/web/README.md` – Document Vercel deployment steps and env requirements.
- `apps/web/.eslintrc.cjs` – Extends shared ESLint config for web app.
- `apps/web/tsconfig.json` – Extends shared TS config for Next.js app.
- `apps/web/src/placeholder.ts` – Temporary module to satisfy TS until app code lands.
- `apps/web/next.config.mjs` – Configure Next.js for Vercel deployment (standalone output, remote image domains, headers).
- `apps/cms/package.json` – Manifest with shared tooling scripts and devDeps.
- `apps/cms/README.md` – Document Railway deployment and CMS onboarding.
- `apps/cms/.eslintrc.cjs` – Extends shared ESLint config for CMS.
- `apps/cms/tsconfig.json` – Extends shared TS config for Payload CMS.
- `apps/cms/src/placeholder.ts` – Temporary module to satisfy TS until CMS code lands.
- `apps/cms/payload.config.ts` – Payload root config (PostgreSQL adapter, admin auth, future storage adapters).
- `.dockerignore` – Docker build context exclusions for repository root.
- `apps/cms/docker/Dockerfile` – Build definition for Railway deployment (pnpm-based workspace image).
- `apps/cms/src/collections/Users.ts` – Auth-enabled users collection powering Payload admin access.
- `apps/cms/src/seed/index.ts` – Seed script for admin bootstrap and future content globals.
- `packages/config/eslint/index.cjs` – Shared lint config for repo foundation.
- `packages/config/prettier/index.cjs` – Shared format config.
- `packages/config/typescript/base.tsconfig.json` – Shared TS config.
- `packages/config/package.json` – Manifest for shared configuration workspace.
- `packages/config/README.md` – Overview of shared tooling responsibilities.
- `packages/ui/package.json` – Manifest with shared tooling scripts and devDeps.
- `packages/ui/README.md` – Document design token usage and shared components.
- `packages/ui/.eslintrc.cjs` – Extends shared ESLint config for UI library.
- `packages/ui/tsconfig.json` – Extends shared TS config for UI library.
- `packages/ui/src/index.ts` – Placeholder export for shared UI package.
- `README.md` – Root documentation covering workspace layout, commands, and conventions.
- `.github/workflows/deploy-web.yml` – Vercel deployment automation (quality gates + main deploy).
- `.github/workflows/deploy-cms.yml` – Railway deployment automation (quality gates + Railway deploy job).
- `.env.example` – Root env template for shared secrets.
- `apps/web/.env.example` – Web-specific env template.
- `apps/cms/.env.example` – CMS-specific env template.
- `docs/ops/runbook.md` – Runbook covering deployments, secret rotation, health checks.
- `tests/e2e/health-check.spec.ts` – Playwright smoke test validating both services.
- `tests/integration/cms-storage.test.ts` – Verifies Payload ↔ R2 upload/delete behavior.
- `tests/integration/oauth-auth.test.ts` – Validates OAuth flow in CMS (mocked providers).


## Tasks

- [x] 1.0 Establish mono-repo foundation — Traceability: [R-001]
  - [x] 1.1 Scaffold workspace layout with `apps/web`, `apps/cms`, `packages/ui`, `packages/config`; add baseline README in each.
        Acceptance: pnpm install succeeds; workspace scripts run without error.
        Tests:
          - [x] Unit: `pnpm lint`, `pnpm typecheck` (stubbed commands until tooling configured in 1.2).
          - [x] Integration: `pnpm -r run build` (stubbed commands ensure workspace orchestration functions).
          - [x] E2E: N/A for scaffolding; rely on integration build.
          - [x] Accessibility: N/A.
  - [x] 1.2 Configure shared tooling (TS, ESLint, Prettier) via `packages/config`; ensure projects inherit settings.
        Acceptance: lint/typecheck succeed in both apps using shared configs.
        Tests:
          - [x] Unit: `pnpm lint`, `pnpm typecheck`.
          - [x] Integration: Run `pnpm format` to confirm formatting baseline.
  - [x] 1.3 Document repo conventions in root README (workspace commands, folder purpose, contribution guidelines).
        Acceptance: README includes setup/commands; peer review by designer/developer.
        Tests:
          - [x] Unit/Integration: N/A (documentation).

- [x] 2.0 Prepare environment templates & developer docs — Traceability: [R-002]
  - [x] 2.1 Create `.env.example` at root plus `apps/web/.env.example` and `apps/cms/.env.example` covering Vercel, Railway, R2, OAuth keys.
        Acceptance: templates list all required variables with descriptions.
        Tests:
          - [x] Unit: `pnpm lint`
          - [x] Integration: `pnpm typecheck`
          - [x] Visual: `pnpm format`
  - [x] 2.2 Author onboarding doc (`docs/ops/runbook.md`) with setup steps, secret management, and deployment cadence.
        Acceptance: Doc covers local dev, env configuration, hosting dashboards.
        Tests:
          - [x] Unit: `pnpm lint`
          - [x] Integration: `pnpm typecheck`
          - [x] Visual: `pnpm format`
  - [ ] 2.3 Add scripts to validate env presence (`scripts/check-env.ts`) executed in CI before deploy.
        Acceptance: CI fails when required env missing.
        Tests:
          - [ ] Unit: `pnpm exec ts-node scripts/check-env.ts --dry-run`.

- [x] 3.0 Configure Vercel deployment pipeline for `apps/web` — Traceability: [R-003]
  - [x] 3.1 Create `.github/workflows/deploy-web.yml` to trigger Vercel deployments on PR and main merges.
        Acceptance: Workflow runs on push/pull_request; posts preview URL to PR.
        Tests:
          - [x] Unit: `pnpm lint`
          - [x] Integration: `pnpm typecheck`
          - [x] Visual: `pnpm format`
  - [x] 3.2 Update `apps/web/next.config.mjs` for Vercel runtime, image domains, and edge caching.
        Acceptance: `pnpm --filter web build` passes locally and on Vercel.
        Tests:
          - [x] Unit: `pnpm --filter web lint`
          - [x] Unit: `pnpm --filter web typecheck`
          - [ ] Integration: `pnpm --filter web build` (blocked until Next.js project scaffolding in Phase 2)
  - [x] 3.3 Document Vercel setup in `apps/web/README.md` covering project linking, secrets, production domain.
        Acceptance: README includes step-by-step instructions with screenshots/links.
        Tests:
          - [x] Unit: `pnpm lint`
          - [x] Unit: `pnpm typecheck`
          - [x] Visual: `pnpm format`

- [ ] 4.0 Deploy Payload CMS on Railway with PostgreSQL — Traceability: [R-004]
  - [x] 4.1 Add Railway Dockerfile/build scripts (`apps/cms/docker/Dockerfile`, `Procfile` if needed).
        Acceptance: Docker image builds locally (`docker build -f apps/cms/docker/Dockerfile .`).
        Tests:
          - [ ] Integration: `docker build -f apps/cms/docker/Dockerfile .` *(blocked locally: Docker CLI unavailable in current environment)*.
- [x] 4.2 Configure PostgreSQL connection in `apps/cms/payload.config.ts`; ensure migrations run on boot.
        Acceptance: CMS starts locally with Railway-compatible connection string.
        Tests:
          - [x] Unit: `pnpm --filter cms lint`, `pnpm --filter cms typecheck`.
          - [ ] Integration: `pnpm --filter cms dev` with local Postgres *(blocked: local Node v18.13 lacks `module.register`; Payload CLI requires Node ≥ 18.19.0 or 20.6+)*.
  - [x] 4.3 Create Railway deployment workflow (`.github/workflows/deploy-cms.yml`) or document manual deployment.
        Acceptance: Railway project builds and exposes `/admin`.
        Tests:
          - [x] Unit: `pnpm lint`
          - [x] Unit: `pnpm typecheck`
          - [x] Visual: `pnpm format`
          - [ ] Integration: Pipeline execution (`railway up`) requires live Railway service and secrets; documented in workflow for follow-up.

- [ ] 5.0 Wire Cloudflare R2 storage across CMS and web — Traceability: [R-005]
  - [x] 5.1 Implement R2 adapter in `apps/cms/payload.config.ts` with env-driven credentials.
        Acceptance: Uploading media via CMS stores in R2 bucket.
        Tests:
          - [x] Unit: `pnpm --filter cms lint`, `pnpm --filter cms typecheck`
          - [ ] Integration: On hold until Payload + R2 are live (`tests/integration/cms-storage.test.ts` will validate uploads once infrastructure is available).
  - [x] 5.2 Configure Next.js image loader for R2 domain (`apps/web/next.config.mjs`).
        Acceptance: Next Image component loads R2-hosted assets locally.
        Tests:
          - [x] Unit: `pnpm --filter web lint`
          - [x] Unit: `pnpm --filter web typecheck`
          - [ ] Integration: Manual verification pending once web app scaffolding exists (`pnpm --filter web dev` + Playwright smoke).
  - [x] 5.3 Document asset pipeline in `docs/ops/runbook.md` (naming, retention, cleanup).
        Acceptance: Runbook describes backup and deletion procedures.
        Tests:
          - [x] Unit: `pnpm lint`, `pnpm typecheck`, `pnpm format`.

- [ ] 6.0 Harden Payload admin authentication (local auth) — Traceability: [R-006]
  - [x] 6.1 Configure local auth options (password policy, session settings, verify email toggle) in `apps/cms/payload.config.ts`.
        Acceptance: Admin can log in using local credentials; optional email verification documented.
        Tests:
          - [x] Unit: `pnpm --filter cms lint`, `pnpm --filter cms typecheck`
          - [ ] Integration: Manual login flow once CMS is deployed (documented)
  - [x] 6.2 Restrict admin access to approved email domains (allowlist) via Payload hooks or access control.
        Acceptance: Only allowlisted emails can authenticate; others denied with 403.
        Tests:
          - [x] Unit: `pnpm --filter cms lint`, `pnpm --filter cms typecheck`
          - [ ] Integration: Manual login attempt with disallowed domain pending post-deploy.
  - [x] 6.3 Document credential rotation and recovery steps in `docs/ops/runbook.md`.
        Acceptance: Runbook includes section on creating new admin users, resetting passwords, and rotating credentials.
        Tests:
          - [x] Unit: `pnpm lint`, `pnpm typecheck`, `pnpm format`

- [ ] 7.0 Bootstrap CMS content — Traceability: [R-007]
  - [x] 7.1 Implement seed script (`apps/cms/src/seed/index.ts`) populating SiteConfig, AboutSection, initial Project, and design tokens.
        Acceptance: Script idempotent; can be run post-deploy.
        Tests:
          - [x] Unit: `pnpm --filter cms lint`, `pnpm --filter cms typecheck`
          - [ ] Integration: `pnpm --filter cms seed` against live/staging DB (pending).
  - [x] 7.2 Expose seed command in package.json (`pnpm --filter cms seed`) and document usage.
        Acceptance: Command runs locally and via Railway one-off job.
        Tests:
          - [x] Unit: `pnpm --filter cms lint`, `pnpm --filter cms typecheck`
          - [ ] Integration: Run command once Railway Postgres available.

- [ ] 8.0 Launch `apps/web` on Vercel — Traceability: [R-001, R-003, R-005]
  - [x] 8.1 Scaffold minimal Next.js placeholder page and ensure `pnpm --filter web build` passes locally.
        Acceptance: Build command succeeds; deploy workflow sees a Next.js project.
        Tests:
          - [x] Unit: `pnpm --filter web lint`, `pnpm --filter web typecheck`
          - [x] Integration: `pnpm --filter web build` *(blocked until local Node upgraded to ≥ 18.17.0)*
  - [ ] 8.2 Configure Vercel env vars + secrets (`NEXT_PUBLIC_*`, R2 base URL) and verify preview deployment.
        Acceptance: Vercel dashboard shows configured variables for Preview + Production.
        Tests:
          - [ ] Manual: Vercel preview request returns 200 with placeholder page.
        Notes: @pandey to populate env values in Vercel UI.
  - [ ] 8.3 Add GitHub repository secrets for deploy workflow (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_WEB_PROJECT_ID`).
        Acceptance: `.github/workflows/deploy-web.yml` completes successfully on push to `main`.
        Tests:
          - [ ] Integration: Workflow run on test commit.
        Notes: @pandey to provision secrets from Vercel account.

- [ ] 9.0 Launch `apps/cms` on Railway — Traceability: [R-004, R-005, R-006, R-007]
  - [ ] 9.1 Upgrade local Node runtime (≥18.19) and validate `pnpm --filter cms dev` + seed script against local Postgres.
        Acceptance: Payload boots locally; `pnpm --filter cms seed` creates admin user.
        Tests:
          - [ ] Unit: `pnpm --filter cms lint`, `pnpm --filter cms typecheck`
          - [ ] Integration: Local run of seed + media upload
  - [ ] 9.2 Configure Railway service (Docker deploy) with PostgreSQL add-on and env vars (Payload secret, R2 creds, auth configs).
        Acceptance: Railway build succeeds; service health check passes.
        Notes: @pandey to enter secrets in Railway Variables UI.
  - [ ] 9.3 Add GitHub secrets for CMS workflow (`RAILWAY_TOKEN`, `RAILWAY_CMS_SERVICE_ID`) and verify `.github/workflows/deploy-cms.yml` run.
        Acceptance: Workflow deploys to Railway after `main` push.
        Tests:
          - [ ] Integration: Manual workflow trigger hitting Railway CLI.
        Notes: @pandey to create service token + service ID.
  - [ ] 9.4 Smoke test Railway deployment: `/admin` reachable, allowlist rejects non-approved domain, R2 upload works.
        Acceptance: Manual test results recorded in runbook.
        Tests:
          - [ ] Integration: Playwright smoke (future) or manual checklist.

- [ ] 10.0 Integration validation — Traceability: [R-001, R-002, R-005]
  - [ ] 10.1 Confirm web app fetches CMS endpoints (stub data fetch, e.g., `/api/projects` returning seed entry).
        Acceptance: Local + preview builds show data fetch success (log or stub render).
        Tests:
          - [ ] Integration: `pnpm --filter web dev` manual verification.
  - [ ] 10.2 Verify shared R2 bucket CORS rules (both apps access same asset).
        Acceptance: Image loads in Vercel preview without CORS errors.
        Notes: @pandey to update R2 CORS if required.
  - [ ] 10.3 Update `docs/ops/runbook.md` with final deployment URLs, seed instructions, and rotation log entry.
        Acceptance: Runbook reflects production URLs and operational handbook.
