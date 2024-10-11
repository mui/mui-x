---
productId: x-charts
githubLabel: 'component: charts'
packageName: '@mui/x-charts'
---

# Charts - Getting started

<p class="description">Install the MUI X Charts package to start building.</p>

## Installation

Run one of the following commands to add install the free Community version or the paid Pro version of the MUI X Charts:

<!-- #default-branch-switch -->

{{"component": "modules/components/ChartsInstallationInstructions.js"}}

The Charts packages have has a peer dependency on `@mui/material`. 
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
You can import D3 functions from `@mui/x-charts-vendor/d3-color`.

## Rendering Charts

A Chart can be rendered as a single, self-contained component, or it can be composed of multiple subcomponents.
The self-contained components are simpler to get started with, and are recommended for most common use cases.

### Self-contained Charts

Self-contained Chart components are suffixed with "Chart", for example `<BarChart />`, `<LineChart />`.
These components require a `series` prop describing the data to render, as well as a numerical value (in pixels) for the `height` prop.
The `width` prop is optional; if no value is provided, the Charts expand to fill the available space.

{{"demo": "SimpleCharts.js"}}

### Composed Charts

To create more a complex Chart—such as a combined Line and Bar Chart—you can compose the subcomponents inside of a Chart Container wrapper.
Options include:

- Axis components – to define the X and Y axes
- Plot components – to create Bars, Lines, or any other Chart type
- Auxillary components - to add Tooltips, Highlights, and more
- Utilities - such as classes and types

See the [Charts composition documentation](/x/react-charts/composition/) for complete details.

{{"demo": "Combining.js"}}

### Positions

The layout of a Chart is defined by the plot area

The SVG defined by its `width` and `height` delimits the available space.

Within this SVG, a dedicated "drawing area" (aka "plot area") serves as the canvas for data representation.
Here, elements like lines, bars, and areas visually depict the information.
It's controlled by the `margin = {top, bottom, left, right}` object defining the margin between the SVG and the drawing area.

The space left by margins can display axes, titles, a legend, or any other additional information.

For more information about the position configuration, visit the [styling page](/x/react-charts/styling/#styling).

## Axis management

MUI X Charts have a flexible approach to axis management, supporting multiple-axis charts with any combination of scales and ranges.

Visit the [Axis page](/x/react-charts/axis/) for more details.

## Styling

MUI X Charts follows the Material UI styling and features all of the customization tools you'd find there, making tweaking charts as straightforward as designing buttons.

Visit the [Styling page](/x/react-charts/styling/) for more details.

## TypeScript

In order to benefit from the [CSS overrides](/material-ui/customization/theme-components/#theme-style-overrides) and [default prop customization](/material-ui/customization/theme-components/#theme-default-props) with the theme, TypeScript users need to import the following types.
Internally, it uses module augmentation to extend the default theme structure.

```tsx
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

:::info
You don't have to import the theme augmentation from both `@mui/x-charts` and `@mui/x-charts-pro` when using `@mui/x-charts-pro`.
Importing it from `@mui/x-charts-pro` is enough.
:::
