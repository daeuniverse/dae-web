// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/fonts',
    'nuxt-monaco-editor',
    '@nuxtjs/i18n',
    '@nuxt/ui'
  ],
  imports: {
    presets: [
      {
        from: 'gql.tada',
        imports: ['graphql']
      }
    ]
  },
  i18n: {
    defaultLocale: 'zh_Hans',
    langDir: 'locales',
    locales: [
      {
        name: 'Chinese (Simplified)',
        code: 'zh_Hans',
        file: 'zh_Hans.json'
      },
      {
        name: 'English (United States)',
        code: 'en_US',
        file: 'en_US.json'
      }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      fallbackLocale: 'zh_Hans'
    }
  }
})
