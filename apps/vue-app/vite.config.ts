import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'vueApp',
      filename: 'remoteEntry.js',
      exposes: {
        './VueWidget': './src/VueWidget',
      },
      shared: ['vue'],
    }),
  ],
  build: {
    target: 'esnext',
  },
})
