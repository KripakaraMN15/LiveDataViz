import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  // Avoid Windows file-lock issues (Dropbox/AV can lock repo folders).
  // Put Vite cache outside the project when possible.
  cacheDir:
    process.env.VITE_CACHE_DIR ??
    path.join(process.env.LOCALAPPDATA ?? process.cwd(), 'livedataviz-vite-cache'),
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // When running `vercel dev`, the port may change if 3000 is busy.
        // Override with:
        // - VITE_API_PROXY_TARGET=http://localhost:3001
        // - or VITE_API_PROXY_PORT=3001
        target: process.env.VITE_API_PROXY_TARGET ?? `http://localhost:${process.env.VITE_API_PROXY_PORT ?? 3000}`,
        changeOrigin: true,
      }
    }
  }
})
