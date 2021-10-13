---
title: Data Grid - Getting started
---

# Data Grid - Getting started

<p class="description">Get started with the last React data grid you will need. Install the package, configure the columns, provide rows and you are set.</p>

## Installation

Using your favorite package manager, install `@mui/x-data-grid-pro` for the full-featured enterprise grid, or `@mui/x-data-grid` for the free community version.

```sh
// with npm
npm install @mui/x-data-grid@next

// with yarn
yarn add @mui/x-data-grid@next
```

The grid has two peer dependencies on MUI components.
If you are not already using MUI in your project, you can install it with:

```sh
// with npm
npm install @mui/material @mui/styles

// with yarn
yarn add @mui/material @mui/styles
```

## Quick start

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
They are mapped to rows through their `field` property.

```tsx
const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Column 1', width: 150 },
  { field: 'col2', headerName: 'Column 2', width: 150 },
];
```

You can import `GridColDef` to see all column properties.

### Demo

Putting it together, this all you need to get started, as you can see in this live and interactive demo:

```jsx
import React from 'react';
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

{{"demo": "pages/components/data-grid/getting-started/Codesandbox.js", "hideToolbar": true, "bg": true}}

## TypeScript

In order to benefit from the [CSS overrides](/customization/theme-components/#global-style-overrides) and [default prop customization](/customization/theme-components/#default-props) with the theme, TypeScript users need to import the following types.
Internally, it uses module augmentation to extend the default theme structure.

```tsx
// When using TypeScript 4.x and above
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';

