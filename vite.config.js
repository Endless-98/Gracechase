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
  // No dev proxy needed; app is browser-only and calls AWS directly
});