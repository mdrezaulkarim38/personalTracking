import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ optimizeDeps: { entries: ['index.html'] }, server: { port: 5500, strictPort: true }, preview: { port: 5500, strictPort: true }, plugins: [react(), tailwindcss()], test: { environment: 'jsdom', setupFiles: ['./tests/setup.ts'], globals: true } });