const theme = createTheme({
  components: {
    // Use `MuiDataGrid` on both DataGrid and DataGridPro
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

The data grid comes with two different licenses:

- [DataGrid](https://mui.com/api/data-grid/data-grid/), it's [MIT licensed](https://tldrlegal.com/license/mit-license) and available on npm as `@mui/x-data-grid`.
- [DataGridPro](https://mui.com/api/data-grid/data-grid-pro/), it's **Commercially licensed** and available on npm as `@mui/x-data-grid-pro`.
  The features only available in the commercial version are suffixed with a <span class="pro"></span> icon for the Pro plan or a <span class="premium"></span> icon for the Premium plan.

  <img src="/static/x/header-icon.png" style="width: 431px; height: 123px; object-fit: contain; margin-bottom: 2rem;" alt="" loading="lazy">

  You can check the [feature comparison](#feature-comparison) for more details.
  See [Pricing](https://mui.com/store/items/material-ui-pro/) for details on purchasing licenses.

### Try DataGridPro for free

You are free to install and try `DataGridPro` as long as it is not used for development of a feature intended for production.
Please take the component for a test run, no need to contact us.

### Invalid license

If you have an enterprise grid running with an expired or missing license key, the grid displays a watermark, and a warning is shown in the console (_MUI Unlicensed product_).

<img src="/static/x/watermark.png" style="width: 658px; height: 175px; object-fit: contain; margin-bottom: 3rem" alt="" loading="lazy">

### Feature comparison

The following table summarizes the features available in the community `DataGrid` and enterprise `DataGridPro` components.
All the features of the community version are available in the enterprise one.
The enterprise components come in two plans: Pro and Premium.

| Features                                                                                  | Community | Pro <span class="pro"></span> | Premium <span class="premium"></span> |
| :---------------------------------------------------------------------------------------- | :-------: | :---------------------------: | :-----------------------------------: |
| **Column**                                                                                |           |                               |
| [Column groups](/components/data-grid/columns/#column-groups)                             |    🚧     |              🚧               |                  🚧                   |
| [Column spanning](/components/data-grid/columns/#column-spanning)                         |    🚧     |              🚧               |                  🚧                   |
| [Column resizing](/components/data-grid/columns/#column-resizing)                         |    ❌     |              ✅               |                  ✅                   |
| [Column reorder](/components/data-grid/columns/#column-reorder)                           |    ❌     |              ✅               |                  ✅                   |
| [Column pinning](/components/data-grid/columns/#column-pinning)                           |    ❌     |              🚧               |                  🚧                   |
| **Row**                                                                                   |           |                               |                                       |
| [Row sorting](/components/data-grid/rows/#row-sorting)                                    |    ✅     |              ✅               |                  ✅                   |
| [Row height](/components/data-grid/rows/#row-height)                                      |    ✅     |              ✅               |                  ✅                   |
| [Row spanning](/components/data-grid/rows/#row-spanning)                                  |    🚧     |              🚧               |                  🚧                   |
| [Row reordering](/components/data-grid/rows/#row-reorder)                                 |    ❌     |              🚧               |                  🚧                   |
| **Selection**                                                                             |           |                               |                                       |
| [Single row selection](/components/data-grid/selection/#single-row-selection)             |    ✅     |              ✅               |                  ✅                   |
| [Checkbox selection](/components/data-grid/selection/#checkbox-selection)                 |    ✅     |              ✅               |                  ✅                   |
| [Multiple row selection](/components/data-grid/selection/#multiple-row-selection)         |    ❌     |              ✅               |                  ✅                   |
| [Cell range selection](/components/data-grid/selection/#range-selection)                  |    ❌     |              ❌               |                  🚧                   |
| **Filtering**                                                                             |           |                               |                                       |
| [Quick filter](/components/data-grid/filtering/#quick-filter)                             |    🚧     |              🚧               |                  🚧                   |
| [Column filters](/components/data-grid/filtering/#column-filters)                         |    ✅     |              ✅               |                  ✅                   |
| [Multi-column filtering](/components/data-grid/filtering/#multi-column-filtering)         |    ❌     |              ✅               |                  ✅                   |
| **Pagination**                                                                            |           |                               |                                       |
| [Pagination](/components/data-grid/pagination/)                                           |    ✅     |              ✅               |                  ✅                   |
| [Pagination > 100 rows per page](/components/data-grid/pagination/#paginate-gt-100-rows)  |    ❌     |              ✅               |                  ✅                   |
| **Editing**                                                                               |           |                               |                                       |
| [Row editing](/components/data-grid/editing/#row-editing)                                 |    ✅     |              ✅               |                  ✅                   |
| [Cell editing](/components/data-grid/editing/#cell-editing)                               |    ✅     |              ✅               |                  ✅                   |
| **Import & export**                                                                       |           |                               |                                       |
| [CSV export](/components/data-grid/export/#csv-export)                                    |    ✅     |              ✅               |                  ✅                   |
| [Print](/components/data-grid/export/#print)                                              |    ✅     |              ✅               |                  ✅                   |
| [Clipboard](/components/data-grid/export/#clipboard)                                      |    ❌     |              🚧               |                  🚧                   |
| [Excel export](/components/data-grid/export/#excel-export)                                |    ❌     |              ❌               |                  🚧                   |
| **Rendering**                                                                             |           |                               |                                       |
| [Customizable components](/components/data-grid/components/)                              |    ✅     |              ✅               |                  ✅                   |
| [Column virtualization](/components/data-grid/virtualization/#column-virtualization)      |    ✅     |              ✅               |                  ✅                   |
| [Row virtualization > 100 rows](/components/data-grid/virtualization/#row-virtualization) |    ❌     |              ✅               |                  ✅                   |
| **Group & Pivot**                                                                         |           |                               |                                       |
| [Tree data](/components/data-grid/group-pivot/#tree-data)                                 |    ❌     |              ✅               |                  ✅                   |
| [Master detail](/components/data-grid/group-pivot/#master-detail)                         |    ❌     |              🚧               |                  🚧                   |
| [Grouping](/components/data-grid/group-pivot/#grouping)                                   |    ❌     |              ❌               |                  🚧                   |
| [Aggregation](/components/data-grid/group-pivot/#aggregation)                             |    ❌     |              ❌               |                  🚧                   |
| [Pivoting](/components/data-grid/group-pivot/#pivoting)                                   |    ❌     |              ❌               |                  🚧                   |
| **Misc**                                                                                  |           |                               |                                       |
| [Accessibility](/components/data-grid/accessibility/)                                     |    ✅     |              ✅               |                  ✅                   |
| [Keyboard navigation](/components/data-grid/accessibility/#keyboard-navigation)           |    ✅     |              ✅               |                  ✅                   |
| [Localization](/components/data-grid/localization/)                                       |    ✅     |              ✅               |                  ✅                   |

### License key installation

Once you purchase a license, you'll receive a license key.
This key should be provided to the enterprise package to remove the watermark and
the warnings in the console.

```jsx
import { LicenseInfo } from '@mui/x-data-grid-pro';

LicenseInfo.setLicenseKey(
  'x0jTPl0USVkVZV0SsMjM1kDNyADM5cjM2ETPZJVSQhVRsIDN0YTM6IVREJ1T0b9586ef25c9853decfa7709eee27a1e',
);
```

The grid checks the key without making any network requests.

#### What's the expiration policy?

The licenses are perpetual, the license key will work forever.
However, access to updates is not.
If you install a new version of the component for which the license key has expired, you will trigger a [watermark and console message](#invalid-license).
For instance, if you have a one-year license (default), you are not licensed to install a version that is two years in the future.

## Support

For crowdsourced technical questions from expert MUI devs in our community. Also frequented by the MUI Core team.

[Post a question](https://stackoverflow.com/questions/tagged/material-ui)

### GitHub <img src="/static/images/logos/github.svg" width="24" height="24" alt="GitHub logo" loading="lazy" />

We use GitHub issues exclusively as a bug and feature request tracker. If you think you have found a bug, or have a new feature idea, please start by making sure it hasn't already been [reported or fixed](https://github.com/mui-org/material-ui-x/issues?utf8=%E2%9C%93&q=is%3Aopen+is%3Aclosed). You can search through existing issues and pull requests to see if someone has reported one similar to yours.

[Open an issue](https://github.com/mui-org/material-ui-x/issues/new/choose)

### StackOverflow <img src="/static/images/logos/stackoverflow.svg" width="24" height="24" alt="StackOverflow logo" loading="lazy" />

For crowdsourced technical questions from expert MUI devs in our community. Also frequented by the MUI Core team.

[Post a question](https://stackoverflow.com/questions/tagged/material-ui)

### Enterprise support

We provide a [private support channel](https://material-ui.zendesk.com/) for enterprise customers.

## Roadmap

Here is [the public roadmap](https://github.com/mui-org/material-ui-x/projects/1). It's organized by quarter.

> ⚠️ **Disclaimer**: We operate in a dynamic environment, and things are subject to change. The information provided is intended to outline the general framework direction, for informational purposes only. We may decide to add or remove new items at any time, depending on our capability to deliver while meeting our quality standards. The development, releases, and timing of any features or functionality remains at the sole discretion of MUI. The roadmap does not represent a commitment, obligation, or promise to deliver at any time.

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
