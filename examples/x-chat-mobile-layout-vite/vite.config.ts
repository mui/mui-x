import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
    alias: [
      {
        find: /^react$/,
        replacement: path.resolve(__dirname, 'node_modules/react/index.js'),
      },
      {
        find: /^react-dom$/,
        replacement: path.resolve(__dirname, 'node_modules/react-dom/index.js'),
      },
      {
        find: /^react\/jsx-runtime$/,
        replacement: path.resolve(__dirname, 'node_modules/react/jsx-runtime.js'),
      },
      {
        find: /^@emotion\/react$/,
        replacement: path.resolve(
          __dirname,
          'node_modules/@emotion/react/dist/emotion-react.esm.js',
        ),
      },
      {
        find: /^@emotion\/styled$/,
        replacement: path.resolve(
          __dirname,
          'node_modules/@emotion/styled/dist/emotion-styled.esm.js',
        ),
      },
      {
        find: /^@mui\/x-chat\/headless$/,
        replacement: path.resolve(__dirname, '../../packages/x-chat-headless/src/index.ts'),
      },
      {
        find: /^@mui\/x-chat$/,
        replacement: path.resolve(__dirname, '../../packages/x-chat/src/index.ts'),
      },
      {
        find: /^@mui\/x-chat-headless$/,
        replacement: path.resolve(__dirname, '../../packages/x-chat-headless/src/index.ts'),
      },
      {
        find: '@mui/x-chat-headless/',
        replacement: `${path.resolve(__dirname, '../../packages/x-chat-headless/src/')}/`,
      },
      {
        find: /^@mui\/x-internals$/,
        replacement: path.resolve(__dirname, '../../packages/x-internals/src/index.ts'),
      },
      {
        find: '@mui/x-internals/',
        replacement: `${path.resolve(__dirname, '../../packages/x-internals/src/')}/`,
      },
    ],
  },
  server: {
    port: 4174,
    fs: {
      allow: [path.resolve(__dirname, '../..')],
    },
  },
});
