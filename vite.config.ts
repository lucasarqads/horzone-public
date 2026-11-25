import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // páginas: o site (index.html), os Termos de Uso (termos.html) e a Política de Privacidade (privacidade.html)
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        termos: resolve(import.meta.dirname, 'termos.html'),
        privacidade: resolve(import.meta.dirname, 'privacidade.html'),
      },
    },
  },
})
