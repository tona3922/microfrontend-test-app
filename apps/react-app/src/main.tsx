import './index.css'
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import type { AuthUser, OAuthProvider } from '@repo/types'
import AuthWidget from './AuthWidget'

function App() {
  const [user, setUser] = useState<AuthUser | null>(null)

  const handleOAuth = async (provider: OAuthProvider) => {
    // In standalone mode, OAuth is not wired up — log intent only
    console.info(`[standalone] OAuth requested for provider: ${provider}`)
    alert(`OAuth with ${provider} is handled by the shell app in production.`)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      {user ? (
        <div className="text-center space-y-4">
          {user.avatar && (
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full mx-auto object-cover" />
          )}
          <p className="text-white text-lg">
            Welcome, <span className="font-bold text-blue-400">{user.name}</span>!
          </p>
          <button
            onClick={() => setUser(null)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm transition-colors"
          >
            Sign out
          </button>
        </div>
      ) : (
        <AuthWidget onLogin={setUser} onOAuthLogin={handleOAuth} />
      )}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
