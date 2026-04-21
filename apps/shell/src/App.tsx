import React, { Suspense, useRef, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

// Auth MFE — login form
const AuthWidget = React.lazy(() => import('reactApp/AuthWidget'))

// Vue remote — mounted imperatively
function VueWidget() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    let vueApp: any

    Promise.all([
      import('vueApp/VueWidget') as Promise<{ default: any }>,
      import('vue') as Promise<typeof import('vue')>,
    ]).then(([{ default: VueComp }, { createApp, h }]) => {
      vueApp = createApp({ render: () => h(VueComp) })
      vueApp.mount(containerRef.current!)
    })

    return () => {
      vueApp?.unmount()
    }
  }, [])

  return <div ref={containerRef} />
}

function OAuthCallbackHandler() {
  const { handleOAuthCallback } = useAuth()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')
    const oauthError = params.get('error')

    // Remove OAuth params from URL without triggering a reload
    const cleanUrl = window.location.pathname
    window.history.replaceState({}, '', cleanUrl)

    if (oauthError) {
      setError(`Provider returned an error: ${oauthError}`)
      setStatus('error')
      return
    }

    if (!code || !state) {
      setError('Missing OAuth parameters.')
      setStatus('error')
      return
    }

    handleOAuthCallback(code, state).catch(err => {
      setError(err instanceof Error ? err.message : 'Authentication failed.')
      setStatus('error')
    })
  }, [handleOAuthCallback])

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.history.replaceState({}, '', '/')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm transition-colors"
          >
            Back to sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Completing sign in…</p>
    </div>
  )
}

function LoginPage() {
  const { login, initiateOAuth, oauthError } = useAuth()

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Micro Frontend Shell</h1>
        <p className="text-gray-400 text-sm">Sign in to access the platform.</p>
      </div>

      <Suspense fallback={<p className="text-gray-400 text-sm">Loading…</p>}>
        <AuthWidget onLogin={login} onOAuthLogin={initiateOAuth} oauthError={oauthError} />
      </Suspense>
    </div>
  )
}

function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Micro Frontend Shell</h1>
          <p className="text-gray-400 text-sm mt-1">
            Hosting remote micro frontends via Module Federation.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {user?.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span className="text-gray-300 text-sm">
            Hello, <span className="font-semibold text-blue-400">{user?.name}</span>
          </span>
          <button
            onClick={logout}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-blue-400 font-semibold mb-3">Vue MFE (port 3002)</h3>
          <VueWidget />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const { user } = useAuth()

  // Detect OAuth callback: provider redirects back with ?code=&state=
  const isOAuthCallback = new URLSearchParams(window.location.search).has('code')

  if (isOAuthCallback) return <OAuthCallbackHandler />
  return user ? <Dashboard /> : <LoginPage />
}
