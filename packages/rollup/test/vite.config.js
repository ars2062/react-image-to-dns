import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import image from 'react-image-to-dns-rollup'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [image(), react()]
})
