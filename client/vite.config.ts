import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Use a base path when building for production so assets are served
  // correctly on GitHub Pages at /<repo>/
  base: process.env.NODE_ENV === 'production' ? '/Second-Test-Assignment/' : '/',
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
});
