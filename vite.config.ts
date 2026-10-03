import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// base './' so the build works from any static host path (e.g. GitHub Pages)
// Two pages from one origin so they can share localStorage:
// the patient app (/) and the clinic dashboard (/clinic-dashboard/).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        clinic: resolve(__dirname, 'clinic-dashboard/index.html'),
      },
    },
  },
})
