import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['enrollapp.uwed.uz'],
    hmr: {
      host: 'enrollapp.uwed.uz',
      protocol: 'wss',
      port: 3000,
      clientPort: 3000,
    }
  },
  proxy: {
    '/api': {
      target: 'https://desired-fit-parakeet.ngrok-free.app',
      changeOrigin: true,
      secure: false
    }
  },
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
