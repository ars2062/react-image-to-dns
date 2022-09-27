import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import image from 'vite-plugin-react-image-dns'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [image(), react()]
})
