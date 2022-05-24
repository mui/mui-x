---
title: React Data Grid component
githubLabel: 'component: data grid'
packageName: '@mui/x-data-grid'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
---

# Data Grid

<p class="description">A fast and extendable react data table and react data grid. It's a feature-rich component available in MIT or Commercial versions.</p>

{{"component": "modules/components/ComponentLinkHeader.js"}}

The component leverages the power of React and TypeScript, to provide the best UX while manipulating an unlimited set of data. It comes with an intuitive API for real-time updates, accessibility, as well as theming and custom templates, all with blazing fast performance.

## Overview

> Visit the [installation guide](/x/react-data-grid/getting-started/#installation) to learn how to install the correct package version and dependencies.

Data tables display information in a grid-like format of rows and columns.
They organize information in a way that’s easy to scan so that users can look for patterns and insights.

The data grid comes in two different versions:

### MIT version

The first version is meant to simplify the [Table demo](/material-ui/react-table/#sorting-amp-selecting) with a clean abstraction.
This abstraction also set constraints that allow the component to implement new features.

```js
import { DataGrid } from '@mui/x-data-grid';
```

{{"demo": "DataGridDemo.js", "defaultCodeOpen": false, "bg": "inline"}}

### Commercial version

The commercial version is available in the form of two plans: Pro and Premium.

#### Pro Plan [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

The Pro version extends the features available in the MIT version, by allowing to sort and filter multiple columns at the same time.
It also brings new features, e.g. column groups, column pinning, tree data, row and column reordering, etc.
Finally, the Pro version leverages virtualization to handle bigger datasets.
The following grid displays 31 columns and 100,000 rows - over 3 million cells in total.

```js
import { DataGridPro } from '@mui/x-data-grid-pro';
```

{{"demo": "DataGridProDemo.js", "defaultCodeOpen": false, "disableAd": true, "bg": "inline"}}

#### Premium Plan [<span class="plan-premium"></span>](https://mui.com/store/items/mui-x-premium/)

The Premium version contains all features from Pro, as well as features for analyzing large datasets.
The features available on the initial release are row grouping and the ability to export to Excel files.
Aggregation is coming right next.
In the following demo, the rows are grouped by commodity name, but you can experiment grouping other columns in the column menu.
And since you're here, you may want to export the different views of your data to an Excel file.

```js
import { DataGridPremium } from '@mui/x-data-grid-premium';
```

{{"demo": "DataGridPremiumDemo.js", "defaultCodeOpen": false, "disableAd": true, "bg": "inline"}}

### MIT vs. commercial

> Please check the [Licenses section](/x/advanced-components/#licenses) for more details between the different versions.

## Features

- Built with and exclusively for React ⚛️
- High performance 🚀
- [Filtering](/x/react-data-grid/filtering/) and [multi-filtering](/x/react-data-grid/filtering/#multi-filtering) <span class="plan-pro"></span>
- [Pagination](/x/react-data-grid/pagination/)
- [Row & Cell editing](/x/react-data-grid/editing/)
- [Sorting](/x/react-data-grid/sorting/) and [multi-sorting](/x/react-data-grid/sorting/#multi-sorting) <span class="plan-pro"></span>
- [Selection](/x/react-data-grid/selection/)
- [Column virtualization](/x/react-data-grid/virtualization/#column-virtualization) and [rows virtualization](/x/react-data-grid/virtualization/#row-virtualization) <span class="plan-pro"></span>
- [Row grouping](/x/react-data-grid/row-grouping/) <span class="plan-premium"></span>
- [Excel export](/x/react-data-grid/export/#excel-export) <span class="plan-premium"></span>
- [Tree data](/x/react-data-grid/tree-data/) <span class="plan-pro"></span>
- [Master detail](/x/react-data-grid/master-detail/) <span class="plan-pro"></span>
- [Resizable columns](/x/react-data-grid/column-dimensions/#resizing) <span class="plan-pro"></span>
- [100% customizable](/x/react-data-grid/style/)
- Server-side data
- [Column hiding](/x/react-data-grid/column-visibility/)
- [Column pinning](/x/react-data-grid/column-pinning/) <span class="plan-pro"></span>
- [Accessible](/x/react-data-grid/accessibility/)
- [Localization](/x/react-data-grid/localization/)

### 🚧 Upcoming features

While development of the data grid component is moving fast, there are still many additional features that we plan to implement. Some of them:

- Headless (hooks only)
- [Range selection](/x/react-data-grid/selection/#range-selection) <span class="plan-premium"></span>
- [Aggregation](/x/react-data-grid/aggregation/) <span class="plan-premium"></span>
- [Pivoting](/x/react-data-grid/pivoting/) <span class="plan-premium"></span>

You can find more details on, the [feature comparison](/x/react-data-grid/getting-started/#feature-comparison), our living quarterly [roadmap](https://github.com/mui/mui-x/projects/1) as well as on the open [GitHub issues](https://github.com/mui/mui-x/issues?q=is%3Aopen+label%3A%22component%3A+DataGrid%22+label%3Aenhancement).

## Resources

Here are some resources you might be interested in to learn more about the grid:

- The storybook used for [internal development](https://material-ui-x.netlify.app/storybook/)
- The [source on GitHub](https://github.com/mui/mui-x/tree/master/packages/)
- The [Material Design specification](https://material.io/components/data-tables) specification
- The accessibility [WAI-ARIA authoring practices](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- The [Sketch](https://mui.com/store/items/sketch-react/) and [Figma](https://mui.com/store/items/figma-react/) design assets

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
