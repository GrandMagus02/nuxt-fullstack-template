# Nuxt 4 Fullstack Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a production-ready Nuxt 4 fullstack starter template with FSD architecture, type-safe API client generation, auth, database, and strict code quality tooling.

**Architecture:** Nuxt 4 with `srcDir: 'app'` — FSD layers (shared/entities/features/widgets) registered via nuxt.config custom component/import dirs. Nitro server handles API routes and better-auth. hey-api generates pinia/colada composables + Zod-validated types from `openapi.yaml` into `app/shared/api/`.

**Tech Stack:** Nuxt 4, @nuxt/ui, Pinia, @pinia/colada, Zod, @hey-api/openapi-ts, better-auth, Prisma, PostgreSQL, @antfu/eslint-config, Husky, lint-staged

---

## File Map

| File | Purpose |
|------|---------|
| `package.json` | deps, scripts, lint-staged config |
| `nuxt.config.ts` | Nuxt 4 config, FSD component/import dirs, runtimeConfig |
| `tsconfig.json` | extends .nuxt/tsconfig.json |
| `eslint.config.ts` | @antfu/eslint-config flat config |
| `.gitignore` | node_modules, .nuxt, .output, .env |
| `.env.example` | all env vars documented |
| `.env` | local secrets (gitignored) |
| `openapi.yaml` | OpenAPI spec — source of truth for hey-api |
| `openapi-ts.config.ts` | hey-api generator config |
| `docker-compose.yml` | Postgres 16 local dev |
| `prisma/schema.prisma` | User + Session + Account + Verification (better-auth schema) |
| `app/app.vue` | root — NuxtLayout + NuxtPage |
| `app/pages/index.vue` | landing page |
| `app/shared/schemas/api.ts` | hand-written Zod schemas (non-generated) |
| `app/shared/composables/useAuth.ts` | better-auth client wrapper |
| `server/utils/db.ts` | Prisma client singleton |
| `server/utils/auth.ts` | better-auth server instance (all providers, env-gated) |
| `server/api/auth/[...].ts` | better-auth catch-all route |
| `.vscode/settings.json` | ESLint auto-fix on save |
| `.husky/pre-commit` | runs lint-staged |

---

## Task 1: Initialize package.json and install dependencies

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `tsconfig.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "nuxt-fullstack-template",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "typecheck": "nuxt typecheck",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "api:generate": "openapi-ts",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:up": "docker compose up -d",
    "db:down": "docker compose down",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{ts,vue,tsx}": "eslint --fix"
  }
}
```

- [ ] **Step 2: Install runtime dependencies**

```bash
pnpm add nuxt @nuxt/ui @pinia/nuxt pinia @pinia/colada zod better-auth @prisma/client @hey-api/client-fetch
```

> If `@hey-api/client-fetch` fails, check https://heyapi.dev/openapi-ts/clients — the package may be `@hey-api/client-fetch` or bundled with `@hey-api/openapi-ts`.

- [ ] **Step 3: Install dev dependencies**

```bash
pnpm add -D @hey-api/openapi-ts prisma @antfu/eslint-config eslint typescript vue-tsc husky lint-staged
```

- [ ] **Step 4: Create .gitignore**

```
node_modules
.nuxt
.output
dist
.env
*.local
```

- [ ] **Step 5: Create tsconfig.json**

```json
{
  "extends": "./.nuxt/tsconfig.json"
}
```

- [ ] **Step 6: Commit**

```bash
git add package.json .gitignore tsconfig.json pnpm-lock.yaml
git commit -m "chore: initialize project with all dependencies"
```

---

## Task 2: Nuxt 4 core configuration

**Files:**
- Create: `nuxt.config.ts`
- Create: `app/app.vue`
- Create: `app/pages/index.vue`

- [ ] **Step 1: Create nuxt.config.ts**

```ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  srcDir: 'app',

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@pinia/colada/nuxt',
  ],

  components: [
    { path: '~/shared/ui', pathPrefix: false },
    { path: '~/widgets', pattern: '*/ui/**', pathPrefix: false },
    { path: '~/entities', pattern: '*/ui/**', pathPrefix: false },
    { path: '~/features', pattern: '*/ui/**', pathPrefix: false },
  ],

  imports: {
    dirs: [
      '~/shared/utils',
      '~/shared/composables',
      '~/entities/*/composables',
      '~/entities/*/store',
      '~/features/*/composables',
      '~/features/*/store',
      '~/widgets/*/composables',
    ],
  },

  runtimeConfig: {
    authSecret: '',
    databaseUrl: '',
    googleClientId: '',
    googleClientSecret: '',
    githubClientId: '',
    githubClientSecret: '',
    resendApiKey: '',
    fromEmail: '',
    public: {
      googleAuthEnabled: false,
      githubAuthEnabled: false,
      magicLinkEnabled: false,
      emailPasswordEnabled: true,
    },
  },
})
```

> **Note on `@pinia/colada/nuxt`:** If this module path fails, try `pinia-colada-nuxt` or check https://pinia-colada.esm.dev/nuxt for the exact module name.

> **Note on runtimeConfig public flags:** Nuxt resolves `runtimeConfig.public.googleAuthEnabled` from env var `NUXT_PUBLIC_GOOGLE_AUTH_ENABLED=true`. Set these in `.env` based on which OAuth secrets are present.

- [ ] **Step 2: Create app/app.vue**

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- [ ] **Step 3: Create app/pages/index.vue**

```vue
<template>
  <div>
    <h1>Nuxt Fullstack Template</h1>
  </div>
</template>
```

- [ ] **Step 4: Verify Nuxt starts**

```bash
pnpm dev
```

Expected: server starts on `http://localhost:3000`, page renders "Nuxt Fullstack Template" without console errors.

- [ ] **Step 5: Commit**

```bash
git add nuxt.config.ts app/
git commit -m "feat: add Nuxt 4 core config and root app files"
```

---

## Task 3: Scaffold FSD directory structure

**Files:**
- Create: `app/shared/ui/.gitkeep`
- Create: `app/shared/composables/.gitkeep`
- Create: `app/shared/utils/.gitkeep`
- Create: `app/shared/schemas/.gitkeep`
- Create: `app/entities/.gitkeep`
- Create: `app/features/.gitkeep`
- Create: `app/widgets/.gitkeep`

- [ ] **Step 1: Create all FSD layer directories**

```bash
mkdir -p app/shared/ui app/shared/composables app/shared/utils app/shared/schemas
mkdir -p app/entities app/features app/widgets
touch app/shared/ui/.gitkeep app/shared/composables/.gitkeep app/shared/utils/.gitkeep app/shared/schemas/.gitkeep
touch app/entities/.gitkeep app/features/.gitkeep app/widgets/.gitkeep
```

- [ ] **Step 2: Verify nuxt.config import dirs don't throw**

```bash
pnpm dev
```

Expected: starts cleanly. Glob patterns in `imports.dirs` that match no files are silently ignored by Nuxt.

- [ ] **Step 3: Commit**

```bash
git add app/shared/ app/entities/ app/features/ app/widgets/
git commit -m "feat: scaffold FSD directory structure"
```

---

## Task 4: Zod schemas foundation

**Files:**
- Create: `app/shared/schemas/api.ts`

- [ ] **Step 1: Create app/shared/schemas/api.ts**

This file holds hand-written Zod schemas for any validation not covered by hey-api generation. Starts with shared primitives.

```ts
import { z } from 'zod'

export const PaginationSchema = z.object({
  page: z.number().int().positive(),
  perPage: z.number().int().positive().max(100),
  total: z.number().int().nonnegative(),
})

export const ErrorResponseSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
})

export type Pagination = z.infer<typeof PaginationSchema>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>
```

- [ ] **Step 2: Verify TypeScript is happy**

```bash
pnpm typecheck
```

Expected: exits 0. If `.nuxt/tsconfig.json` doesn't exist yet, run `pnpm dev` first to generate it, then typecheck.

