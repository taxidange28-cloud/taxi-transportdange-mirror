import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Configuration pour le mode preview (important pour tester localement)
  preview: {
    port: 3000,
    strictPort: false,
    // Redirection SPA - toutes les routes vers index.html
    proxy: undefined,
  },
  // Configuration du build
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Générer des sourcemaps pour le debug en production (optionnel)
    sourcemap: false,
    // Optimisation
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  // Configuration du serveur de dev
  server: {
    port: 5173,
    strictPort: false,
    // Permet l'accès depuis d'autres machines (utile pour mobile testing)
    host: true,
  },
})
