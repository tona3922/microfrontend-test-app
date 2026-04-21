import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import ReactWidget from './ReactWidget'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>React App (standalone)</h1>
      <ReactWidget />
    </div>
  </React.StrictMode>
)
