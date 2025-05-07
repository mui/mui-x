---
productId: x-charts
githubLabel: 'component: charts'
packageName: '@mui/x-charts'
---

# Charts - Quickstart

<p class="description">Install the MUI X Charts package to start building React data visualization components.</p>

## Installation

Install the Charts package that best suits your needs—Community or Pro:

{{"component": "modules/components/ChartsInstallationInstructions.js"}}

### Peer dependencies

#### Material UI

The Charts packages have a peer dependency on `@mui/material`.
If you're not already using it, install it now:

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

#### React

<!-- #react-peer-version -->

[`react`](https://www.npmjs.com/package/react) and [`react-dom`](https://www.npmjs.com/package/react-dom) are also peer dependencies:

```json
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0 || ^19.0.0",
  "react-dom": "^17.0.0 || ^18.0.0 || ^19.0.0"
},
```

### Usage with D3

For those using CommonJS, the MUI X Charts provide a vendored package to access D3 libraries.
You can import D3 functions from `@mui/x-charts-vendor/d3-scale`.

## Rendering Charts

MUI X Charts can be rendered as _self-contained_ or _composable_ components.
[Self-contained components](#self-contained-charts) are simpler to get started with and are recommended for most common use cases.
More complex visualization (such as combining Bar and Line Charts on a single plot) requires [custom composition](#composable-charts).

### Self-contained Charts

```tsx
import { BarChart } from '@mui/x-charts/BarChart';
```

Self-contained Chart components are imported and rendered as a single React component (such as `<BarChart />` or `<LineChart />`) which contains all of the necessary subcomponents.

These components require a `series` prop describing the data to render, as well as a numerical value (rendered in pixels) for the `height` prop.
The `width` prop is optional; if no value is provided, the Charts expand to fill the available space.

{{"demo": "SimpleCharts.js"}}

### Composable Charts

More complex use cases require composition of the necessary subcomponents inside of a Chart Container wrapper.
Subcomponents include:

- Axis components – to define the X and Y axes
- Plot components – to create Bars, Lines, or any other Chart type
- Auxiliary components – to add Tooltips, Highlights, and more
- Utilities – such as classes and types

See the [Charts composition documentation](/x/react-charts/composition/) for complete details.

The demo below shows how to use composition to create a custom Chart that combines a Bar and a Line Chart on a single plot:

{{"demo": "Combining.js"}}

### Chart layouts

The layout of a Chart is defined by two main spaces: the plot area, and the outer margins.

The `width` and `height` props define the dimensions of the SVG which is the root of the chart.
Within this SVG, the plot area (or drawing area) serves as the canvas for data visualization, where the lines, bars, or other visual elements are rendered.
The size of the plot area is determined by the `margin = {top, bottom, left, right}` object which defines its outer margins inside the SVG.
The outer margin space is where information like axes, titles, and legends are displayed.

See the [Styling documentation](/x/react-charts/styling/#placement) for complete details.

### Server-side rendering

Charts support server-side rendering under two conditions:

1. `width` and `height` props must be provided – it's not possible to compute the SVG dimensions on the server.
2. Animations must be disabled with the `skipAnimation` prop – otherwise the animation will be in an empty state on first render.

### Axis management

MUI X Charts take a flexible approach to axis management, with support for multiple axes and any combination of scales and ranges.
See the [Axis documentation](/x/react-charts/axis/) for complete details.

## TypeScript

### Theme augmentation

To benefit from [CSS overrides](/material-ui/customization/theme-components/#theme-style-overrides) and [default prop customization](/material-ui/customization/theme-components/#theme-default-props) with the theme, TypeScript users must import the following types.
These types use module augmentation to extend the default theme structure.

```tsx
// Pro users: add `-pro` suffix to package name
import type {} from '@mui/x-charts/themeAugmentation';

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
