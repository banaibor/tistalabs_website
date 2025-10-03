import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '22ca1b0da509.ngrok-free.app',
      '.ngrok-free.app', // Allow all ngrok hosts
    ],
  },
})
