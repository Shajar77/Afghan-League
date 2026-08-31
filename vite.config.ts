import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    // Raise the chunk size warning limit (videos/assets are large by design)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunk splitting for large libraries
        manualChunks(id) {
          // Keep GSAP in its own chunk
          if (id.includes('gsap')) {
            return 'gsap'
          }
          // Keep lucide icons in their own chunk
          if (id.includes('lucide-react')) {
            return 'lucide'
          }
          // Keep recharts library in its own chunk
          if (id.includes('recharts')) {
            return 'recharts'
          }
          // Core React runtime stays in main vendor chunk
          if (id.includes('react-dom') || id.includes('react/')) {
            return 'react-vendor'
          }
        },
      },
    },
  },
})
