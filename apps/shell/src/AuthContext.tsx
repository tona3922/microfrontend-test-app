import React, { createContext, useContext, useState, useCallback } from 'react'
import type { AuthUser, OAuthProvider } from '@repo/types'
import {
  buildAuthUrl,
  exchangeCodeForToken,
  fetchUserInfo,
  generateCodeVerifier,
  generateState,
  OAUTH_SESSION_KEYS,
} from './oauth'

export type { AuthUser, OAuthProvider }

interface AuthContextValue {
  user: AuthUser | null
  login: (user: AuthUser) => void
  logout: () => void
  initiateOAuth: (provider: OAuthProvider) => Promise<void>
  handleOAuthCallback: (code: string, state: string) => Promise<void>
  oauthError: string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

const REDIRECT_URI = `${window.location.origin}/`

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [oauthError, setOauthError] = useState<string | null>(null)

  const login = useCallback((u: AuthUser) => {
    setOauthError(null)
    setUser(u)
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const initiateOAuth = useCallback(async (provider: OAuthProvider) => {
    setOauthError(null)
    const verifier = generateCodeVerifier()
    const state = generateState()

    sessionStorage.setItem(OAUTH_SESSION_KEYS.verifier, verifier)
    sessionStorage.setItem(OAUTH_SESSION_KEYS.state, state)
    sessionStorage.setItem(OAUTH_SESSION_KEYS.provider, provider)

    const url = await buildAuthUrl(provider, REDIRECT_URI, state, verifier)
    window.location.href = url
  }, [])

  const handleOAuthCallback = useCallback(async (code: string, returnedState: string) => {
    const savedState = sessionStorage.getItem(OAUTH_SESSION_KEYS.state)
    const verifier = sessionStorage.getItem(OAUTH_SESSION_KEYS.verifier)
    const provider = sessionStorage.getItem(OAUTH_SESSION_KEYS.provider) as OAuthProvider | null

    // Clear session keys regardless of outcome
    Object.values(OAUTH_SESSION_KEYS).forEach(k => sessionStorage.removeItem(k))

    if (!savedState || !verifier || !provider) {
      setOauthError('OAuth session expired. Please try again.')
      return
    }

    if (returnedState !== savedState) {
      setOauthError('Invalid OAuth state. Possible CSRF attack — request rejected.')
      return
    }

    try {
      const tokens = await exchangeCodeForToken(provider, code, REDIRECT_URI, verifier)
      const userInfo = await fetchUserInfo(provider, tokens.access_token)
      login(userInfo)
    } catch (err) {
      setOauthError(err instanceof Error ? err.message : 'Authentication failed.')
    }
  }, [login])

  return (
    <AuthContext.Provider value={{ user, login, logout, initiateOAuth, handleOAuthCallback, oauthError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
