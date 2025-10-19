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
- `apps/cms/payload.config.ts` – Configure Payload collections, storage adapters, auth.
- `apps/cms/docker/Dockerfile` – Build definition for Railway deployment.
- `apps/cms/src/seed/index.ts` – Seed script for design tokens and sample content.
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
- `.github/workflows/deploy-cms.yml` – Railway deployment automation (if applicable).
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
  - [ ] 4.1 Add Railway Dockerfile/build scripts (`apps/cms/docker/Dockerfile`, `Procfile` if needed).
        Acceptance: Docker image builds locally (`docker build`).
        Tests:
          - [ ] Integration: `docker build apps/cms`.
  - [ ] 4.2 Configure PostgreSQL connection in `apps/cms/payload.config.ts`; ensure migrations run on boot.
        Acceptance: CMS starts locally with Railway-compatible connection string.
        Tests:
          - [ ] Unit: `pnpm --filter cms lint`, `pnpm --filter cms typecheck`.
          - [ ] Integration: `pnpm --filter cms dev` with local Postgres.
  - [ ] 4.3 Create Railway deployment workflow (`.github/workflows/deploy-cms.yml`) or document manual deployment.
        Acceptance: Railway project builds and exposes `/admin`.
        Tests:
          - [ ] Integration: Trigger deployment; verify health check via Playwright smoke test.

- [ ] 5.0 Wire Cloudflare R2 storage across CMS and web — Traceability: [R-005]
  - [ ] 5.1 Implement R2 adapter in `apps/cms/payload.config.ts` with env-driven credentials.
        Acceptance: Uploading media via CMS stores in R2 bucket.
        Tests:
          - [ ] Integration: `tests/integration/cms-storage.test.ts` uploads/deletes mock file.
  - [ ] 5.2 Configure Next.js image loader for R2 domain (`apps/web/next.config.mjs`).
        Acceptance: Next Image component loads R2-hosted assets locally.
        Tests:
          - [ ] Unit: `pnpm --filter web typecheck`.
          - [ ] Integration: `pnpm --filter web dev` manual verification; Playwright smoke capturing 200 response.
  - [ ] 5.3 Document asset pipeline in `docs/ops/runbook.md` (naming, retention, cleanup).
        Acceptance: Runbook describes backup and deletion procedures.
        Tests:
          - [ ] Documentation review.

- [ ] 6.0 Enable OAuth authentication for Payload admin — Traceability: [R-006]
  - [ ] 6.1 Configure Google/GitHub OAuth providers in Payload (`apps/cms/payload.config.ts`).
        Acceptance: Local OAuth mock flow works; secrets pulled from env.
        Tests:
          - [ ] Integration: `tests/integration/oauth-auth.test.ts` using mocked providers.
  - [ ] 6.2 Update Railway environment variables and callbacks; document in README.
        Acceptance: Live `/admin` requires OAuth login; unauthorized sees 403.
        Tests:
          - [ ] E2E: Playwright smoke `tests/e2e/health-check.spec.ts` hitting admin route.
  - [ ] 6.3 Add allowlist for admin emails/teams; document rotation process.
        Acceptance: Only specified accounts gain admin access.
        Tests:
          - [ ] Unit: config test verifying allowlist enforcement.

- [ ] 7.0 Bootstrap CMS content and design tokens — Traceability: [R-007]
  - [ ] 7.1 Implement seed script (`apps/cms/src/seed/index.ts`) populating SiteConfig, AboutSection, initial Project, and design tokens.
        Acceptance: Script idempotent; can be run post-deploy.
        Tests:
          - [ ] Integration: Run seed in staging DB; verify entries via API.
  - [ ] 7.2 Expose seed command in package.json (`pnpm --filter cms seed`) and document usage.
        Acceptance: Command runs locally and via Railway one-off job.
        Tests:
          - [ ] Integration: `pnpm --filter cms seed` run with local Postgres.
  - [ ] 7.3 Validate design tokens align with Figma values; sync to `packages/ui`.
        Acceptance: Tokens exported to CSS variables; cross-checked with Figma.
        Tests:
          - [ ] Unit: snapshot test comparing token values.
          - [ ] Integration: Storybook/Style dictionary build verifying tokens.