- [ ] **Step 3: Commit**

```bash
git add app/shared/schemas/api.ts
git commit -m "feat: add Zod schemas foundation"
```

---

## Task 5: hey-api setup with openapi.yaml

**Files:**
- Create: `openapi.yaml`
- Create: `openapi-ts.config.ts`

- [ ] **Step 1: Create starter openapi.yaml**

```yaml
openapi: 3.1.0
info:
  title: App API
  version: 1.0.0
servers:
  - url: /api
paths:
  /health:
    get:
      operationId: getHealth
      summary: Health check
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: ok
                required:
                  - status
```

- [ ] **Step 2: Create openapi-ts.config.ts**

```ts
import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: 'openapi.yaml',
  output: {
    format: 'prettier',
    path: 'app/shared/api',
    clean: true,
  },
  plugins: [
    'zod',
    '@pinia/colada',
  ],
})
```

> **Note on plugins:** hey-api plugin names vary by version. Check https://heyapi.dev/openapi-ts/plugins for exact plugin names. Common alternatives:
> - Zod: `'zod'` or `{ name: 'zod' }`
> - pinia/colada: `'@pinia/colada'` or a community plugin. If pinia/colada plugin doesn't exist, use `'@tanstack/vue-query'` as fallback or omit and write composables manually.

- [ ] **Step 3: Add app/shared/api/ to .gitignore**

Append to `.gitignore`:
```
# Generated — do not edit
app/shared/api/
```

- [ ] **Step 4: Run hey-api generation**

```bash
pnpm api:generate
```

Expected: `app/shared/api/` created with generated TypeScript files (types, client, etc.).

If it fails due to missing plugins, remove the failing plugin from `openapi-ts.config.ts` and rerun. The base client generation must succeed.

- [ ] **Step 5: Create server/api/health.get.ts to back the spec**

```ts
export default defineEventHandler(() => {
  return { status: 'ok' }
})
```

- [ ] **Step 6: Verify generated client compiles**

```bash
pnpm typecheck
```

Expected: exits 0.

- [ ] **Step 7: Commit**

```bash
git add openapi.yaml openapi-ts.config.ts .gitignore server/api/health.get.ts
git commit -m "feat: add hey-api setup with starter OpenAPI spec"
```

---

## Task 6: Docker Compose and Prisma schema

**Files:**
- Create: `docker-compose.yml`
- Create: `.env.example`
- Create: `.env`
- Create: `prisma/schema.prisma`
- Create: `server/utils/db.ts`

- [ ] **Step 1: Create docker-compose.yml**

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

- [ ] **Step 2: Create .env.example**

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app"

# Auth secret — generate with: openssl rand -base64 32
AUTH_SECRET=""

# Google OAuth (optional — omit to hide Google sign-in button)
AUTH_GOOGLE_CLIENT_ID=
AUTH_GOOGLE_CLIENT_SECRET=

# GitHub OAuth (optional — omit to hide GitHub sign-in button)
AUTH_GITHUB_CLIENT_ID=
AUTH_GITHUB_CLIENT_SECRET=

# Magic link email (optional — omit to hide magic link option)
AUTH_RESEND_API_KEY=
AUTH_FROM_EMAIL=noreply@example.com

# Nuxt runtimeConfig overrides
# Set these to true when the corresponding OAuth keys above are set
NUXT_PUBLIC_GOOGLE_AUTH_ENABLED=false
NUXT_PUBLIC_GITHUB_AUTH_ENABLED=false
NUXT_PUBLIC_MAGIC_LINK_ENABLED=false
```

- [ ] **Step 3: Create .env from .env.example**

```bash
cp .env.example .env
```

Then set `AUTH_SECRET` in `.env`:
```bash
openssl rand -base64 32
```
Paste the output as the `AUTH_SECRET` value.

- [ ] **Step 4: Create prisma/schema.prisma**

This is the exact schema required by better-auth's Prisma adapter:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id
  name          String
  email         String    @unique
  emailVerified Boolean
  image         String?
  createdAt     DateTime
  updatedAt     DateTime
  sessions      Session[]
  accounts      Account[]
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String   @unique
  createdAt DateTime
  updatedAt DateTime
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime
  updatedAt             DateTime
}

model Verification {
  id         String    @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime?
  updatedAt  DateTime?
}
```

