# apps/cms

Payload CMS service powering the portfolio content and configuration.

## Status

- Framework: Payload CMS 3+
- Runtime: Node.js 18 (Railway deployment target)
- Package Manager: pnpm (managed from repo root)

## Local Scripts

Scripts for running, building, and seeding the CMS live in this package's `package.json`. Execute them with `pnpm --filter cms <script>`.

| Script                    | Description                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| `pnpm --filter cms dev`   | Starts Payload in watch mode (requires a running PostgreSQL instance and populated `.env`). |
| `pnpm --filter cms build` | Builds the Payload admin bundle.                                                            |
| `pnpm --filter cms start` | Serves the compiled bundle (used in Railway).                                               |

## Environment

Copy `apps/cms/.env.example` to `apps/cms/.env` and populate:

- `DATABASE_URL` – PostgreSQL connection string (Railway adds this automatically when the add-on is attached).
- `PAYLOAD_SECRET` – random string for JWT/session encryption.
- `SERVER_URL` – public URL of the CMS (e.g., Railway domain).
- R2 + OAuth keys (see `.env.example` for the full list).

For local development you can run PostgreSQL via Docker:

```bash
docker run --name portfolio-cms-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=portfolio_cms \
  -p 5432:5432 \
  -d postgres:16
```

Then set `DATABASE_URL=postgres://postgres:postgres@localhost:5432/portfolio_cms` in `.env`.

## Deployment Notes

- Railway builds this service using `apps/cms/docker/Dockerfile`.
- Attach the Railway PostgreSQL add-on and confirm `DATABASE_URL` appears in the Variables tab.
- Remaining secrets (R2, OAuth, etc.) come from `.env.example`.
- The GitHub Action in `.github/workflows/deploy-cms.yml` (Task 4.3) will trigger redeploys; until then, Railway’s native GitHub integration can be used.
