# app/ — FSD root (App layer)

Nuxt `srcDir`. Holds the FSD **App layer**: `app.vue` (root `NuxtLayout` + `NuxtPage`), `plugins/`, `middleware/`, global setup. These Nuxt dirs are App-layer — they may import from any lower layer.

> `layers/` here = **Nuxt Layers** (extension units), *not* FSD layers — see `app/layers/CLAUDE.md`.

## Auth guard

`middleware/auth.ts` — named route middleware. Guard a page:

```ts
definePageMeta({ middleware: 'auth' })
```

No session → redirect `/` with `?redirect=<path>`. `plugins/auth.ts` prefetches the better-auth session on init (SSR-safe) so the guard/`useAuth()` resolve with no loading flash.

## Layer hierarchy

Import direction is one-way, top → down. A layer may import only from layers **below** it:

```
App  →  pages  →  widgets  →  features  →  entities  →  shared
```

- Slices on the **same** layer must not import each other.
- No upward imports (e.g. `entities` importing `features`).
- `shared` imports nothing from other layers.

## Slice anatomy

Each slice (under `entities/`, `features/`, `widgets/`) uses segments:

- `ui/` — `.vue` components, auto-imported (see `components` in `nuxt.config.ts`)
- `composables/` — auto-imported
- `store/` — Pinia store, auto-imported (`entities`/`features` only)

Auto-import globs live in `nuxt.config.ts` (`components`, `imports.dirs`). Add a slice → it just works, no manual index/barrel.

Per-layer rules in each subdir's `CLAUDE.md`.
