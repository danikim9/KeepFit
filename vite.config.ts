import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' so the build works from any static host path (e.g. GitHub Pages)
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      // 환자 앱(index.html) + 병원 대시보드(clinic-dashboard/index.html)를 같은 주소에서 함께 배포
      input: {
        main: 'index.html',
        clinic: 'clinic-dashboard/index.html',
      },
    },
  },
})
