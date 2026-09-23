import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'
import ConfigError from './components/ConfigError.jsx'

// Vite inlines this at build time, so it must be present in the build
// environment — setting it afterwards has no effect until a redeploy.
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim()

const root = createRoot(document.getElementById('root'))

if (PUBLISHABLE_KEY) {
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </StrictMode>,
  )
} else {
  console.error(
    'VITE_CLERK_PUBLISHABLE_KEY was not available when this bundle was built. ' +
    'Set it as a build-scoped environment variable on the site and redeploy.'
  )
  root.render(<ConfigError variable="VITE_CLERK_PUBLISHABLE_KEY" />)
}
