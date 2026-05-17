# layers/ — Nuxt Layers

> **Naming clash:** these are **Nuxt Layers** (config/feature extension units), *not* FSD layers. FSD layers = `shared/entities/features/widgets/pages`. A Nuxt Layer is a self-contained mini-Nuxt that the main app extends.

## What goes here

One subdir per layer: a reusable, isolated unit (own `nuxt.config.ts` + its own Nuxt dirs and, if it has UI, its own FSD slices inside). Use for cross-project modules or large feature isolation.

```
layers/<name>/
  nuxt.config.ts
  app/ ...            # layer's own srcDir-style tree (optional)
```

## Register

Not auto-scanned. Add to root `nuxt.config.ts`:

```ts
extends: ['./app/layers/<name>'],
```

Later entries are overridden by earlier ones / the root app. Keep a layer self-contained — it must not reach into the host app's FSD slices.
