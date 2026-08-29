import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'resolve-js-to-ts',
      async resolveId(id, importer) {
        // If the import ends with .js and is a relative path, check if a .ts or .tsx file exists
        if (id.endsWith('.js') && (id.startsWith('./') || id.startsWith('../'))) {
          const resolvedPath = importer ? path.resolve(path.dirname(importer), id) : id
          const basePath = resolvedPath.slice(0, -3)
          try {
            if (fs.existsSync(basePath + '.ts')) {
              return basePath + '.ts'
            }
            if (fs.existsSync(basePath + '.tsx')) {
              return basePath + '.tsx'
            }
          } catch {
            // Continue with normal resolution
          }
        }
        return null
      },
    },
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
