import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // Use newer build target here to deal with bigint64 not being supported in all browsers!
    target: ['es2020']
  }
})
