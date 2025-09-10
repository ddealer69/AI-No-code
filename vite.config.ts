import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/" || '/AI-No-code',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
