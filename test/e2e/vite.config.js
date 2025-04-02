import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    outDir: 'build',
  },
  plugins: [
    react(),
    {
      name: 'replace-code',
      enforce: 'post',
      async transform(code) {
        return code
          .replaceAll('__RELEASE_INFO__', 'MTU5NjMxOTIwMDAwMA==') // 2020-08-02
          .replaceAll('DISABLE_CHANCE_RANDOM', 'true')
      },
    },
  ],
});
