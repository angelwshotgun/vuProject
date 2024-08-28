// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/leaflet',
    
  ],
  primevue: {
      options: {
          theme: {
              preset: Aura
          }
      },
      usePrimeVue: true
  },
  css: ["~/assets/css/style.scss"],
})
