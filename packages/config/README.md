# packages/config

Centralized configuration package for linting, formatting, TypeScript settings, and shared tooling presets.

## Responsibilities

- ESLint configuration shared across workspaces
- Prettier formatting rules
- Base TypeScript configurations (`tsconfig` presets)
- Additional tooling configs (e.g., Stylelint, Jest) as needed

Consume these configs via `pnpm` workspace aliases (e.g., `@portfolio/config/eslint`).
