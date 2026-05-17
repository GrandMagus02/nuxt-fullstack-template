# pages/ — Pages layer

Nuxt file-based routes. One file = one route. Top of FSD hierarchy (below App).

## Rules

- May import from `widgets`, `features`, `entities`, `shared`. Never from another page.
- Keep thin: compose widgets/features, wire route params/meta, set SEO. No business logic here — push it down a layer.
- File path = URL. `index.vue` → `/`.
- Protect a route: `definePageMeta({ middleware: 'auth' })` (see `app/CLAUDE.md`).
