import type { AuthUser } from './AuthContext'

declare module 'reactApp/AuthWidget' {
  import { ComponentType } from 'react'
  const AuthWidget: ComponentType<{
    onLogin: (user: AuthUser) => void
  }>
  export default AuthWidget
}

declare module 'vueApp/VueWidget' {
  import { DefineComponent } from 'vue'
  const VueWidget: DefineComponent<{}, {}, any>
  export default VueWidget
}
