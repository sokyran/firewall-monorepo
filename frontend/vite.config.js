const { resolve } = require('path')
const { defineConfig } = require('vite')
import fs from 'fs';

module.exports = defineConfig({
  root: 'src',
  build: {
    outDir: '../../backend/dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        posts: resolve(__dirname, 'src/posts/index.html'),
        login: resolve(__dirname, 'src/login/index.html'),
        dashboard: resolve(__dirname, 'src/dashboard/index.html'),
      },
      output: {
        assetFileNames: `assets/index.[ext]`,
      }
    }
  },
  server: {
    https: {
      key: fs.readFileSync('../key.pem'),
      cert: fs.readFileSync('../cert.pem'),
    },
  },
})
