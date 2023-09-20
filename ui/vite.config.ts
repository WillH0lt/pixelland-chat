import vue from '@vitejs/plugin-vue'
import { URL, fileURLToPath } from 'url'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import codegen from 'vite-plugin-graphql-codegen'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [vue(), codegen(), cssInjectedByJsPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    includeSource: ['src/**/*.{js,ts}'],
    environment: 'happy-dom',
    globals: false,
    setupFiles: ['vitest.setup.ts'],
  },
  define: {
    'import.meta.vitest': 'undefined',
  },
  build: {
    rollupOptions: {
      output: {
        format: 'iife',
      },
    },
  },
})
