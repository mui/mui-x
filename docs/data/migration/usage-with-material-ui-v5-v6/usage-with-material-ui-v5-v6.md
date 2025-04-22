---
title: Usage with Material UI v5 and v6
---

# Usage with Material UI v5/v6

<p class="description">This guide describes the changes needed to use MUI X v8 with Material UI v5/v6.</p>

## Package layout changes

MUI X v8 packages have been updated to use the [Node.js `exports` field](https://nodejs.org/api/packages.html#exports), following [Material UI v7 package layout changes](https://mui.com/system/migration/upgrade-to-v7/#package-layout).

MUI X v8 packages are compatible with Material UI v7 out of the box.
We encourage upgrading to Material UI v7 to take advantage of better ESM support.

Material UI v6 and v5 can still be used but require some additional steps if you are importing the packages in a Node.js environment.

### General recommendations

We recommend trying to run the app without any changes suggested in this guide first to avoid unnecessary complexity.
If you run into the error, for example, `ERR_UNSUPPORTED_DIR_IMPORT`, then it means you're trying to load the library in native Node.js ESM and need to follow this guide.

Make sure to pass `require` [condition](https://nodejs.org/api/cli.html#-c-condition---conditionscondition) when importing MUI X packages in Node.js environment:

```bash
node --conditions=require index.mjs
```

### Vite

Update Vite configuration to pass the `require` condition to [`externalConditions`](https://vite.dev/config/ssr-options#ssr-resolve-externalconditions).

:::warning
When using this option, make sure to run Node with [`--conditions` flag](https://nodejs.org/docs/latest/api/cli.html#-c-condition---conditionscondition) with the same values in both dev and build to get a consistent behavior.
See [Vite docs](https://vite.dev/config/ssr-options#ssr-resolve-externalconditions) for more details.
:::

```ts title="vite.config.js"
import { defineConfig } from 'vite';

export default defineConfig({
  ssr: {
    resolve: {
      externalConditions: ['require'],
    },
  },
});
```

### Next.js Pages Router

With [Next.js App Router](https://nextjs.org/docs#app-router-vs-pages-router), you don't need to do anything.

With Next.js Pages Router, update Next.js configuration to pass the `require` condition and transpile MUI X packages:

```ts title="next.config.mjs"
export default {
  webpack: (config) => {
    // '...' is important here – it keeps the default webpack conditionNames
    config.resolve.conditionNames = ['require', '...'];
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

### webpack

Update webpack configuration to pass the `require` condition:

```ts title="webpack.config.js"
export default {
  // other webpack config
  resolve: {
    // '...' is important here – it keeps the default webpack conditionNames
    conditionNames: ['require', '...'],
  },
};
```
