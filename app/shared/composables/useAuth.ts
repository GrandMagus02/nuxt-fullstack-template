import { computed } from 'vue'
import { createAuthClient } from 'better-auth/vue'

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
})

export function useAuth() {
  // better-auth v1.6 Vue client returns a single reactive ref whose value
  // holds { data, isPending, isRefetching, error, refetch } — it is NOT a
  // destructurable object. Expose computed refs for ergonomic consumption.
  const sessionState = authClient.useSession()
  const session = computed(() => sessionState.value.data)
  const isPending = computed(() => sessionState.value.isPending)

  const runtimeConfig = useRuntimeConfig()

  return {
    session,
    isPending,
    signIn: authClient.signIn,
    signOut: authClient.signOut,
    signUp: authClient.signUp,
    providers: {
      google: runtimeConfig.public.googleAuthEnabled,
      github: runtimeConfig.public.githubAuthEnabled,
      magicLink: runtimeConfig.public.magicLinkEnabled,
      emailPassword: runtimeConfig.public.emailPasswordEnabled,
    },
  }
}
