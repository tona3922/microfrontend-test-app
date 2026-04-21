import React, { Suspense, useRef, useEffect } from 'react'
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

function LoginPage() {
  const { login } = useAuth()

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Micro Frontend Shell</h1>
        <p className="text-gray-400 text-sm">Sign in to access the platform.</p>
      </div>

      <Suspense fallback={<p className="text-gray-400 text-sm">Loading…</p>}>
        <AuthWidget onLogin={login} />
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
  return user ? <Dashboard /> : <LoginPage />
}
