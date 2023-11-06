---
title: React Chart library - Getting started
githubLabel: 'component: charts'
packageName: '@mui/x-charts'
---

# Charts - Getting Started

<p class="description">Get started with the Charts components. Install the package, configure your application and start using the components.</p>

## Installation

To install this library, run

<codeblock storageKey="package-manager">
```bash npm
npm install @mui/x-charts
```

```bash yarn
yarn add @mui/x-charts
```

```bash pnpm
pnpm add @mui/x-charts
```

</codeblock>

:::info
With Next.js you might face the following error.

```
[ESM][charts] Doesn't build due to require() of ES Module (ERR_REQUIRE_ESM)
```

A [solution](https://github.com/mui/mui-x/issues/9826#issuecomment-1658333978) is to transpile the package by adding `transpilePackages: ['@mui/x-charts']` to your `next.config.js` file.
:::

## Display charts

Charts can be rendered in two ways.
With a single component or by composing sub-components.

### Single charts

For common use cases, the single component is the recommended way.

Those components' name ends with "Chart" and only require the `series` prop, describing the data to render.

They also have plenty of other props to customize the chart behavior.

{{"demo": "SimpleCharts.js"}}

### Multiple charts

To combine different charts, like lines with bars, you can use composition with `<ChartContainer />` wrapper.

Inside this wrapper, you can render `<XAxis />`, `<YAxis />`, or any plot component (`<BarPlot />`, `<LinePlot />`, `<AreaPlot />`, `<ScatterPlot />`)

{{"demo": "Combining.js"}}

## Axis management

The library is flexible about axis management.
It supports multiple-axis charts with any combination of scales and ranges.

For more details, have a look at the [axis docs page](/x/react-charts/axis/).

## Styling

The library is following MUI styling behavior, such that customizing charts is made as simple as customizing buttons.

For more details, have a look at the [styling docs page](/x/react-charts/styling/).
