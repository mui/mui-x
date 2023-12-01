---
title: React Chart library - Getting started
githubLabel: 'component: charts'
packageName: '@mui/x-charts'
---

# Charts - Getting Started

<p class="description">Get started with the Charts components. Install the package, configure your application and start using the components.</p>

## Installation

:::warning
The `next` tag is used to download the latest v7 **pre-release** version.
:::

To install this library, run

<codeblock storageKey="package-manager">
```bash npm
npm install @mui/x-charts@next
```

```bash yarn
yarn add @mui/x-charts@next
```

```bash pnpm
pnpm add @mui/x-charts@next
```

</codeblock>

:::info
With Next.js you might face the following error:

```bash
[ESM][charts] Doesn't build due to require() of ES Module (ERR_REQUIRE_ESM)
```

The solution is to transpile the package by adding `transpilePackages: ['@mui/x-charts']` to your `next.config.js` file—see [this GitHub issue and comment](https://github.com/mui/mui-x/issues/9826#issuecomment-1658333978) for details.
:::

## Displaying Charts

A Chart can be rendered in one of two ways: as a single component, or by composing subcomponents.

### Single Charts

For most common use cases, we recommend rendering as a single component.

The components intended to be rendered individually are named with "Chart" (as opposed to "Plot") and only require the `series` prop, which describes the data to render.

{{"demo": "SimpleCharts.js"}}

### Composed Charts

To combine different Charts, like Lines with Bars, you can use composition with the `<ChartContainer />` wrapper.

Inside this wrapper, you can render `<XAxis />`, `<YAxis />`, or any plot component (`<BarPlot />`, `<LinePlot />`, `<AreaPlot />`, or `<ScatterPlot />`).
See the [Composition doc](/x/react-charts/composition/) for complete details.

{{"demo": "Combining.js"}}

## Axis management

MUI X Charts are flexible when it comes to axis management: they support multiple-axis charts with any combination of scales and ranges.

See the [Axis doc](/x/react-charts/axis/) for more details.

## Styling

The Charts library follows the same styling patterns as other MUI component libraries, such as Material UI.

See the [Styling doc](/x/react-charts/styling/) for details.
