---
title: Data Grid React component
components: DataGrid, XGrid
---

# Data Grid

<p class="description">A fast and extendable data table and data grid for React. It's a feature-rich component available in MIT or Commercial versions.</p>

Data tables display information in a grid-like format of rows and columns. They organize information in a way that’s easy to scan, so that users can look for patterns and insights.

The component leverages the power of React and TypeScript, to provide the best UX, while manipulating an unlimited set of data. It comes with an intuitive API for real-time updates, accessibility, as well as theming and custom templates, all with blazing fast performance.

## Overview

The data grid comes in 2 versions:

- `DataGrid` **MIT licensed** as part of the community edition. It's an extension of `@material-ui/core`.
- `XGrid` **Commercially licensed** as part of the X product line offering.
  The features only available in the commercial version are suffixed with a ⚡️ icon.

### MIT version

The first version is meant to simplify the [Table demo](https://material-ui.com/components/tables/#sorting-amp-selecting) with a clean abstraction.
This abstraction also set constraints that allow the component to implement new features.

```js
import { DataGrid } from '@material-ui/data-grid';
```

{{"demo": "pages/components/data-grid/overview/DataGridDemo.js", "defaultCodeOpen": false}}

### Commercial version ⚡️

The following grid displays 31 columns and 100,000 rows - over 3 million cells in total.

```js
import { XGrid } from '@material-ui/x-grid';
```

{{"demo": "pages/components/data-grid/overview/XGridDemo.js", "defaultCodeOpen": false}}

## Features

- Built with and exclusively for React ⚛️
- High performance 🚀
- Lightweight; less than [30 kB](https://bundlephobia.com/result?p=@material-ui/x-grid) gzipped with as few dependencies as possible.
- [Pagination](/components/data-grid/pagination/)
- [Sorting](/components/data-grid/rows/#row-sorting) and [multi-sort](/components/data-grid/rows/#multi-column-sorting) ⚡️
- [Selection](/components/data-grid/selection/)
- Rows and column virtualization ⚡️
- [Resizable columns](/components/data-grid/columns/)
- 100% customizable
- Server side data
- Column hiding
- [Accessible](/components/data-grid/accessibility/)

## 🚧 Upcoming features

Work in progress in the roadmap:

- [Filtering](/components/data-grid/filtering/)
- [Cell editing](/components/data-grid/editing/)
- Headless
- [Localization](/components/data-grid/localization/)
- [Group & Pivot](/components/data-grid/group-pivot/) ⚡️
- [Export](/components/data-grid/export/)
- and [many more features](https://github.com/mui-org/material-ui-x/issues?q=is%3Aopen+label%3A%22component%3A+DataGrid%22+label%3Aenhancement)
