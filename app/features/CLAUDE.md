# features/ — Features layer

User-facing actions / use cases (e.g. auth-login, post-create). Below `widgets`, above `entities`.

## Slice layout

```
features/<name>/
  ui/          *.vue        auto-imported
  composables/ *.ts         auto-imported
  store/       *.ts         Pinia store, auto-imported
```

## Rules

- May import from `entities`, `shared`. Not from `pages`/`widgets`/`features`.
- One slice = one capability. No cross-feature imports — if two features share logic, lift it to `entities` or `shared`.
- Domain data shape lives in `entities`; a feature orchestrates it + an action.
