---
title: React Data Grid component
---

# Data Grid

<p class="description">A fast and extendable react data table and react data grid. It's a feature-rich component available in MIT or Commercial versions.</p>

The component leverages the power of React and TypeScript, to provide the best UX while manipulating an unlimited set of data. It comes with an intuitive API for real-time updates, accessibility, as well as theming and custom templates, all with blazing fast performance.

## Overview

Data tables display information in a grid-like format of rows and columns. They organize information in a way that’s easy to scan so that users can look for patterns and insights. The data grid comes in 2 versions, both in MUI X:

The data grid comes with two different licenses:

- [DataGrid](https://mui.com/api/data-grid/data-grid/), it's [MIT licensed](https://tldrlegal.com/license/mit-license) and available on npm as `@mui/x-data-grid`.
- [DataGridPro](https://mui.com/api/data-grid/data-grid-pro/), it's **Commercially licensed** and available on npm as `@mui/x-data-grid-pro`.
  The features only available in the commercial version are suffixed with a <span class="pro"></span> icon for the Pro plan or a <span class="premium"></span> icon for the Premium plan.

  <img src="/static/x/header-icon.png" style="width: 454px; margin-bottom: 2rem;" alt="">

  You can check the [feature comparison](/components/data-grid/getting-started/#feature-comparison) for more details.
  See [Pricing](https://mui.com/store/items/material-ui-pro/) for details on purchasing licenses.

> Visit the [installation guide](/components/data-grid/getting-started/#installation) to learn how to install the correct package version and dependencies.

### MIT version

The first version is meant to simplify the [Table demo](https://mui.com/components/tables/#sorting-amp-selecting) with a clean abstraction.
This abstraction also set constraints that allow the component to implement new features.

```js
import { DataGrid } from '@mui/x-data-grid';
```

{{"demo": "pages/components/data-grid/overview/DataGridDemo.js", "defaultCodeOpen": false, "bg": "inline"}}

### Commercial version [<span class="pro"></span>](https://mui.com/store/items/material-ui-pro/)

The following grid displays 31 columns and 100,000 rows - over 3 million cells in total.

```js
import { DataGridPro } from '@mui/x-data-grid-pro';
```

{{"demo": "pages/components/data-grid/overview/DataGridProDemo.js", "defaultCodeOpen": false, "disableAd": true, "bg": "inline"}}

You can check the [feature comparison](/components/data-grid/getting-started/#feature-comparison) for more details.
See [Pricing](https://mui.com/store/items/material-ui-pro/) for details on purchasing licenses.

### MIT vs. commercial

_How do we decide if a feature is MIT or commercial?_

We have been building MIT React components since 2014,
and have learned much about the strengths and weaknesses of the MIT license model.
The health of this model is improving every day. As the community grows, it increases the probability that developers contribute improvements to the project.
However, we believe that we have reached the sustainability limits of what the model can support for advancing our mission forward. We have seen too many MIT licensed components moving slowly or getting abandoned. The community isn't contributing improvements as fast as the problems deserved to be solved.

We are using a commercial license to forward the development of the most advanced features, where the MIT model can't sustain it.
A solution to a problem should only be commercial if it has no MIT alternatives.

We provide three options:

- **Community**. This plan contains the MIT components that are sustainable by the contributions of the open-source community. Free forever.
- **Pro**. This plan contains the features that are at the limit of what the open-source model can sustain. For instance, providing a very comprehensive set of components. From a price perspective, the plan is designed to be accessible to most professionals.
- **Premium**. This plan contains the most advanced features.

## Features

- Built with and exclusively for React ⚛️
- High performance 🚀
- [Filtering](/components/data-grid/filtering/) and [multi-filtering](/components/data-grid/filtering/#multi-column-filtering) <span class="pro"></span>
- [Pagination](/components/data-grid/pagination/)
- [Row & Cell editing](/components/data-grid/editing/)
- [Sorting](/components/data-grid/sorting) and [multi-sort](/components/data-grid/sorting/#multi-column-sorting) <span class="pro"></span>
- [Selection](/components/data-grid/selection/)
- [Column virtualization](/components/data-grid/virtualization/#column-virtualization) and [rows virtualization](/components/data-grid/virtualization/#row-virtualization) <span class="pro"></span>
- [Resizable columns](/components/data-grid/columns/#column-resizing) <span class="pro"></span>
- [100% customizable](/components/data-grid/style/)
- Server-side data
- [Column hiding](/components/data-grid/columns/#hiding)
- [Accessible](/components/data-grid/accessibility/)
- [Localization](/components/data-grid/localization/)

### 🚧 Upcoming features

While development of the data grid component is moving fast, there are still many additional features that we plan to implement. Some of them:

- Headless (hooks only)
- [Column pinning](/components/data-grid/columns/#column-pinning) <span class="pro"></span>
- [Tree data](/components/data-grid/group-pivot/#tree-data) <span class="pro"></span>
- [Excel export](/components/data-grid/export/) <span class="premium"></span>
- [Range selection](/components/data-grid/selection/#range-selection) <span class="premium"></span>
- [Group, Pivot, Aggregation](/components/data-grid/group-pivot/) <span class="premium"></span>

You can find more details on, the [feature comparison](/components/data-grid/getting-started/#feature-comparison), our living quarterly [roadmap](https://github.com/mui-org/material-ui-x/projects/1) as well as on the open [GitHub issues](https://github.com/mui-org/material-ui-x/issues?q=is%3Aopen+label%3A%22component%3A+DataGrid%22+label%3Aenhancement).

## Resources

Here are some resources you might be interested in to learn more about the grid:

- The storybook used for [internal development](https://material-ui-x.netlify.app/storybook/)
- The [source on GitHub](https://github.com/mui-org/material-ui-x/tree/master/packages/grid)
- The [Material Design specification](https://material.io/design/components/data-tables.html) specification
- The accessibility [WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices/#grid)
- The [Sketch](https://mui.com/store/items/sketch-react/) and [Figma](https://mui.com/store/items/figma-react/) design assets

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
