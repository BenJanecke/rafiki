FROM node:20-alpine3.19 AS base

WORKDIR /home/rafiki

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN corepack prepare pnpm@8.7.4 --activate

COPY pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm fetch \
    | grep -v "cross-device link not permitted\|Falling back to copying packages from store"

FROM base AS builder

COPY package.json pnpm-workspace.yaml .npmrc tsconfig.json tsconfig.build.json ./
COPY localenv/mock-account-servicing-entity ./localenv/mock-account-servicing-entity
COPY packages/mock-account-service-lib ./packages/mock-account-service-lib


RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install \
    --recursive \
    --offline \
    --frozen-lockfile

RUN pnpm --filter mock-account-servicing-entity build

CMD pnpm --filter mock-account-servicing-entity dev


