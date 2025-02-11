import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import node from '@astrojs/node'

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: 'server',
  adapter: node({ mode: 'middleware' }),
  security: {
    checkOrigin: true,
  },
  prefetch: {
    prefetchAll: true,
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['oslo', '@node-rs/argon2', '@node-rs/bcrypt'],
    },
    server: {
      proxy: {
        '/trpc': {
          target: 'http://localhost:8080',
          ws: true,
        },
      },
    },
  },
})
