import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ERP_-Student-Management-System/',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
