// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  
  // Configuración SSR/CSR
  ssr: false,
  
  // Configuración del router
  router: {
    options: {
      strict: false
    }
  },
  
  // Módulos
  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  
  // Configuración de Pinia
  pinia: {
    autoImports: ['defineStore', 'storeToRefs']
  },
  
  // Configuración de UI
  ui: {
    icons: ['heroicons', 'lucide']
  },
  
  // Configuración de Tailwind
  tailwindcss: {
    config: {
      content: [],
      theme: {
        extend: {
          colors: {
            primary: {
              50: '#fef7ff',
              100: '#fdeeff',
              200: '#fbdfff',
              300: '#f8bfff',
              400: '#f293ff',
              500: '#e85dff',
              600: '#d633ff',
              700: '#b91cff',
              800: '#9b1cff',
              900: '#7c1dff',
              950: '#4c0d8f'
            }
          }
        }
      }
    }
  },
  
  // Configuración de runtime
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8000'
    }
  },
  
  // Configuración de app
  app: {
    head: {
      title: 'Cinemax - Sistema de Cine',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sistema de cine moderno con reservas online' }
      ]
    }
  }
})
