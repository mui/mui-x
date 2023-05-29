---
product: charts
title: Charts - Overview
---

# Charts - Overview

<p class="description">This page groups general topics that are common to multiple charts.</p>

> ⚠️ This library is in alpha phase. Which means we allow ourself to do some breaking changes if needed to improve the library.

:::info
💡 If you do not see the charts you want in the menu, we may have forget it.
Please open an issue to ask for it, explaining which need it solves.
:::

## Overview

The `@mui-x/chars` is an MIT library to render charts.
It relies on D3 for data manipulation and SVG for rendering.

It provides both single components with configuration props, and atomic components for composition.

## Getting started

To install this library, run

```bash
npm install @mui/x-charts
// or
yarn add @mui/x-charts
```

## Display charts

Charts can be rendered in two ways.
With a single component or by composing sub components.

### Single charts

For common use cases, the single component is the recommended way.

Those components' name ends with "Chart".
They only require `series` prop, describing the data to render.

They also have plenty of other props to customize the chart behavior.

{{"demo": "SimpleCharts.js", "bg": "inline"}}

### Multiple charts

To combine different charts, like lines with bars, you can use composition with `<ChartContainer />` wrapper.

Inside this wrapper, you can render `<XAxis />`, `<YAxis />`, or any plot component (`<BarPlot />`, `<LinePlot />`, `<AreaPlot />`, `<ScatterPlot />`)

{{"demo": "Combining.js", "bg": "inline"}}

## Axis management

The library is flexible about axis management.
It supports multiple-axis charts with any combination of scales and ranges.

For more details, have a look at the [axis docs page](/x/react-charts/axis/).

## Styling

The library is following MUI styling behavior, such that customizing charts is made as simple as customizing buttons.

For more details, have a look at the [styling docs page](/x/react-charts/styling/).
