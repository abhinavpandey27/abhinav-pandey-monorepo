# Operations Runbook — Portfolio Monorepo

This runbook summarizes how to set up, deploy, and operate the portfolio web app (`apps/web`) and Payload CMS (`apps/cms`) using the shared infrastructure described in PRD-002.

---

## 1. Environments

| Environment | Web Host                                         | CMS Host                      | Notes                                           |
| ----------- | ------------------------------------------------ | ----------------------------- | ----------------------------------------------- |
| Local       | `pnpm --filter web dev` on http://localhost:3000 | `pnpm --filter cms dev` (TBD) | Uses `.env.local` / `.env` seeded from examples |
| Staging     | Vercel Preview (`*.vercel.app`)                  | Railway Preview               | Optional; mirrors production config             |
| Production  | Vercel Hobby                                     | Railway                       | Primary live environment                        |

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
5. After deploy, verify `/admin` loads and you can authenticate with an allowlisted email (use seed command if no admins exist).
6. From the Railway dashboard run a one-off command `pnpm --filter cms seed` with production env vars to create the initial admin.

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
2. Ensure Node.js ≥18.17.0 (repository ships with `.nvmrc` → `nvm install && nvm use`).
3. Copy env templates and fill local values (see §2).
4. Run linters/typecheck before committing: `pnpm lint`, `pnpm typecheck`, `pnpm format`
5. Start dev servers (placeholder commands until apps are implemented):
   - `pnpm --filter web dev`
   - `pnpm --filter cms dev`
6. Follow task list in `docs/tasks/002-portfolio-monorepo/tasks/tasks-002-portfolio-monorepo.md`; update per `docs/ai-dev/process-task-list.md`.

### Local CMS Smoke Test

1. Start Postgres locally (example): `docker run --rm --name portfolio-cms-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=portfolio_cms -p 5432:5432 -d postgres:16`.
2. Copy env: `cp apps/cms/.env.example apps/cms/.env` and set `DATABASE_URL=postgres://postgres:postgres@localhost:5432/portfolio_cms`.
3. `pnpm --filter cms dev` to launch Payload (requires Node ≥18.19; recommended Node 20.11 via `.nvmrc`).
4. In another terminal run `pnpm --filter cms seed` to bootstrap the admin user/account.
5. Visit `http://localhost:3000/admin` and log in with the seeded credentials to confirm allowlist/password policy.

---

## 5. Monitoring & Alerts

| Component | Tool                                | Notes                                    |
| --------- | ----------------------------------- | ---------------------------------------- |
| Web       | Vercel Analytics / optional PostHog | Configure once analytics provider chosen |
| CMS       | Railway logs                        | Monitor for errors, restarts             |
| Storage   | Cloudflare R2 usage dashboard       | Watch for bandwidth/storage overages     |

Add alert routing (Slack/email) once providers are finalized.

---

## 6. Asset Management & Cloudflare R2

1. **Bucket Structure**

   - Bucket: `${R2_BUCKET_NAME}` (default `portfolio-media`)
   - File paths follow Payload media keys (e.g., `media/<filename>`).
   - Thumbnail and derived sizes are generated by Payload and stored alongside originals.

2. **Access Control**

   - Use Cloudflare R2 public bucket settings or a custom domain (`assets.<domain>`) for direct delivery.
   - Restrict API tokens to the bucket with "Edit" permissions; rotate quarterly.

3. **CORS Configuration**

   - Allow origins: Vercel preview domain(s) + production domain.
   - Methods: `GET`, `HEAD`, `PUT` (if client uploads enabled in future).
   - Headers: `Content-Type`, `Authorization`, `CF-Access-Jwt-Assertion`.

4. **Cleanup & Retention**

   - Enable Lifecycle rules to transition or delete objects older than 365 days if storage needs to stay in the free tier.
   - Use Payload hooks (TODO) for deleting unused media when entries are removed.

5. **Backups**

   - Schedule monthly bucket export via `rclone` or Cloudflare R2 replication to a secondary bucket.
   - Document exports in the Incident/Rotation log.

6. **Validation Checklist (before go-live)**
   - [ ] CMS upload writes file to R2 (verify via dashboard).
   - [ ] Public URL resolves through CDN in <500ms.
   - [ ] Assets load via Next.js Image component (preview + production).
   - [ ] Access key rotated and secrets updated in Vercel/Railway.

---

## 6. Admin Credentials & Rotation

1. **Creating the First Admin**
   - Run `pnpm --filter cms seed` to create the default admin user (`SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`).
   - Immediately reset the password via admin UI under “Account”.

2. **Password Policy**
   - Minimum length is controlled via `AUTH_PASSWORD_MIN_LENGTH` (default 12).
   - Accounts lock after `AUTH_MAX_LOGIN_ATTEMPTS` failures for `AUTH_LOCK_TIME` ms.
   - Sessions expire after `AUTH_TOKEN_EXPIRATION` seconds; adjust via env.
   - Only allowlisted domains (`AUTH_ALLOWED_EMAIL_DOMAINS`) may authenticate.

3. **Credential Rotation**
   - Update `.env` values on Railway, restart service.
   - For forced resets, use “Reset Password” from admin login page (requires email transport).
   - On compromised account: disable via admin UI → delete user or change email/password, then rerun seed to create replacement.

4. **Allowlist Maintenance**
   - Modify `AUTH_ALLOWED_EMAIL_DOMAINS` env, redeploy.
   - Seed script can be re-run to ensure required admins exist.

5. **Documentation**
   - Record rotations at the bottom of this runbook (append to `## Rotation Log` if created).

---

## 7. Incident Response

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
