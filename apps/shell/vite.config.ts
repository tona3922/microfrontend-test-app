import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const reactAppUrl = env.VITE_REACT_APP_URL ?? 'http://localhost:3001'
  const vueAppUrl = env.VITE_VUE_APP_URL ?? 'http://localhost:3002'

  return {
    plugins: [
      tailwindcss(),
      react(),
      federation({
        name: 'shell',
        remotes: {
          reactApp: `${reactAppUrl}/assets/remoteEntry.js`,
          vueApp: `${vueAppUrl}/assets/remoteEntry.js`,
        },
        shared: ['react', 'react-dom', 'vue'],
      }),
    ],
    build: {
      target: 'esnext',
    },
  }
})
