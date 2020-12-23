---
title: Data Grid - Getting started
components: DataGrid, XGrid
---

# Data Grid - Getting started

<p class="description">Get started with the last React data grid you will need. Install the package, configure the columns, provide rows and you are set.</p>

## Installation

Using your favorite package manager, install `@material-ui/x-grid` for the full-featured enterprise grid, or `@material-ui/data-grid` for the free community version.

```sh
// with npm
npm install @material-ui/data-grid

// with yarn
yarn add @material-ui/data-grid
```

The grid has a peer dependency on Material-UI core components. If you are not already using Material-UI in your project, you can install it with:

```sh
// with npm
npm install @material-ui/core

// with yarn
yarn add @material-ui/core
```

## Quick start

First, you have to import the component as below.
To avoid name conflicts the component is named `XGrid` for the full-featured enterprise grid, and `DataGrid` for the free community version.

```js
import { DataGrid } from '@material-ui/data-grid';
```

### Define rows

Rows are key-value pair objects, mapping column names as keys with their values.
You should also provide an id on each row to allow delta updates and better performance.

Here is an example

```js
const rows: RowsProp = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'XGrid', col2: 'is Awesome' },
  { id: 3, col1: 'Material-UI', col2: 'is Amazing' },
];
```

### Define columns

Comparable to rows, columns are objects defined with a set of attributes of the `ColDef` interface.
They are mapped to rows through their `field` property.

```tsx
const columns: ColDef[] = [
  { field: 'col1', headerName: 'Column 1', width: 150 },
  { field: 'col2', headerName: 'Column 2', width: 150 },
];
```

You can import `ColDef` to see all column properties.

### Demo

Putting it together, this all you need to get started, as you can see in this live and interactive demo:

```jsx
import React from 'react';
import { DataGrid, RowsProp, ColDef } from '@material-ui/data-grid';

const rows: RowsProp = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'XGrid', col2: 'is Awesome' },
  { id: 3, col1: 'Material-UI', col2: 'is Amazing' },
];

const columns: ColDef[] = [
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

## Enterprise [<span role="img" title="Enterprise">⚡️</span>](https://material-ui.com/store/items/material-ui-x/)

The data grid comes in 2 versions:

- `DataGrid` **MIT licensed** as part of the community edition. It's an extension of `@material-ui/core`.
- `XGrid` **Commercially licensed** as part of the X product line offering.

The features only available in the commercial version are suffixed with a <span style="font-size: 26px" role="img" title="Enterprise">⚡️</span> icon.

<img src="/static/x/header-icon.png" style="width: 454px; margin-bottom: 2rem;" alt="">

You can check the [feature comparison](#feature-comparison) for more details.
See [Pricing](https://material-ui.com/store/items/material-ui-x/) for details on purchasing licenses.

### Try XGrid for free

You are free to try out `XGrid` as long as it's not used for a project intended for production.
Please take the component for a test run, no need to contact us.

### Invalid license

If you have an enterprise grid running with an expired or missing license key, the grid displays a watermark, and a warning is shown in the console (_Material-UI Unlicensed product_).

<img src="/static/x/watermark.png" style="width: 658px; margin-bottom: 3rem" alt="">

### Feature comparison

The following table summarizes the features available in the community `DataGrid` and enterprise `XGrid` components. All the features of the community version are available in the enterprise one.

| Features                                                                                | Community | Enterprise ⚡️ |
| :-------------------------------------------------------------------------------------- | --------- | -------------- |
| **Column**                                                                              |           |                |
| [Column resizing](/components/data-grid/columns/#column-resizing)                       | ❌        | ✅             |
| [Column groups](/components/data-grid/columns/#column-groups)                           | 🚧        | 🚧             |
| [Column reorder](/components/data-grid/columns/#column-reorder)                         | ❌        | ✅             |
| [Column pinning](/components/data-grid/columns/#column-pinning)                         | ❌        | 🚧             |
| [Column spanning](/components/data-grid/columns/#column-spanning)                       | 🚧        | 🚧             |
| **Rows**                                                                                |           |                |
| [Rows sorting](/components/data-grid/rows/#row-sorting)                                 | ✅        | ✅             |
| [Rows height](/components/data-grid/rows/#row-height)                                   | ✅        | ✅             |
| [Rows spanning](/components/data-grid/rows/#row-spanning)                               | 🚧        | 🚧             |
| [Rows reorder](/components/data-grid/rows/#row-reorder)                                 | ❌        | 🚧             |
| **Selection**                                                                           |           |                |
| [Row selection](/components/data-grid/selection/#single-row-selection)                  | ✅        | ✅             |
| [Multi-row selection](/components/data-grid/selection/#multiple-row-selection)          | ❌        | ✅             |
| [Range selection](/components/data-grid/selection/#range-selection)                     | ❌        | 🚧             |
| **Filtering**                                                                           |           |                |
| [Column filters](/components/data-grid/filtering/#column-filters)                       | ✅        | ✅             |
| [Multi-column filtering](/components/data-grid/filtering/#multi-column-filtering)       | ❌        | ✅             |
| [Quick filter](/components/data-grid/filtering/#quick-filter)                           | 🚧        | 🚧             |
| **Pagination**                                                                          |           |                |
| [Pagination](/components/data-grid/pagination/)                                         | ✅        | ✅             |
| [Pagination > 100 rows per page](/components/data-grid/pagination/)                     | ❌        | ✅             |
| **Editing**                                                                             |           |                |
| [Row edition](/components/data-grid/editing/#row-editing)                               | 🚧        | 🚧             |
| [Cell editing](/components/data-grid/editing/#cell-editing)                             | 🚧        | 🚧             |
| **Import & export**                                                                     |           |                |
| [CSV export](/components/data-grid/export/#csv-export)                                  | 🚧        | 🚧             |
| [Print](/components/data-grid/export/#print)                                            | 🚧        | 🚧             |
| [Excel export](/components/data-grid/export/#excel-export)                              | ❌        | 🚧             |
| [Clipboard](/components/data-grid/export/#clipboard)                                    | ❌        | 🚧             |
| **Rendering**                                                                           |           |                |
| [Column virtualization](/components/data-grid/rendering/#column-virtualization)         | ✅        | ✅             |
| [Row virtualization > 100 rows](/components/data-grid/rendering/#column-virtualization) | ❌        | ✅             |
| [Components](/components/data-grid/rendering/#components)                               | ✅        | ✅             |
| **Group & Pivot**                                                                       |           |                |
| [Tree data](/components/data-grid/group-pivot/#tree-data)                               | ❌        | 🚧             |
| [Master detail](/components/data-grid/group-pivot/#master-detail)                       | ❌        | 🚧             |
| [Grouping](/components/data-grid/group-pivot/#grouping)                                 | ❌        | 🚧             |
| [Aggregation](/components/data-grid/group-pivot/#aggregation)                           | ❌        | 🚧             |
| [Pivoting](/components/data-grid/group-pivot/#pivoting)                                 | ❌        | 🚧             |
| **Misc**                                                                                |           |                |
| [Accessibility](/components/data-grid/accessibility/)                                   | ✅        | ✅             |
| [Keyboard navigation](/components/data-grid/accessibility/#keyboard-navigation)         | ✅        | ✅             |
| [Localization](/components/data-grid/localization/)                                     | ✅        | ✅             |

### License key installation

Once you purchase a license, you'll receive a license key.
This key should be provided to the enterprise package to remove the watermark and
the warnings in the console.

```jsx
import { LicenseInfo } from '@material-ui/x-grid';

