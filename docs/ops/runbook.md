# Operations Runbook — Portfolio Monorepo

This runbook summarizes how to set up, deploy, and operate the portfolio web app (`apps/web`) and Payload CMS (`apps/cms`) using the shared infrastructure described in PRD-002.

---

## 1. Environments

| Environment | Web Host | CMS Host | Notes |
|-------------|----------|----------|-------|
| Local       | `pnpm --filter web dev` on http://localhost:3000 | `pnpm --filter cms dev` (TBD) | Uses `.env.local` / `.env` seeded from examples |
| Staging     | Vercel Preview (`*.vercel.app`) | Railway Preview | Optional; mirrors production config |
| Production  | Vercel Hobby | Railway | Primary live environment |

### Domain Mapping
- Production Web: `https://portfolio.vercel.app` (replace with custom domain when available)
- Production CMS: `https://portfolio-cms.up.railway.app`

---

## 2. Secrets & Environment Variables

### Source of Truth
Maintain secrets in the respective hosting dashboards:
- Vercel → Project Settings → Environment Variables
- Railway → Variables tab (service-level)
- Optional secrets vault (1Password, Doppler, etc.) for team sharing

### Required Variables
Refer to:
- Root template: `.env.example`
- Web template: `apps/web/.env.example`
- CMS template: `apps/cms/.env.example`

#### Setup Steps
1. Copy each template to local files (`cp .env.example .env`, `cp apps/web/.env.example apps/web/.env.local`, etc.).
2. Populate values:
   - **R2 Credentials** from Cloudflare R2 dashboard (Account ID, Access Key, Secret).
   - **Vercel**: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CMS_API_URL`, analytics toggles.
   - **CMS OAuth**: Register Google + GitHub OAuth apps; set redirect URI to `https://portfolio-cms.up.railway.app/oauth2/redirect/<provider>`.
   - **Database**: Railway auto-generates `DATABASE_URL`; copy into CMS env tab.
   - **Revalidation Webhook**: Generate secret shared between CMS and Vercel.
3. For production, add the same keys in hosting dashboards; avoid committing real secrets.

### Secret Rotation
- Rotate R2 access keys quarterly; update Vercel & Railway variables, redeploy.
- OAuth client secrets should be rotated annually or if a leak is suspected.
- Document rotation events in this runbook (append `## Rotation Log` section if needed).

---

## 3. Deployments

### Web (Vercel)
1. Connect GitHub repo to Vercel project.
2. Configure build command (`pnpm --filter web build`) and output directory (`.vercel/output` or default).
3. Set environment variables (Production & Preview).
4. Trigger deploy:
   - Preview: push branch → Vercel creates preview deployment.
   - Production: merge to `main` or promote preview.
5. Health check: visit domain, verify 200 response and placeholder page (until UI implemented).

### CMS (Railway)
1. Create new Railway service (Node or Docker, once Dockerfile ready).
2. Set environment variables (Database, R2, OAuth, secrets).
3. Provision PostgreSQL add-on; link `DATABASE_URL`.
4. Deploy from repo:
   - Option A: Railway GitHub integration (auto deploy on `main`).
   - Option B: Manual `railway up` with CLI.
5. After deploy, verify `/admin` loads and prompts for OAuth login.

### Smoke Tests
Run from repo root after deployment:
```bash
pnpm --filter web lint
pnpm --filter web typecheck
pnpm --filter web format
```
Future iterations will add automated Playwright smoke tests.

---

## 4. Local Development Workflow

1. Install dependencies: `pnpm install`
2. Copy env templates and fill local values (see §2).
3. Run linters/typecheck before committing: `pnpm lint`, `pnpm typecheck`, `pnpm format`
4. Start dev servers (placeholder commands until apps are implemented):
   - `pnpm --filter web dev`
   - `pnpm --filter cms dev`
5. Follow task list in `docs/tasks/002-portfolio-monorepo/tasks/tasks-002-portfolio-monorepo.md`; update per `docs/ai-dev/process-task-list.md`.

---

## 5. Monitoring & Alerts

| Component | Tool | Notes |
|-----------|------|-------|
| Web | Vercel Analytics / optional PostHog | Configure once analytics provider chosen |
| CMS | Railway logs | Monitor for errors, restarts |
| Storage | Cloudflare R2 usage dashboard | Watch for bandwidth/storage overages |

Add alert routing (Slack/email) once providers are finalized.

---

## 6. Incident Response

1. **Identify**: Monitor Vercel/Railway status dashboards; confirm via logs.
2. **Mitigate**:
   - Revert to previous Vercel deployment (Rollback button).
   - Roll back Railway deployment via previous build.
3. **Communicate**: Notify stakeholders (designer/developer) via shared channel.
4. **Postmortem**: Document incident in `docs/ops/runbook.md` under `## Incident Log` (add section as needed) and create follow-up tasks in task list.

---

## 7. References

- PRD: `docs/tasks/002-portfolio-monorepo/prd/002-portfolio-monorepo`
- Task List: `docs/tasks/002-portfolio-monorepo/tasks/tasks-002-portfolio-monorepo.md`
- Context Pack: `docs/tasks/001-portfolio-website/context-pack.md`
- Process Docs: `docs/ai-dev/process-task-list.md`, `docs/ai-dev/generate-tasks.md`
