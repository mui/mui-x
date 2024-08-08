---
productId: x-charts
githubLabel: 'component: charts'
packageName: '@mui/x-charts'
---

# Charts - Getting Started

<p class="description">Get started with the MUI X Charts components. Install the package, configure your application, and start using the components.</p>

## Installation

Using your favorite package manager, install `@mui/x-charts-pro` for the commercial version, or `@mui/x-charts` for the free community version.

<!-- #default-branch-switch -->

{{"component": "modules/components/ChartsInstallationInstructions.js"}}

The Charts package has a peer dependency on `@mui/material`.
If you are not already using it in your project, you can install it with:

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

Please note that [react](https://www.npmjs.com/package/react) and [react-dom](https://www.npmjs.com/package/react-dom) are peer dependencies too:

```json
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0",
  "react-dom": "^17.0.0 || ^18.0.0"
},
```

### Style engine

Material UI is using [Emotion](https://emotion.sh/docs/introduction) as a styling engine by default. If you want to use [`styled-components`](https://styled-components.com/) instead, run:

<codeblock storageKey="package-manager">
```bash npm
npm install @mui/styled-engine-sc styled-components
```

```bash pnpm
pnpm add @mui/styled-engine-sc styled-components
```

```bash yarn
yarn add @mui/styled-engine-sc styled-components
```

</codeblock>

Take a look at the [Styled engine guide](/material-ui/integrations/styled-components/) for more information about how to configure `styled-components` as the style engine.

### Usage with D3

To help folks using CommonJS, the `@mui/x-charts` package uses a vendored package named `@mui/x-charts-vendor` to access D3 libraries.

If you need some D3 functions, you can import them with `@mui/x-charts-vendor/d3-color`.

## Displaying Charts

A Chart can be rendered in one of two ways: as a single component, or by composing subcomponents.

### Single Charts

For common use cases, the single component is the recommended way.
Those components' names end with "Chart", as opposed to "Plot", and only require the series prop describing the data to render.

{{"demo": "SimpleCharts.js"}}

### Composed Charts

To combine different Charts, like Lines with Bars, you can use composition with the `ChartContainer` wrapper.

Inside this wrapper, render either axis components, such as `XAxis` and `YAxis`, or any plot component like `BarPlot`, `LinePlot`, `AreaPlot`, and `ScatterPlot`.

Visit the [Composition page](/x/react-charts/composition/) for more details.

{{"demo": "Combining.js"}}

### Positions

Charts are composed of two main areas.
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
