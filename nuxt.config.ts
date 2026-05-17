import process from 'node:process'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  srcDir: 'app',

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
  ],

  components: [
    { path: '~/shared/ui', pathPrefix: false },
    { path: '~/widgets', pattern: '*/ui/**', pathPrefix: false },
    { path: '~/entities', pattern: '*/ui/**', pathPrefix: false },
    { path: '~/features', pattern: '*/ui/**', pathPrefix: false },
  ],

  imports: {
    dirs: [
      '~/shared/utils',
      '~/shared/composables',
      '~/entities/*/composables',
      '~/entities/*/store',
      '~/features/*/composables',
      '~/features/*/store',
      '~/widgets/*/composables',
    ],
  },

  runtimeConfig: {
    public: {
      googleAuthEnabled: !!process.env.AUTH_GOOGLE_CLIENT_ID,
      githubAuthEnabled: !!process.env.AUTH_GITHUB_CLIENT_ID,
      magicLinkEnabled: !!process.env.AUTH_RESEND_API_KEY,
      emailPasswordEnabled: true,
    },
  },
})
