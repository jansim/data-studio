import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // Use newer build target here to deal with bigint64 not being supported in all browsers!
    target: ['es2020'],
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'modules/iframe/module-sanddance/index.html')
      },
      output: {
        // Use an underscore here instead of dot between name and hash to avoid
        // an issue where netlify won't deploy files starting with a dot
        assetFileNames: `assets/[name]_[hash].[ext]`
      }
    }
  }
})
