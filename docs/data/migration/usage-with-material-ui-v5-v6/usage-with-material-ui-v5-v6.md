---
title: Usage with Material UI v5 and v6
---

# Usage with Material UI v5/v6

<p class="description">This guide describes the changes needed to use the Data Grid with Material UI v5/v6.</p>

## Package layout changes

MUI X v8 packages have been updated to use the [Node.js `exports` field](https://nodejs.org/api/packages.html#exports), following [Material v7 package layout changes](https://mui.com/system/migration/upgrade-to-v7/#package-layout).

MUI X v8 packages are compatible with Material UI v7 out of the box.
We encourage upgrading to Material UI v7 to take advantage of better ESM support.

Material UI v6 and v5 are still supported, but require some additional steps if you are importing the packages in Node.js environment.

### General recommendations

- Make sure to pass `require` [condition](https://nodejs.org/api/cli.html#-c-condition---conditionscondition) when importing MUI X packages in Node.js environment:
  ```bash
  node --conditions=require index.mjs
  ```

### Vite

Update Vite configuration to pass `require` condition:

```ts
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  ssr: {
    resolve: {
      externalConditions: ['require'],
    },
  },
});
```

### Next.js Pages router

Update Next.js configuration to pass `require` condition and transpile MUI X packages:

```ts
// next.config.js

export default {
  webpack: (config) => {
    config.resolve.conditionNames = ['require', '...']; // '...' is important here – it keeps the default webpack conditionNames
    return config;
  },
  transpilePackages: [
    '@mui/x-data-grid',
    '@mui/x-data-grid-pro',
    '@mui/x-data-grid-premium',
    '@mui/x-date-pickers',
    '@mui/x-date-pickers-pro',
    '@mui/x-charts',
    '@mui/x-charts-pro',
    '@mui/x-tree-view',
    '@mui/x-tree-view-pro',
  ],
};
```
