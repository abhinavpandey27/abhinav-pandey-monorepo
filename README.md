# Portfolio Monorepo

Mono-repo housing the portfolio web experience (`apps/web`), Payload CMS backend (`apps/cms`), and shared packages (design system and tooling).

## Workspace Layout

```
apps/
  web/   - Next.js 14 front end deployed to Vercel
  cms/   - Payload CMS service deployed to Railway
packages/
  ui/       - Shared UI primitives and design tokens
  config/   - Shared ESLint, Prettier, and TypeScript presets
docs/       - Specifications, PRDs, and operational notes
```

## Getting Started

```bash
pnpm install        # install dependencies for all workspaces
pnpm dev            # run dev scripts across all workspaces (filter as needed)
pnpm lint           # run ESLint using shared config
pnpm typecheck      # run TypeScript in each package/app
pnpm format         # check formatting via shared Prettier config
```

To run a script for a specific workspace, use pnpm's `--filter` flag:

```bash
pnpm --filter web dev
pnpm --filter cms lint
pnpm --filter ui typecheck
```

## Development Conventions

- Shared tooling lives in `packages/config` and is consumed via `@portfolio/config`.
- Each workspace extends the root `.eslintrc.cjs`, `prettier.config.cjs`, and `tsconfig.json`.
- Keep documentation for deployment and onboarding inside `docs/` and the relevant `apps/*/README.md`.
- Track feature work through the task lists in `docs/tasks/**/tasks-*.md` (follow `docs/ai-dev/process-task-list.md`).

## References

- Current PRD: `docs/tasks/002-portfolio-monorepo/prd/002-portfolio-monorepo`
- Phase 1 task list: `docs/tasks/002-portfolio-monorepo/tasks/tasks-002-portfolio-monorepo.md`
