import path from 'node:path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/fonts',
    'nuxt-monaco-editor',
    'nuxt-zod-i18n',
    '@nuxtjs/i18n',
    'nuxt-icon',
    '@vee-validate/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-primevue'
  ],

  css: ['~/assets/css/base.css'],

  primevue: {
    options: { unstyled: true },
    importPT: { as: 'Wind', from: path.resolve('./presets/wind/') }
  },

  nitro: {
    experimental: {
      websocket: true
    }
  },

  imports: {
    presets: [
      {
        from: 'gql.tada',
        imports: ['graphql']
      }
    ]
  },

  i18n: {
    defaultLocale: 'zh-CN',
    langDir: 'locales',
    locales: [
      {
        name: 'Chinese (Simplified)',
        code: 'zh-CN',
        file: 'zh-CN.json'
      },
      {
        name: 'English (United States)',
        code: 'en-US',
        file: 'en-US.json'
      }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      fallbackLocale: 'zh-CN'
    }
  }
})
