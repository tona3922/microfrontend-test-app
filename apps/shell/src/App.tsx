import React, { Suspense, useRef, useEffect } from 'react'

// React remote — exposed as a React component, use directly
const ReactWidget = React.lazy(() => import('reactApp/ReactWidget'))

// Vue remote — must be mounted into the DOM via Vue's createApp
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

export default function App() {
  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        padding: 32,
        background: '#0d0d0d',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      <h1 style={{ marginBottom: 8 }}>Micro Frontend Shell</h1>
      <p style={{ color: '#aaa', marginBottom: 32 }}>
        Hosting remote React and Vue micro frontends via Module Federation.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <h3 style={{ color: '#61dafb', marginBottom: 12 }}>React MFE (port 3001)</h3>
          <Suspense fallback={<div style={{ color: '#aaa' }}>Loading React MFE...</div>}>
            <ReactWidget />
          </Suspense>
        </div>

        <div>
          <h3 style={{ color: '#42b883', marginBottom: 12 }}>Vue MFE (port 3002)</h3>
          <Suspense fallback={<div style={{ color: '#aaa' }}>Loading Vue MFE...</div>}>
            <VueWidget />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
