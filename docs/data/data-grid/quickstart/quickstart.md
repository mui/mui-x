# Data Grid - Quickstart

<p class="description">Install the MUI X Data Grid package and start building your React data table.</p>

## Installation

Install the Data Grid package that best suits your needs—Community, Pro, or Premium:

{{"component": "modules/components/DataGridInstallationInstructions.js"}}

:::success
Not sure which package to choose?
You can start with the Community version and upgrade to Pro or Premium at any time.
Check out the [Feature showcase](/x/react-data-grid/features/) for a list of features available in each package.
:::

### Peer dependencies

#### Material UI

The Data Grid packages have a peer dependency on `@mui/material`.
If you're not already using it, install it now:

<codeblock storageKey="package-manager">

```bash npm
npm install @mui/material @emotion/react @emotion/styled
```

```bash pnpm
pnpm add @mui/material @emotion/react @emotion/styled
```

```bash yarn
yarn add @mui/material @emotion/react @emotion/styled
```

</codeblock>

#### React

<!-- #react-peer-version -->

[`react`](https://www.npmjs.com/package/react) and [`react-dom`](https://www.npmjs.com/package/react-dom) are also peer dependencies:

```json
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0 || ^19.0.0",
  "react-dom": "^17.0.0 || ^18.0.0 || ^19.0.0"
},
```

## Rendering a Data Grid

### Import the component

Import the Data Grid component that corresponds to the version you're using, along with the `GridRowsProp` and `GridColDef` utilities:

```js
// choose one
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { DataGridPro, GridRowsProp, GridColDef } from '@mui/x-data-grid-pro';
import { DataGridPremium, GridRowsProp, GridColDef } from '@mui/x-data-grid-premium';
```

### Define rows

Each row in the Data Grid is an object with key-value pairs that correspond to the column and its value, respectively.
You should provide an `id` property for delta updates and improved performance.

The code snippet below defines three rows with values assigned to the `name` and `description` columns for each:

```tsx
const rows: GridRowsProp = [
  { id: 1, name: 'Data Grid', description: 'the Community version' },
  { id: 2, name: 'Data Grid Pro', description: 'the Pro version' },
  { id: 3, name: 'Data Grid Premium', description: 'the Premium version' },
];
```

### Define columns

Each column in the Data Grid is an object with attributes defined in the `GridColDef` interface—you can import this interface to see all available properties.
The `headerName` property sets the name of the column, and the `field` property maps the column to its corresponding row values.

The snippet below builds on the code from the previous section to define the `name` and `description` columns referenced in the row definitions:

```tsx
const columns: GridColDef[] = [
  { field: 'name', headerName: 'Product Name', width: 200 },
  { field: 'description', headerName: 'Description', width: 300 },
];
```

### Render the component

With the component and utilities imported, and rows and columns defined, you're now ready to render the Data Grid as shown below:

{{"demo": "RenderComponent.js", "defaultCodeOpen": true, "bg": "inline"}}

:::warning
You must set [intrinsic dimensions](/x/react-data-grid/layout/) on the Data Grid's parent container.
:::

## TypeScript

### Theme augmentation

To benefit from [CSS overrides](/material-ui/customization/theme-components/#theme-style-overrides) and [default prop customization](/material-ui/customization/theme-components/#theme-default-props) with the theme, TypeScript users must import the following types.
These types use module augmentation to extend the default theme structure.

```tsx
// Pro and Premium users: add `-pro` or `-premium` suffix to package name
import type {} from '@mui/x-data-grid/themeAugmentation';

const theme = createTheme({
  components: {
    // Use `MuiDataGrid` on DataGrid, DataGridPro and DataGridPremium
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
  },
});
```

## Bundling

The Data Grid requires a bundler that can handle CSS imports.
If you're using a setup that doesn't support CSS imports out of the box, follow the instructions below for your specific environment.

### webpack

Update your config to add the `style-loader` and `css-loader`.

```ts title="webpack.config.js"
export default {
  // other webpack config
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

### Vite

CSS imports should work with no additional configuration when using Vite.

### Vitest

Add the Data Grid packages to `test.deps.inline`.

```ts title="vitest.config.ts"
export default defineConfig({
  test: {
    deps: {
      inline: [
        '@mui/x-data-grid',
        '@mui/x-data-grid-pro',
        '@mui/x-data-grid-premium',
      ],
    },
  },
});
```

### Next.js

If you're using the App Router, CSS imports should work out of the box.

If you're using the Pages Router, you need to add the Data Grid packages to [`transpilePackages`](https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages).

```ts title="next.config.ts"
export default {
  transpilePackages: [
    '@mui/x-data-grid',
    '@mui/x-data-grid-pro',
    '@mui/x-data-grid-premium',
  ],
};
```

### Node.js

If you're importing the packages inside Node.js, you can make CSS imports a no-op like this:

**Using `require()`**:

```js
require.extensions['.css'] = () => null;
```

**Using `import`**:

```js title="node-ignore-css.js"
// node-ignore-css.js
// Needs to be loaded before your code runs:
//   node --import ./node-ignore-css.js ./index.js
import { registerHooks } from 'node:module';
registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith('.css')) {
      return { url, format: 'module', source: '', shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
```

### Jest

If you're using Jest, add the [`identity-obj-proxy`](https://www.npmjs.com/package/identity-obj-proxy) package to mock CSS imports.

```ts title="jest.config.js"
moduleNameMapper: {
  '\\.(css|less|scss|sass)$': 'identity-obj-proxy'',
},
```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)

## Using this documentation

### Feature availability

:::info
MUI X is **open core**—Community components are MIT-licensed, while more advanced features require a Pro or Premium commercial license.
See [Licensing](/x/introduction/licensing/) for details.
:::

Throughout the documentation, Pro- and Premium-only features are denoted with the [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan') and [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') icons, respectively.

All documentation for Community components and features also applies to their Pro and Premium counterparts.

### @mui/x-data-grid-generator

**The `@mui/x-data-grid-generator` is a development-only package and should not be used in production.**
You can use it to create a reproduction of a bug or generate demo data in your development environment.
You should not rely on its API—it doesn't follow semver.

### useDemoData hook

The `useDemoData` hook is a utility hook from the `@mui/x-data-grid-generator` package, used in demos throughout this documentation to provide realistic data without polluting the code with data generation logic.
It contains column definitions and generates random data for the Data Grid.
For more details on these definitions and the custom cell renderers available, see the [custom columns demo](/x/react-data-grid/custom-columns/#full-example) where you can copy them from the demo source code.

Here's how it's used:

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function Demo() {
  const { data } = useDemoData({ dataSet: 'Commodity', rowLength: 100 });

  return <DataGrid {...data} />;
}
```

It comes with two datasets: `Commodity` and `Employee`.
You can customize the data generation by passing the custom options of type [`UseDemoDataOptions`](https://github.com/mui/mui-x/blob/6aad22644ee710690b90dc2ac6bbafceb91fecf0/packages/x-data-grid-generator/src/hooks/useDemoData.ts#L29-L36).
