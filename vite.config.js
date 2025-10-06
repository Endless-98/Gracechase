import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Output to a dist folder
    emptyOutDir: true,  // Clear dist/ before build (safe for output only)
  },
  base: '/Gracechase/',  // Match your repo name
});