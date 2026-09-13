import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Le build est écrit dans ../maison : la page est servie sur /maison/ avec le reste du site statique.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/maison/',
  build: { outDir: '../maison', emptyOutDir: true },
})