LicenseInfo.setLicenseKey(
  'x0jTPl0USVkVZV0SsMjM1kDNyADM5cjM2ETPZJVSQhVRsIDN0YTM6IVREJ1T0b9586ef25c9853decfa7709eee27a1e',
);
```

The grid checks the key without making any network requests.

## Support

For crowdsourced technical questions from expert Material-UI devs in our community. Also frequented by the Material-UI core team.

[Post a question](https://stackoverflow.com/questions/tagged/material-ui)

### GitHub <img src="/static/images/logos/github.svg" width="24" height="24" alt="GitHub logo" loading="lazy" />

We use GitHub issues exclusively as a bug and feature request tracker. If you think you have found a bug, or have a new feature idea, please start by making sure it hasn't already been [reported or fixed](https://github.com/mui-org/material-ui-x/issues?utf8=%E2%9C%93&q=is%3Aopen+is%3Aclosed). You can search through existing issues and pull requests to see if someone has reported one similar to yours.

[Open an issue](https://github.com/mui-org/material-ui-x/issues/new/choose)

### StackOverflow <img src="/static/images/logos/stackoverflow.svg" width="24" height="24" alt="StackOverflow logo" loading="lazy" />

For crowdsourced technical questions from expert Material-UI devs in our community. Also frequented by the Material-UI core team.

[Post a question](https://stackoverflow.com/questions/tagged/material-ui)

### Enterprise support

We provide a [private support channel](https://material-ui.zendesk.com/) for enterprise customers.

## Roadmap

Here is [the public roadmap](https://github.com/mui-org/material-ui-x/projects/1). It's organized by quarter.

> ⚠️ **Disclaimer**: We operate in a dynamic environment, and things are subject to change. The information provided is intended to outline the general framework direction, for informational purposes only. We may decide to add or remove new items at any time, depending on our capability to deliver while meeting our quality standards. The development, releases, and timing of any features or functionality remains at the sole discretion of Material-UI. The roadmap does not represent a commitment, obligation, or promise to deliver at any time.
