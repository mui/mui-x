# Data Grid - Getting started

<p class="description">Install the MUI X Data Grid package, configure rows and columns, and start building your React data table.</p>

## Installation

Run one of the following commands to install the MUI X Data Grid package that best suits your needs—the free Community version or the paid Pro or Premium version:

<!-- #default-branch-switch -->

{{"component": "modules/components/DataGridInstallationInstructions.js"}}

The Data Grid packages have a peer dependency on `@mui/material`.
If you're not already using it, install it with the following command:

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

<!-- #react-peer-version -->

[`react`](https://www.npmjs.com/package/react) and [`react-dom`](https://www.npmjs.com/package/react-dom) are also peer dependencies:

```json
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0 || ^19.0.0",
  "react-dom": "^17.0.0 || ^18.0.0 || ^19.0.0"
},
```

## Quickstart

Import the component that corresponds to the version you're using, along with the `GridRowsProp` and `GridColDef` utilities:

```js
// Pro and Premium users: add `-pro` or `-premium` suffix to package name
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
```

### Define rows

Each row in the Data Grid is an object with key-value pairs that correspond to the column and its value, respectively.
You should also provide an `id` property for delta updates and improved performance.

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

### Render the Data Grid

With the component and utilites imported, and rows and columns defined, you're now ready to render the Data Grid as shown below:

```tsx
import * as React from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

const rows: GridRowsProp = [
  { id: 1, name: 'Data Grid', description: 'the Community version' },
  { id: 2, name: 'Data Grid Pro', description: 'the Pro version' },
  { id: 3, name: 'Data Grid Premium', description: 'the Premium version' },
];

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Product Name', width: 200 },
  { field: 'description', headerName: 'Description', width: 300 },
];

export default function App() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
```

{{"demo": "Codesandbox.js", "hideToolbar": true, "bg": true}}

## TypeScript

In order to benefit from the [CSS overrides](/material-ui/customization/theme-components/#theme-style-overrides) and [default prop customization](/material-ui/customization/theme-components/#theme-default-props) with the theme, TypeScript users need to import the following types.
Internally, it uses module augmentation to extend the default theme structure.

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