- [ ] **Step 5: Create server/utils/db.ts**

```ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = db
```

- [ ] **Step 6: Start Postgres and generate Prisma client**

```bash
pnpm db:up
pnpm db:generate
```

Expected:
- `db:up` — docker starts postgres container (verify: `docker ps`)
- `db:generate` — Prisma generates `node_modules/.prisma/client`

- [ ] **Step 7: Run first migration**

```bash
pnpm db:migrate
```

When prompted for migration name, enter: `init_better_auth`

Expected: migration applied, `prisma/migrations/` created.

- [ ] **Step 8: Commit**

```bash
git add docker-compose.yml .env.example prisma/ server/utils/db.ts
git commit -m "feat: add Prisma schema, Docker Compose, and db utility"
```

---

## Task 7: better-auth server setup

**Files:**
- Create: `server/utils/auth.ts`
- Create: `server/api/auth/[...].ts`

- [ ] **Step 1: Create server/utils/auth.ts**

```ts
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { db } from './db'

export const auth = betterAuth({
  secret: process.env.AUTH_SECRET,
  database: prismaAdapter(db, { provider: 'postgresql' }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    ...(process.env.AUTH_GOOGLE_CLIENT_ID && {
      google: {
        clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
      },
    }),

    ...(process.env.AUTH_GITHUB_CLIENT_ID && {
      github: {
        clientId: process.env.AUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET!,
      },
    }),
  },
})
```

> **Note on magic link:** If `AUTH_RESEND_API_KEY` is set, add the `magicLink` plugin from `better-auth/plugins`. Omitted from base setup to keep starter minimal; add when needed.

- [ ] **Step 2: Create server/api/auth/[...].ts**

```ts
import { auth } from '../../utils/auth'
import { toWebRequest } from 'h3'

export default defineEventHandler(event => auth.handler(toWebRequest(event)))
```

- [ ] **Step 3: Verify auth routes respond**

Start dev server and test:

```bash
pnpm dev
```

Then in another terminal:
```bash
curl http://localhost:3000/api/auth/get-session
```

Expected: JSON response (empty session or `null` — not a 404).

- [ ] **Step 4: Commit**

```bash
git add server/utils/auth.ts server/api/auth/
git commit -m "feat: add better-auth server with all OAuth providers (env-gated)"
```

---

## Task 8: better-auth client composable

**Files:**
- Create: `app/shared/composables/useAuth.ts`

- [ ] **Step 1: Create app/shared/composables/useAuth.ts**

```ts
import { createAuthClient } from 'better-auth/vue'

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
})

export function useAuth() {
  const { data: session, isPending } = authClient.useSession()
  const runtimeConfig = useRuntimeConfig()

  return {
    session,
    isPending,
    signIn: authClient.signIn,
    signOut: authClient.signOut,
    signUp: authClient.signUp,
    providers: {
      google: runtimeConfig.public.googleAuthEnabled,
      github: runtimeConfig.public.githubAuthEnabled,
      magicLink: runtimeConfig.public.magicLinkEnabled,
      emailPassword: runtimeConfig.public.emailPasswordEnabled,
    },
  }
}
```

- [ ] **Step 2: Update app/pages/index.vue to use the composable**

```vue
<script setup lang="ts">
const { session, isPending, providers } = useAuth()
</script>

<template>
  <div>
    <h1>Nuxt Fullstack Template</h1>
    <p v-if="isPending">Loading session...</p>
    <p v-else-if="session">Signed in as {{ session.user.email }}</p>
    <p v-else>Not signed in</p>
    <pre>{{ JSON.stringify(providers, null, 2) }}</pre>
  </div>
</template>
```

- [ ] **Step 3: Verify composable renders without errors**

