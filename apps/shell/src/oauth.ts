import type { OAuthProvider } from '@repo/types'

export type { OAuthProvider }

export interface OAuthProviderConfig {
  name: string
  authUrl: string
  tokenUrl: string
  userInfoUrl: string
  scopes: string[]
  clientId: string
  /**
   * Required by Google even for Desktop app (public) clients — the secret is intentionally
   * non-confidential for installed/desktop apps; PKCE provides the real security guarantee.
   * GitHub does not support CORS on its token endpoint, so token exchange must go through
   * a backend proxy instead.
   */
  clientSecret?: string
  pkce: boolean
}

export const OAUTH_PROVIDERS: Record<OAuthProvider, OAuthProviderConfig> = {
  google: {
    name: 'Google',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
    scopes: ['openid', 'email', 'profile'],
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '',
    clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET ?? '',
    pkce: true,
  },
  github: {
    name: 'GitHub',
    authUrl: 'https://github.com/login/oauth/authorize',
    // GitHub token exchange does not support CORS — route through your backend:
    // POST /api/auth/github/token { code, redirectUri }
    tokenUrl: import.meta.env.VITE_GITHUB_TOKEN_PROXY_URL ?? '/api/auth/github/token',
    userInfoUrl: 'https://api.github.com/user',
    scopes: ['read:user', 'user:email'],
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID ?? '',
    pkce: false,
  },
}

// ── PKCE helpers ─────────────────────────────────────────────────────────────

export function generateCodeVerifier(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export function generateState(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

// ── Auth URL builder ──────────────────────────────────────────────────────────

export async function buildAuthUrl(
  provider: OAuthProvider,
  redirectUri: string,
  state: string,
  codeVerifier: string,
): Promise<string> {
  const config = OAUTH_PROVIDERS[provider]
  const params: Record<string, string> = {
    client_id: config.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    state,
  }

  if (config.pkce) {
    params.code_challenge = await generateCodeChallenge(codeVerifier)
    params.code_challenge_method = 'S256'
  }

  return `${config.authUrl}?${new URLSearchParams(params)}`
}

// ── Token exchange ────────────────────────────────────────────────────────────

export interface TokenResponse {
  access_token: string
  token_type: string
  scope?: string
  id_token?: string
}

export async function exchangeCodeForToken(
  provider: OAuthProvider,
  code: string,
  redirectUri: string,
  codeVerifier: string,
): Promise<TokenResponse> {
  const config = OAUTH_PROVIDERS[provider]

  const body: Record<string, string> = {
    grant_type: 'authorization_code',
    client_id: config.clientId,
    code,
    redirect_uri: redirectUri,
  }

  if (config.clientSecret) {
    body.client_secret = config.clientSecret
  }

  if (config.pkce) {
    body.code_verifier = codeVerifier
  }

  const res = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Token exchange failed (${res.status}): ${text}`)
  }

  return res.json()
}

// ── User info ─────────────────────────────────────────────────────────────────

export interface OAuthUserInfo {
  email: string
  name: string
  avatar?: string
}

export async function fetchUserInfo(
  provider: OAuthProvider,
  accessToken: string,
): Promise<OAuthUserInfo> {
  const config = OAUTH_PROVIDERS[provider]
  const res = await fetch(config.userInfoUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) throw new Error(`Failed to fetch user info (${res.status})`)

  const data = await res.json()

  if (provider === 'google') {
    return { email: data.email, name: data.name ?? data.email, avatar: data.picture }
  }

  // GitHub
  const email = data.email ?? `${data.login}@github.invalid`
  return { email, name: data.name ?? data.login, avatar: data.avatar_url }
}

// ── Session storage keys ──────────────────────────────────────────────────────

export const OAUTH_SESSION_KEYS = {
  verifier: 'oauth_code_verifier',
  state: 'oauth_state',
  provider: 'oauth_provider',
} as const
