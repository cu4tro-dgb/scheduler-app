// https://nuxt.com/docs/api/configuration/nuxt-config
// import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui-pro'
  ],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      titleTemplate: 'Scheduler App',
      htmlAttrs: {
        lang: 'es'
      },
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },
  vite: {
    // plugins: [tsconfigPaths()],
    vue: {
      template: {
        transformAssetUrls: {
          video: ['src', 'poster'],
          source: ['src'],
          img: ['src'],
          image: ['xlink:href', 'href'],
          use: ['xlink:href', 'href']
        }
      }
    }
  }
})
