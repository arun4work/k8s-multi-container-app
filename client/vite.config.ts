import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/test.setup.ts'],
  },
  server: {
    port: 3000,
    host: true,
    hmr: {
      clientPort: 80, // 👈 Routes Vite's dev hot-reload socket cleanly through standard Ingress port 80
    },
  },
});
