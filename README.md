# Nuxt 4 Fullstack Template

Production-ready Nuxt 4 starter with Feature Sliced Design, type-safe API generation, auth, and a Postgres database.

## Stack

- **Nuxt 4** (`srcDir: app`) + **@nuxt/ui**
- **Feature Sliced Design** — `app/{shared,entities,features,widgets}`
- **Pinia** + **@pinia/colada** for state & async queries
- **Zod** for API-boundary validation
- **hey-api** generates a typed client + zod schemas + pinia/colada composables from `openapi.yaml` into `app/shared/api/` (gitignored, regenerate with `pnpm api:generate`)
- **better-auth** — email/password + optional Google/GitHub OAuth
- **Prisma 7** + **PostgreSQL**
- **ESLint** (@antfu/eslint-config), **Husky** + **lint-staged**

## Quick start

```bash
pnpm install
cp .env.example .env                  # then set AUTH_SECRET (see below)
openssl rand -base64 32               # paste into AUTH_SECRET in .env
pnpm db:up                            # start Postgres (Docker)
pnpm db:migrate                       # apply migrations
pnpm api:generate                     # generate API client from openapi.yaml
pnpm dev
```

App runs at http://localhost:3000.

## Enabling OAuth providers

Set the matching credentials in `.env`:

- **Google:** `AUTH_GOOGLE_CLIENT_ID` + `AUTH_GOOGLE_CLIENT_SECRET`
- **GitHub:** `AUTH_GITHUB_CLIENT_ID` + `AUTH_GITHUB_CLIENT_SECRET`

The provider is registered server-side and its sign-in button appears automatically when both the ID and secret are present. No code changes needed.

## Project structure

```
app/
  app.vue              # root: NuxtLayout + NuxtPage
  pages/               # routes
  shared/
    api/                # GENERATED (gitignored) — do not edit
    schemas/            # hand-written Zod schemas
    ui/ composables/ utils/
  entities/ features/ widgets/   # FSD slices: <slice>/ui, /composables, /store
server/
  api/                 # Nitro routes (incl. better-auth catch-all)
  utils/               # db.ts (Prisma), auth.ts (better-auth)
prisma/schema.prisma   # User / Session / Account / Verification
openapi.yaml           # source of truth for hey-api
```

Adding a feature slice: create `app/features/<name>/ui/*.vue` and `app/features/<name>/composables/*.ts` — components and composables auto-import per the FSD config in `nuxt.config.ts`.

## Scripts

| Script                   | Purpose                                   |
| ------------------------ | ----------------------------------------- |
| `pnpm dev`               | Dev server                                |
| `pnpm build`             | Production build                          |
| `pnpm typecheck`         | Nuxt typecheck                            |
| `pnpm lint` / `lint:fix` | ESLint                                    |
| `pnpm api:generate`      | Regenerate API client from `openapi.yaml` |
| `pnpm db:up` / `db:down` | Start/stop Postgres (Docker)              |
| `pnpm db:migrate`        | Apply Prisma migrations                   |
| `pnpm db:generate`       | Regenerate Prisma client                  |

## Notes

- If host port 5432 is taken, set `POSTGRES_PORT` in `.env` (compose defaults to 5432).
- `app/shared/api/` is regenerated and gitignored — never edit it by hand.
