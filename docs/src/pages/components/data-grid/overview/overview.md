---
title: React Data Grid component
githubLabel: 'component: data grid'
packageName: '@mui/x-data-grid'
waiAria: https://www.w3.org/TR/wai-aria-practices-1.1/#grid
---

# Data Grid

<p class="description">A fast and extendable react data table and react data grid. It's a feature-rich component available in MIT or Commercial versions.</p>

{{"component": "modules/components/ComponentLinkHeader.js"}}

The component leverages the power of React and TypeScript, to provide the best UX while manipulating an unlimited set of data. It comes with an intuitive API for real-time updates, accessibility, as well as theming and custom templates, all with blazing fast performance.

## Overview

Data tables display information in a grid-like format of rows and columns.
They organize information in a way that’s easy to scan so that users can look for patterns and insights.

The data grid comes with two different licenses:

- [MIT license](https://tldrlegal.com/license/mit-license). It's available on npm as [`@mui/x-data-grid`](https://www.npmjs.com/package/@mui/x-data-grid) and includes the [DataGrid](/api/data-grid/data-grid/) component.
- [Commercial license](/x/license/). It's available on npm as [`@mui/x-data-grid-pro`](https://www.npmjs.com/package/@mui/x-data-grid-pro) and includes the [DataGridPro](/api/data-grid/data-grid-pro/) component.

The features only available in the commercial version are suffixed in the documentation for clarity:

- For features only available in the Pro plan and upward: <span class="plan-pro"></span>

  <div class="only-light-mode">
    <img src="/static/x/commercial-header-icon-light.png" style="width: 579px; margin-bottom: 2rem;" alt="">
  </div>
  <div class="only-dark-mode">
    <img src="/static/x/commercial-header-icon-dark.png" style="width: 560px; margin-bottom: 2rem;" alt="">
  </div>

- For features only available in the Premium plan: <span class="plan-premium"></span>

You can check the [feature comparison](/components/data-grid/getting-started/#feature-comparison) for more details.
See [Pricing](https://mui.com/store/items/material-ui-pro/) for details on purchasing licenses.

> Visit the [installation guide](/components/data-grid/getting-started/#installation) to learn how to install the correct package version and dependencies.

### MIT version

The first version is meant to simplify the [Table demo](/components/tables/#sorting-amp-selecting) with a clean abstraction.
This abstraction also set constraints that allow the component to implement new features.

```js
import { DataGrid } from '@mui/x-data-grid';
```

{{"demo": "pages/components/data-grid/overview/DataGridDemo.js", "defaultCodeOpen": false, "bg": "inline"}}

### Commercial version [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

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
- [Filtering](/components/data-grid/filtering/) and [multi-filtering](/components/data-grid/filtering/#single-and-multi-filtering) <span class="plan-pro"></span>
- [Pagination](/components/data-grid/pagination/)
- [Row & Cell editing](/components/data-grid/editing/)
- [Sorting](/components/data-grid/sorting) and [multi-sorting](/components/data-grid/sorting/#multi-sorting) <span class="plan-pro"></span>
- [Selection](/components/data-grid/selection/)
- [Column virtualization](/components/data-grid/virtualization/#column-virtualization) and [rows virtualization](/components/data-grid/virtualization/#row-virtualization) <span class="plan-pro"></span>
- [Row grouping](/components/data-grid/group-pivot/#row-grouping) <span class="plan-pro"></span>
- [Tree data](/components/data-grid/group-pivot/#tree-data) <span class="plan-pro"></span>
- [Resizable columns](/components/data-grid/columns/#column-resizing) <span class="plan-pro"></span>
- [100% customizable](/components/data-grid/style/)
- Server-side data
- [Column hiding](/components/data-grid/columns/#hiding)
- [Column pinning](/components/data-grid/columns/#column-pinning) <span class="pro"></span>
- [Accessible](/components/data-grid/accessibility/)
- [Localization](/components/data-grid/localization/)

### 🚧 Upcoming features

While development of the data grid component is moving fast, there are still many additional features that we plan to implement. Some of them:

- Headless (hooks only)
- [Excel export](/components/data-grid/export/) <span class="plan-premium"></span>
- [Range selection](/components/data-grid/selection/#range-selection) <span class="plan-premium"></span>
- [Pivot, Aggregation](/components/data-grid/group-pivot/) <span class="plan-premium"></span>

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
