# syntax=docker/dockerfile:1.6

ARG NODE_VERSION=18-bullseye
ARG PNPM_VERSION=8.15.1

FROM node:${NODE_VERSION} AS base
WORKDIR /app

ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=${PNPM_HOME}:${PATH}

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

# Copy workspace manifests first for better caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages

# Install workspace dependencies (placeholder build works until Payload implementation lands)
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @portfolio/cms... build

FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=${PNPM_HOME}:${PATH}

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

COPY --from=base /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps ./apps
COPY --from=base /app/packages ./packages

EXPOSE 3000

# Placeholder start command until Payload server is implemented
CMD ["pnpm", "--filter", "@portfolio/cms", "start"]
