import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 0, // Ensure large images aren’t inlined
  },
  base: process.env.NODE_ENV === 'production' ? '/Gracechase/' : '/',
});