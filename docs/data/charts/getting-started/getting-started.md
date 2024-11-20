---
productId: x-charts
githubLabel: 'component: charts'
packageName: '@mui/x-charts'
---

# Charts - Getting started

<p class="description">Install the MUI X Charts package to start building React data visualization components.</p>

## Installation

Run one of the following commands to install the free Community version or the paid Pro version of the MUI X Charts:

<!-- #default-branch-switch -->

{{"component": "modules/components/ChartsInstallationInstructions.js"}}

The Charts packages have a peer dependency on `@mui/material`.
If you're not already using it, install it with the following command:

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

[`react`](https://www.npmjs.com/package/react) and [`react-dom`](https://www.npmjs.com/package/react-dom) are also peer dependencies:

```json
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0",
  "react-dom": "^17.0.0 || ^18.0.0"
},
```

### Usage with D3

To help folks using CommonJS, the `@mui/x-charts` package uses a vendored package named `@mui/x-charts-vendor` to access D3 libraries.
You can import D3 functions from `@mui/x-charts-vendor/d3-scale`.

## Rendering Charts

MUI X Charts can be rendered as _self-contained_ or _composable_ components.
[Self-contained components](#self-contained-charts) are simpler to get started with and are recommended for most common use cases; more complex visualization (such as combining Bar and Line Charts on a single plot) requires [custom composition](#composable-charts).

### Self-contained Charts

Self-contained Chart components are imported and rendered as a single React component (such as `<BarChart />` or `<LineChart />`) which contains all of the necessary subcomponents.

These components require a `series` prop describing the data to render, as well as a numerical value (rendered in pixels) for the `height` prop.
The `width` prop is optional; if no value is provided, the Charts expand to fill the available space.

{{"demo": "SimpleCharts.js"}}

### Composable Charts

More complex use cases require composition of the necessary subcomponents inside of a Chart Container wrapper.
Subcomponents include:

- Axis components – to define the X and Y axes
- Plot components – to create Bars, Lines, or any other Chart type
- Auxillary components - to add Tooltips, Highlights, and more
- Utilities - such as classes and types

See the [Charts composition documentation](/x/react-charts/composition/) for complete details.

The demo below shows how to use composition to create a custom Chart that combines a Bar and a Line Chart on a single plot:

{{"demo": "Combining.js"}}

## Chart layouts

The layout of a Chart is defined by two main spaces: the plot area, and the outer margins.

The `width` and `height` props define the dimensions of the SVG which is the root of the chart.
Within this SVG, the plot area (or drawing area) serves as the canvas for data visualization, where the lines, bars or other visual elements are rendered.
The size of the plot area is determined by the `margin = {top, bottom, left, right}` object which defines its outer margins inside the SVG.
The outer margin space is where information like axes, titles, and legends are displayed.

See the [Styling documentation](/x/react-charts/styling/#placement) for complete details.

## Axis management

MUI X Charts take a flexible approach to axis management, with support for multiple axes and any combination of scales and ranges.

See the [Axis documentation](/x/react-charts/axis/) for complete details.

## TypeScript

To benefit from [CSS overrides](/material-ui/customization/theme-components/#theme-style-overrides) and [default prop customization](/material-ui/customization/theme-components/#theme-default-props) with the theme, TypeScript users must import the following types.
These types use module augmentation to extend the default theme structure.

```tsx
// only one import is necessary,
// from the version you're currently using.
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-charts-pro/themeAugmentation';

const theme = createTheme({
  components: {
    MuiChartsAxis: {
      styleOverrides: {
        tick: {
          stroke: '#006BD6',
        },
      },
    },
  },
});
```
