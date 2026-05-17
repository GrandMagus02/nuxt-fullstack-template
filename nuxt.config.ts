export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  srcDir: 'app',

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
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
    authSecret: '',
    databaseUrl: '',
    googleClientId: '',
    googleClientSecret: '',
    githubClientId: '',
    githubClientSecret: '',
    resendApiKey: '',
    fromEmail: '',
    public: {
      googleAuthEnabled: false,
      githubAuthEnabled: false,
      magicLinkEnabled: false,
      emailPasswordEnabled: true,
    },
  },
})
