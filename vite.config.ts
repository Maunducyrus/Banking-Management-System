// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/tujipange': {
//         target: 'https://tujipange-production.up.railway.app',
//         changeOrigin: true,
//         secure: true,
//       }
//     }
//   }
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
const RAILWAY_BACKEND = 'https://tujipange-production.up.railway.app';
 
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Handles: POST/GET /tujipange/api/v1/members
      '/tujipange': {
        target: RAILWAY_BACKEND,
        changeOrigin: true,
        secure: true,
        // No rewrite — path stays as /tujipange/api/v1/...
      },
      // Handles: /api/v1/auth/..., /api/v1/members/..., /api/v1/contributions/...
      '/api': {
        target: RAILWAY_BACKEND,
        changeOrigin: true,
        secure: true,
        // No rewrite — path stays as /api/v1/...
      },
    },
  },
})