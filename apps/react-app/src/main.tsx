import './index.css'
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import AuthWidget, { AuthUser } from './AuthWidget'

function App() {
  const [user, setUser] = useState<AuthUser | null>(null)

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      {user ? (
        <div className="text-center space-y-4">
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
        <AuthWidget onLogin={setUser} />
      )}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
