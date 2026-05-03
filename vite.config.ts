import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 7878,
  },
  preview: {
    host: true,
    port: 7878,
  },
  optimizeDeps: {
    exclude: ['@imgly/background-removal'],
  },
})
