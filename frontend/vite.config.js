import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, import.meta.dirname, 'VITE_')

  // A bundle built without this key cannot initialise Clerk and fails on load,
  // so fail the build rather than shipping a broken site.
  if (command === 'build' && !env.VITE_CLERK_PUBLISHABLE_KEY?.trim()) {
    throw new Error(
      'VITE_CLERK_PUBLISHABLE_KEY is not set. Add it to the site environment ' +
      'variables (scoped to builds) before deploying.'
    )
  }

  return {
    plugins: [react(), tailwindcss()],
  }
})