```bash
pnpm dev
```

Open `http://localhost:3000`. Expected: "Not signed in" displayed, providers object shown (all false unless env vars set), no console errors.

- [ ] **Step 4: Commit**

```bash
git add app/shared/composables/useAuth.ts app/pages/index.vue
git commit -m "feat: add better-auth client composable with provider-gated flags"
```

---

## Task 9: ESLint with @antfu/eslint-config

**Files:**
- Create: `eslint.config.ts`

- [ ] **Step 1: Create eslint.config.ts**

```ts
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,
  formatters: true,
  rules: {
    'no-console': 'warn',
  },
})
```

- [ ] **Step 2: Run lint to verify config is valid**

```bash
pnpm lint
```

Expected: exits 0 or shows only fixable warnings — no config errors. If there are auto-fixable issues:

```bash
pnpm lint:fix
```

- [ ] **Step 3: Add eslint cache to .gitignore**

Append to `.gitignore`:
```
.eslintcache
```

- [ ] **Step 4: Commit**

```bash
git add eslint.config.ts .gitignore
git commit -m "feat: add ESLint with @antfu/eslint-config strict flat config"
```

---

## Task 10: Husky + lint-staged + VS Code settings

**Files:**
- Create: `.husky/pre-commit`
- Create: `.vscode/settings.json`

- [ ] **Step 1: Initialize Husky**

```bash
pnpm prepare
```

Expected: `.husky/` directory created.

- [ ] **Step 2: Add pre-commit hook**

```bash
echo "pnpm lint-staged" > .husky/pre-commit
chmod +x .husky/pre-commit
```

- [ ] **Step 3: Verify lint-staged config in package.json**

Confirm `package.json` has:
```json
"lint-staged": {
  "*.{ts,vue,tsx}": "eslint --fix"
}
```

This was set in Task 1. Verify it's present — if missing, add it now.

- [ ] **Step 4: Test the pre-commit hook**

```bash
git add .
git commit -m "test: verify pre-commit hook runs lint-staged"
```

Expected: lint-staged runs on staged `.ts`/`.vue` files, commit succeeds.

- [ ] **Step 5: Create .vscode/settings.json**

```bash
mkdir -p .vscode
```

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.useFlatConfig": true,
  "editor.formatOnSave": false,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ]
}
```

- [ ] **Step 6: Commit**

```bash
git add .husky/ .vscode/
git commit -m "feat: add Husky pre-commit hook, lint-staged, and VS Code settings"
```

---

## Task 11: Final verification

- [ ] **Step 1: Clean install**

```bash
rm -rf node_modules .nuxt
pnpm install
```

- [ ] **Step 2: Generate Prisma client**

```bash
pnpm db:generate
```

- [ ] **Step 3: Run type check**

```bash
pnpm dev &   # generates .nuxt/tsconfig.json
sleep 5
kill %1
pnpm typecheck
```

Expected: exits 0.

- [ ] **Step 4: Run lint**

```bash
pnpm lint
```

Expected: exits 0 or only warnings.

- [ ] **Step 5: Run dev server and smoke test**

```bash
pnpm dev
```

Open `http://localhost:3000`.

Verify:
- Page renders without errors
- `http://localhost:3000/api/health` returns `{ "status": "ok" }`
- `http://localhost:3000/api/auth/get-session` returns JSON (not 404)
- Browser console has no errors

- [ ] **Step 6: Run hey-api generation**

```bash
pnpm api:generate
```

Expected: `app/shared/api/` updated without errors.

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "chore: final template verification pass"
```

---

## Quick-start guide for template consumers

After cloning:

```bash
pnpm install
cp .env.example .env          # fill in AUTH_SECRET, DATABASE_URL
pnpm db:up                    # start Postgres
pnpm db:migrate               # apply migrations
pnpm api:generate             # generate API client from openapi.yaml
pnpm dev
```

To enable a provider, set the env vars in `.env` and set the corresponding `NUXT_PUBLIC_*_AUTH_ENABLED=true`.
