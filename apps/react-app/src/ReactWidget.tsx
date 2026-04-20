import React from 'react'

export default function ReactWidget() {
  const [count, setCount] = React.useState(0)

  return (
    <div style={{ border: '2px solid #61dafb', borderRadius: 8, padding: 24, background: '#20232a', color: '#61dafb' }}>
      <h2 style={{ margin: '0 0 12px' }}>React Micro Frontend</h2>
      <p style={{ margin: '0 0 16px', color: '#fff' }}>This component is loaded remotely via Module Federation.</p>
      <button
        onClick={() => setCount(c => c + 1)}
        style={{
          background: '#61dafb',
          color: '#20232a',
          border: 'none',
          borderRadius: 4,
          padding: '8px 16px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: 14,
        }}
      >
        Count: {count}
      </button>
    </div>
  )
}
