import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  buildModules: [
    ['../../src/index', {
      test: true
    }]
  ]
})
