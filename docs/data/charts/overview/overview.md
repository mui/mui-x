---
title: React Chart library
githubLabel: 'component: charts'
packageName: '@mui/x-charts'
---

# Charts

<p class="description">A fast and extendable library of react chart components for data visualization.</p>

{{"component": "modules/components/ComponentLinkHeader.js", "design": false}}

## Overview

The `@mui/x-charts` is an MIT library to render charts.
It relies on D3.js for data manipulation and SVG for rendering.

Like other MUI X components, charts are built to be production-ready components with nice integration into your application for common use cases.
They also provide a high level of customization.

To achieve this goal, the `@mui/x-charts` relies on three levels of customization:
_single components_ with nice default, extensive _configuration props_, and subcomponents for _composition_.

To modify the styling of charts you can rely on all the MUI styling tools, such as the theme override, or the `sx` props.

## Getting started

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
