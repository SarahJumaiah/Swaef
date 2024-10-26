import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: {
      overlay: false,
    },
  },
  optimizeDeps: {
    include: ['@mapbox/mapbox-gl-geocoder'],
  },
  plugins: [react()],
})
