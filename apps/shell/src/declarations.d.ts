import type { AuthUser, OAuthProvider } from '@repo/types'

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
