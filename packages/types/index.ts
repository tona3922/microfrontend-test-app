export interface AuthUser {
  email: string
  name: string
  avatar?: string
}

export type OAuthProvider = 'google' | 'github'
