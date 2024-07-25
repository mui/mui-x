# Data Grid - Getting started

<p class="description">Get started with the last React data grid you will need. Install the package, configure the columns, provide rows, and you are set.</p>

## Installation

Using your favorite package manager, install `@mui/x-data-grid-pro` or `@mui/x-data-grid-premium` for the commercial version, or `@mui/x-data-grid` for the free community version.

<!-- #default-branch-switch -->

{{"component": "modules/components/DataGridInstallationInstructions.js"}}

The Data Grid package has a peer dependency on `@mui/material`.
If you are not already using it in your project, you can install it with:

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

Please note that [react](https://www.npmjs.com/package/react) and [react-dom](https://www.npmjs.com/package/react-dom) are peer dependencies too:

```json
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0",
  "react-dom": "^17.0.0 || ^18.0.0"
},
```

### Style engine

Material UI is using [Emotion](https://emotion.sh/docs/introduction) as a styling engine by default. If you want to use [`styled-components`](https://styled-components.com/) instead, run:

<codeblock storageKey="package-manager">

```bash npm
npm install @mui/styled-engine-sc styled-components
```

```bash pnpm
pnpm add @mui/styled-engine-sc styled-components
```

```bash yarn
yarn add @mui/styled-engine-sc styled-components
```

</codeblock>

:::info
Take a look at the [Styled Components guide](/material-ui/integrations/styled-components/) for more information about how to configure `styled-components` as the style engine.
:::

## Quickstart

First, you have to import the component as below.
To avoid name conflicts the component is named `DataGridPro` for the full-featured enterprise grid, and `DataGrid` for the free community version.

```js
import { DataGrid } from '@mui/x-data-grid';
```

### Define rows

Rows are key-value pair objects, mapping column names as keys with their values.
You should also provide an `id` property on each row to allow delta updates and better performance.

Here is an example

```js
const rows: GridRowsProp = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
];
```

### Define columns

Comparable to rows, columns are objects defined with a set of attributes of the `GridColDef` interface.
They are mapped to the rows through their `field` property.

```tsx
const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Column 1', width: 150 },
  { field: 'col2', headerName: 'Column 2', width: 150 },
];
```

You can import `GridColDef` to see all column properties.

### Demo

Putting it together, this is all you need to get started, as you can see in this live and interactive demo:

```tsx
import * as React from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

const rows: GridRowsProp = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
];

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Column 1', width: 150 },
  { field: 'col2', headerName: 'Column 2', width: 150 },
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
// When using TypeScript 4.x and above
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-data-grid-premium/themeAugmentation';

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

## Licenses

While MUI Core is entirely licensed under MIT, MUI X serves a part of its components under a commercial license.
Please pay attention to the license.

### Plans

The component comes [in different plans](https://mui.com/pricing/):

- **Community** Plan: [`@mui/x-data-grid`](https://www.npmjs.com/package/@mui/x-data-grid), published under the [MIT license](https://www.tldrlegal.com/license/mit-license) and [free forever](https://mui-org.notion.site/Stewardship-542a2226043d4f4a96dfb429d16cf5bd).
- **Pro** Plan: [`@mui/x-data-grid-pro`](https://www.npmjs.com/package/@mui/x-data-grid-pro) published under a [Commercial license](https://mui.com/legal/mui-x-eula/).
- **Premium** Plan: [`@mui/x-data-grid-premium`](https://www.npmjs.com/package/@mui/x-data-grid-premium) published under a [Commercial license](https://mui.com/legal/mui-x-eula/).

You can find more information about the plans in [the Licensing page](/x/introduction/licensing/).

### Feature comparison

The following table summarizes the features available in the community `DataGrid` and enterprise `DataGridPro` components.
All the features of the community version are available in the enterprise one.
The enterprise components come in two plans: Pro and Premium.

| Features                                                                               | Community | Pro [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan') | Premium [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') |
| :------------------------------------------------------------------------------------- | :-------: | :----------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------: |
| **Column**                                                                             |           |                                                                                      |                                                                                                      |
| [Column groups](/x/react-data-grid/column-groups/)                                     |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| [Column spanning](/x/react-data-grid/column-spanning/)                                 |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| [Column resizing](/x/react-data-grid/column-dimensions/#resizing)                      |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| [Column autosizing](/x/react-data-grid/column-dimensions/#autosizing)                  |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| [Column reorder](/x/react-data-grid/column-ordering/)                                  |    ❌     |                                          ✅                                          |                                                  ✅                                                  |
| [Column pinning](/x/react-data-grid/column-pinning/)                                   |    ❌     |                                          ✅                                          |                                                  ✅                                                  |
| **Row**                                                                                |           |                                                                                      |                                                                                                      |
| [Row height](/x/react-data-grid/row-height/)                                           |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| [Row spanning](/x/react-data-grid/row-spanning/)                                       |    🚧     |                                          🚧                                          |                                                  🚧                                                  |
| [Row reordering](/x/react-data-grid/row-ordering/)                                     |    ❌     |                                          ✅                                          |                                                  ✅                                                  |
| [Row pinning](/x/react-data-grid/row-pinning/)                                         |    ❌     |                                          ✅                                          |                                                  ✅                                                  |
| **Selection**                                                                          |           |                                                                                      |                                                                                                      |
| [Single row selection](/x/react-data-grid/row-selection/#single-row-selection)         |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| [Checkbox selection](/x/react-data-grid/row-selection/#checkbox-selection)             |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| [Multiple row selection](/x/react-data-grid/row-selection/#multiple-row-selection)     |    ❌     |                                          ✅                                          |                                                  ✅                                                  |
| [Cell range selection](/x/react-data-grid/cell-selection/)                             |    ❌     |                                          ❌                                          |                                                  ✅                                                  |
| **Filtering**                                                                          |           |                                                                                      |                                                                                                      |
| [Quick filter](/x/react-data-grid/filtering/quick-filter/)                             |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| [Column filters](/x/react-data-grid/filtering/#single-and-multi-filters)               |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| [Multi-column filtering](/x/react-data-grid/filtering/multi-filters/)                  |    ❌     |                                          ✅                                          |                                                  ✅                                                  |
| [Header filtering](/x/react-data-grid/filtering/header-filters/)                       |    ❌     |                                          ✅                                          |                                                  ✅                                                  |
| **Sorting**                                                                            |           |                                                                                      |                                                                                                      |
| [Column sorting](/x/react-data-grid/sorting/)                                          |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| [Multi-column sorting](/x/react-data-grid/sorting/#multi-sorting)                      |    ❌     |                                          ✅                                          |                                                  ✅                                                  |
| **Pagination**                                                                         |           |                                                                                      |                                                                                                      |
| [Pagination](/x/react-data-grid/pagination/)                                           |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| [Pagination > 100 rows per page](/x/react-data-grid/pagination/#size-of-the-page)      |    ❌     |                                          ✅                                          |                                                  ✅                                                  |
| **Editing**                                                                            |           |                                                                                      |                                                                                                      |
| [Row editing](/x/react-data-grid/editing/#row-editing)                                 |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| [Cell editing](/x/react-data-grid/editing/)                                            |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| **Import & export**                                                                    |           |                                                                                      |                                                                                                      |
| [CSV export](/x/react-data-grid/export/#csv-export)                                    |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| [Print](/x/react-data-grid/export/#print-export)                                       |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| [Clipboard copy](/x/react-data-grid/clipboard/#clipboard-copy)                         |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| [Clipboard paste](/x/react-data-grid/clipboard/#clipboard-paste)                       |    ❌     |                                          ❌                                          |                                                  ✅                                                  |
| [Excel export](/x/react-data-grid/export/#excel-export)                                |    ❌     |                                          ❌                                          |                                                  ✅                                                  |
| **Rendering**                                                                          |           |                                                                                      |                                                                                                      |
| [Customizable components](/x/react-data-grid/components/)                              |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| [Column virtualization](/x/react-data-grid/virtualization/#column-virtualization)      |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| [Row virtualization > 100 rows](/x/react-data-grid/virtualization/#row-virtualization) |    ❌     |                                          ✅                                          |                                                  ✅                                                  |
| **Group & Pivot**                                                                      |           |                                                                                      |                                                                                                      |
| [Tree data](/x/react-data-grid/tree-data/)                                             |    ❌     |                                          ✅                                          |                                                  ✅                                                  |
| [Master detail](/x/react-data-grid/master-detail/)                                     |    ❌     |                                          ✅                                          |                                                  ✅                                                  |
| [Row grouping](/x/react-data-grid/row-grouping/)                                       |    ❌     |                                          ❌                                          |                                                  ✅                                                  |
| [Aggregation](/x/react-data-grid/aggregation/)                                         |    ❌     |                                          ❌                                          |                                                  ✅                                                  |
| [Pivoting](/x/react-data-grid/pivoting/)                                               |    ❌     |                                          ❌                                          |                                                  🚧                                                  |
| **Misc**                                                                               |           |                                                                                      |                                                                                                      |
| [Accessibility](/x/react-data-grid/accessibility/)                                     |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| [Keyboard navigation](/x/react-data-grid/accessibility/#keyboard-navigation)           |    ✅     |                                          ✅                                          |                                                  ✅                                                  |
| [Localization](/x/react-data-grid/localization/)                                       |    ✅     |                                          ✅                                          |                                                  ✅                                                  |

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
