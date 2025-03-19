import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { replaceCodePlugin } from 'vite-plugin-replace';

export default defineConfig({
  build: {
    outDir: 'build',
  },
  plugins: [
    react(),
    replaceCodePlugin({
      replacements: [
        {
          from: '__RELEASE_INFO__',
          to: 'MTU5NjMxOTIwMDAwMA==', // 2020-08-02
        },
      ],
    }),
  ],
})
