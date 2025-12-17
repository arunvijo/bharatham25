import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group heavy libraries into their own named chunks
            if (id.includes('xlsx')) return 'vendor-excel';
            if (id.includes('chart.js')) return 'vendor-charts';
            if (id.includes('firebase')) return 'vendor-firebase';
            if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-animation';
            return 'vendor'; // everything else goes to vendor
          }
        }
      }
    }
  },
  server: {
    host: true,
    port: 5173,
  }
})