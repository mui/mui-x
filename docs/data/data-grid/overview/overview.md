---
title: React Data Grid component
githubLabel: 'component: data grid'
packageName: '@mui/x-data-grid'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
---

# Data Grid

<p class="description">A fast and extendable react data table and react data grid. It's a feature-rich component available in MIT or Commercial versions.</p>

The component leverages the power of React and TypeScript, to provide the best UX while manipulating an unlimited set of data. It comes with an intuitive API for real-time updates, accessibility, as well as theming and custom templates, all with blazing fast performance.

{{"component": "modules/components/ComponentLinkHeader.js"}}

## Overview

:::info
Visit the [installation guide](/x/react-data-grid/getting-started/#installation) to learn how to install the correct package version and dependencies.
:::

The `DataGrid` presents information in a structured format of rows and columns. The data is displayed in a user-friendly, quick-to-scan and interactive way, enabling users to efficiently identify patterns, edit data, and gather insights.

The component comes in three different versions. One available under MIT license and two available under commercial license.

### MIT version (Free forever)

The first version is meant as a stronger alternative to [data tables](/material-ui/react-table/#sorting-amp-selecting). It's a clean abstraction with basic features like editing, pagination, sorting and filtering single columns, and column groups.

```js
import { DataGrid } from '@mui/x-data-grid';
```

{{"demo": "DataGridDemo.js", "defaultCodeOpen": false, "bg": "inline"}}

### Commercial versions

The commercial versions are available in the form of two plans: Pro and Premium.

#### Pro Plan [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

The Pro version includes and extends the features available in the MIT version to support more complex use cases. It adds new features like advanced filtering, column pinning, column and row reordering, support for tree data, and virtualization to handle bigger datasets.

The following grid displays 31 columns and 100,000 rows - over 3 million cells in total.

```js
import { DataGridPro } from '@mui/x-data-grid-pro';
```

{{"demo": "DataGridProDemo.js", "defaultCodeOpen": false, "disableAd": true, "bg": "inline"}}

#### Premium Plan [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan)

The Premium version includes everything from Pro, as well as advanced features for data analysis and large datasets management, like row grouping with aggregation functions (e.g., Sum) and the ability to export to Excel files.

You can visit the [showcase page](/x/react-data-grid/demo/) for a comprehensible overview of all features exclusive to this plan.

The demo below groups rows by commodity name, and uses an aggregation function to calculate the sum of quantities for each group and in total (displayed on a summary row). You can experiment with grouping other columns in the columns' header menus.

And since you're here, try exporting to Excel and copying and pasting data from-to Excel tables.

```js
import { DataGridPremium } from '@mui/x-data-grid-premium';
```

{{"demo": "DataGridPremiumDemo.js", "defaultCodeOpen": false, "disableAd": true, "bg": "inline"}}

### MIT vs. commercial

Please see [the Licensing page](/x/introduction/licensing/) for details.

## Features

- Built with and exclusively for React ⚛️
- High performance 🚀
- [Column groups](/x/react-data-grid/column-groups/)
- [Filtering](/x/react-data-grid/filtering/), [multi-filters](/x/react-data-grid/filtering/multi-filters/) <span class="plan-pro"></span>, and [header filters](/x/react-data-grid/filtering/header-filters/) <span class="plan-pro"></span>
- [Pagination](/x/react-data-grid/pagination/)
- [Row & Cell editing](/x/react-data-grid/editing/)
- [Sorting](/x/react-data-grid/sorting/) and [multi-sorting](/x/react-data-grid/sorting/#multi-sorting) <span class="plan-pro"></span>
- [Row selection](/x/react-data-grid/row-selection/)
- [Cell selection](/x/react-data-grid/cell-selection/) <span class="plan-premium"></span>
- [Column virtualization](/x/react-data-grid/virtualization/#column-virtualization) and [rows virtualization](/x/react-data-grid/virtualization/#row-virtualization) <span class="plan-pro"></span>
- [Row grouping](/x/react-data-grid/row-grouping/) <span class="plan-premium"></span>
- [Aggregation](/x/react-data-grid/aggregation/) <span class="plan-premium"></span>
- [Excel export](/x/react-data-grid/export/#excel-export) <span class="plan-premium"></span>
- [Tree data](/x/react-data-grid/tree-data/) <span class="plan-pro"></span>
- [Master detail](/x/react-data-grid/master-detail/) <span class="plan-pro"></span>
- [Resizable columns](/x/react-data-grid/column-dimensions/#resizing) <span class="plan-pro"></span>
- [100% customizable](/x/react-data-grid/style/)
- Server-side data
- [Column hiding](/x/react-data-grid/column-visibility/)
- [Column pinning](/x/react-data-grid/column-pinning/) <span class="plan-pro"></span>
- [Row pinning](/x/react-data-grid/row-pinning/) <span class="plan-pro"></span>
- [Accessible](/x/react-data-grid/accessibility/)
- [Localization](/x/react-data-grid/localization/)

### Upcoming features 🚧

While development of the data grid component is moving fast, there are still many additional features that we plan to implement. Some of them:

- Headless (hooks only)
- [Pivoting](/x/react-data-grid/pivoting/) <span class="plan-premium"></span>
- [Charts integration](/x/react-charts/) <span class="plan-premium"></span>

You can find more details on, the [feature comparison](/x/react-data-grid/getting-started/#feature-comparison), our living quarterly [roadmap](https://github.com/mui/mui-x/projects/1) as well as on the open [GitHub issues](https://github.com/mui/mui-x/issues?q=is%3Aopen+label%3A%22component%3A+DataGrid%22+label%3Aenhancement).

## Resources

Here are some resources you might be interested in to learn more about the data grid:

<!-- #default-branch-switch -->

- The [source on GitHub](https://github.com/mui/mui-x/tree/master/packages/)
- The [Material Design specification](https://m2.material.io/components/data-tables) specification
- The accessibility [WAI-ARIA authoring practices](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- The Figma, Adobe XD, and Sketch [design kits](https://mui.com/design-kits/).

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
