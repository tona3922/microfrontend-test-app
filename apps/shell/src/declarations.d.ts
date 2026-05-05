import type { AuthUser, OAuthProvider } from '@repo/types'

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_GOOGLE_CLIENT_SECRET: string
  readonly VITE_GITHUB_CLIENT_ID: string
  readonly VITE_GITHUB_TOKEN_PROXY_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'reactApp/AuthWidget' {
  import { ComponentType } from 'react'
  const AuthWidget: ComponentType<{
    onLogin: (user: AuthUser) => void
    onOAuthLogin: (provider: OAuthProvider) => void
    oauthError?: string | null
  }>
  export default AuthWidget
}

declare module 'vueApp/VueWidget' {
  import { DefineComponent } from 'vue'
  const VueWidget: DefineComponent<{}, {}, any>
  export default VueWidget
}
