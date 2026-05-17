# widgets/ — Widgets layer

Self-contained UI blocks composed of features/entities (e.g. header, sidebar, feed). Below `pages`, above `features`.

## Slice layout

`widgets/<name>/ui/*.vue` (+ optional `composables/`). Components auto-import (`nuxt.config.ts` pattern `*/ui/**`), no store segment.

## Rules

- May import from `features`, `entities`, `shared`. Not from `pages`, not from another widget.
- A widget delivers a complete block; it should not need cross-widget imports.
- No widget? Page may use features directly — add a widget only when a block is reused or complex.
