import { authClient } from '~/shared/composables/useAuth'

// Route guard. Opt a page in with:
//   definePageMeta({ middleware: 'auth' })
export default defineNuxtRouteMiddleware(async (to) => {
  // Forward cookies during SSR so the session resolves on the server too.
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

  const { data: session } = await authClient.getSession({
    fetchOptions: { headers },
  })

  if (!session) {
    return navigateTo({
      path: '/',
      query: { redirect: to.fullPath },
    })
  }
})
