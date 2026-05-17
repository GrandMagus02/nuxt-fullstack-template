# entities/ — Entities layer

Core business objects (User, Post, …): their model, store, and display UI. Below `features`, above `shared`.

## Slice layout

```
entities/<name>/
  ui/          *.vue        presentational (e.g. UserCard)
  composables/ *.ts
  store/       *.ts         Pinia store (entity state), auto-imported
```

## Rules

- May import from `shared` only. No cross-entity imports — keep entities independent.
- Holds *what a thing is*, not *what the user does with it* (that's `features`).
- Validation schemas: hand-written ones in `shared/schemas`; generated zod in `shared/api`.
