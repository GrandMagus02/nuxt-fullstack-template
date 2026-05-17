import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,
  formatters: true,
  ignores: [
    // Generated hey-api client (also gitignored)
    'app/shared/api/**',
    // Reference design specs / implementation plans — prose docs, not source
    'docs/**',
  ],
  rules: {
    'no-console': 'warn',
  },
})
