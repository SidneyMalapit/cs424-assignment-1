import { defineConfig } from 'vite'

export default defineConfig({
  cssCodeSplit: false,
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: 'index.html',
        exploratory: 'exploratory.html'
      }
    }
  }
})
