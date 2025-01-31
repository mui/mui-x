---
title: React Data Grid component
githubLabel: 'component: data grid'
packageName: '@mui/x-data-grid'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
---

# MUI X Data Grid

<p class="description">A fast and extensible React data table and React data grid, with filtering, sorting, aggregation, and more.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

## Overview

The MUI X Data Grid is a TypeScript-based React component that presents information in a structured format of rows and columns.
It provides developers with an intuitive API for implementing complex use cases; and end users with a smooth experience for manipulating an unlimited set of data.

The Grid's theming features are designed to be frictionless when integrating with Material UI and other MUI X components, but it can also stand on its own and be customized to meet the needs of any design system.

The Data Grid is **open-core**: The Community version is MIT-licensed and free forever, while more advanced features require a Pro or Premium commercial license.
See [MUI X Licensing](/x/introduction/licensing/) for complete details.

## Community version (free forever)

```js
import { DataGrid } from '@mui/x-data-grid';
```

The MIT-licensed Community version of the Data Grid is a more sophisticated implementation of the [Material UI Table](/material-ui/react-table/).

It includes all of the main features listed in the navigation menu, such as editing, sorting, filtering, and pagination, as shown in the demo below:

{{"demo": "DataGridDemo.js", "defaultCodeOpen": false, "bg": "inline"}}

## Pro version [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

```js
import { DataGridPro } from '@mui/x-data-grid-pro';
```

The Pro plan expands on the Community version to support more complex use cases with features like advanced filtering, column pinning, column and row reordering, support for tree data, and virtualization to handle larger datasets.
Pro features are denoted by the blue cube icon (<span class="plan-pro"></span>) throughout the documentation.

The demo below displays 31 columns and 100,000 rows—over three million cells in total:

{{"demo": "DataGridProDemo.js", "defaultCodeOpen": false, "disableAd": true, "bg": "inline"}}

## Premium version [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

```js
import { DataGridPremium } from '@mui/x-data-grid-premium';
```

The Premium plan includes all Pro features as well as more advanced features for data analysis and large dataset management, such as row grouping with aggregation functions (like sum and average) and the ability to export to Excel files.
Premium features are denoted by the golden cube icon (<span class="plan-premium"></span>) throughout the documentation.

The demo below groups rows by commodity name, and uses an aggregation function to calculate the sum of quantities for each group and in total (displayed in a summary row).
You can experiment with grouping other columns in the column header menus.
You can also try exporting to Excel, and copying and pasting data to and from Excel tables.

{{"demo": "DataGridPremiumDemo.js", "defaultCodeOpen": false, "disableAd": true, "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
