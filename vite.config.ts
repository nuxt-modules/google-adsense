import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@nuxtjs/google-adsense': fileURLToPath(new URL('./src/module.ts', import.meta.url))
    }
  }
})