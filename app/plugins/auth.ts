import { authClient } from '~/shared/composables/useAuth'

// Warm the better-auth session cache once on app init (SSR-safe).
// Makes `useAuth()` and the `auth` middleware resolve without a loading flash.
export default defineNuxtPlugin(async () => {
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
  await authClient.getSession({ fetchOptions: { headers } })
})
