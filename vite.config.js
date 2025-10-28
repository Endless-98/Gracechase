import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 0, // Ensure large images aren’t inlined
  },
  base: process.env.VITE_GITHUB_PAGES ? '/Gracechase/' : '/',
  server: {
    proxy: {
      // Proxy API calls to local backend during dev to avoid 404s from Vite
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});