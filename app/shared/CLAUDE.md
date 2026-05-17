# shared/ — Shared layer

Reusable, domain-agnostic code. Bottom of FSD hierarchy — imports from no other layer; everything may import it.

## Segments

- `api/` — **GENERATED, gitignored. Never edit by hand.** Typed client + zod + pinia/colada from `openapi.yaml` (`pnpm api:generate`).
- `schemas/` — hand-written Zod (API-boundary validation).
- `ui/` — global components, auto-imported flat (`pathPrefix: false`).
- `composables/` — auto-imported (e.g. `useAuth`).
- `utils/` — pure helpers, auto-imported.

## Rules

- No business/domain logic — domain knowledge belongs in `entities`+.
- No imports from `pages`/`widgets`/`features`/`entities`.
- Need API types/calls? Use generated `shared/api`; don't hand-roll fetch.
