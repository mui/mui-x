---
title: Data Grid React component
components: DataGrid, XGrid
---

# Data Grid

<p class="description">A fast and extendable data table and data grid for React. It's a feature-rich component available in MIT or Commercial versions.</p>

The component leverages the power of React and TypeScript, to provide the best UX, while manipulating an unlimited set of data. It comes with an intuitive API for real-time updates, accessibility, as well as theming and custom templates, all with blazing fast performance.

## Overview

Data tables display information in a grid-like format of rows and columns. They organize information in a way that’s easy to scan, so that users can look for patterns and insights. The data grid comes in 2 versions:

- `DataGrid` **MIT licensed** as part of the community edition. It's an extension of `@material-ui/core`.
- `XGrid` **Commercially licensed** as part of the X product line offering.

The features only available in the commercial version are suffixed with a <span style="font-size: 26px" role="img" title="Enterprise">⚡️</span> icon.
You can check the [feature comparison](/components/data-grid/getting-started/#feature-comparison) for more details.
See [Pricing](https://material-ui.com/store/items/material-ui-x/) for details on purchasing licenses.

### MIT version

The first version is meant to simplify the [Table demo](https://material-ui.com/components/tables/#sorting-amp-selecting) with a clean abstraction.
This abstraction also set constraints that allow the component to implement new features.

```js
import { DataGrid } from '@material-ui/data-grid';
```

{{"demo": "pages/components/data-grid/overview/DataGridDemo.js", "defaultCodeOpen": false}}

### Commercial version [<span role="img" title="Enterprise">⚡️</span>](https://material-ui.com/store/items/material-ui-x/)

The following grid displays 31 columns and 100,000 rows - over 3 million cells in total.

```js
import { XGrid } from '@material-ui/x-grid';
```

{{"demo": "pages/components/data-grid/overview/XGridDemo.js", "defaultCodeOpen": false, "disableAd": true}}

## Features

- Built with and exclusively for React ⚛️
- High performance 🚀
- Lightweight; less than [30 kB](https://bundlephobia.com/result?p=@material-ui/data-grid) gzipped with as few dependencies as possible.
- [Pagination](/components/data-grid/pagination/)
- [Sorting](/components/data-grid/rows/#row-sorting) and [multi-sort](/components/data-grid/rows/#multi-column-sorting) ⚡️
- [Selection](/components/data-grid/selection/)
- [Rows and column virtualization](/components/data-grid/rendering/#virtualization) ⚡️
- [Resizable columns](/components/data-grid/columns/#column-resizing) ⚡️
- [100% customizable](/components/data-grid/rendering/#customization-example)
- Server side data
- [Column hiding](/components/data-grid/columns/#column-headers)
- [Accessible](/components/data-grid/accessibility/)

### 🚧 Upcoming features

While development of the data grid component is moving fast, there are still many additional features that we plan to implement:

- [Filtering](/components/data-grid/filtering/)
- [Cell editing](/components/data-grid/editing/)
- Headless
- [Localization](/components/data-grid/localization/)
- [Group & Pivot](/components/data-grid/group-pivot/) ⚡️
- [Export](/components/data-grid/export/)

You can find more details on, the [feature comparison](/components/data-grid/getting-started/#feature-comparison), our living quarterly [roadmap](https://github.com/mui-org/material-ui-x/projects/1) as well as on the open [GitHub issues](https://github.com/mui-org/material-ui-x/issues?q=is%3Aopen+label%3A%22component%3A+DataGrid%22+label%3Aenhancement).

## Resources

Here are some resources you might be interested in to learn more about the grid:

- A [fullscreen demo](https://muix-preview.netlify.app/#/grid)
- The storybook used for [internal development](https://material-ui-x.netlify.app/storybook/)
- The [source on GitHub](https://github.com/mui-org/material-ui-x/tree/master/packages/grid)
- The [Material Design specification](https://material.io/design/components/data-tables.html) specification
- The accessibility [WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices/#grid)
- The [Sketch](https://material-ui.com/store/items/sketch-react/) and [Figma](https://material-ui.com/store/items/figma-react/) design assets
