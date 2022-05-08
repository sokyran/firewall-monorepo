const { resolve } = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        posts: resolve(__dirname, 'posts/index.html'),
        login: resolve(__dirname, 'login/index.html'),
      }
    }
  }
})
