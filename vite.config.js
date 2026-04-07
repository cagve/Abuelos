import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [
    mkcert({
      hosts: ['192.168.1.133', 'localhost'] 
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    https: true,
		proxy: {
      '/api': 'http://127.0.0.1:3000',
      '/register-token': 'http://127.0.0.1:3000',
      '/test-push': 'http://127.0.0.1:3000',
    }
  }
})
