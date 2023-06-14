---
product: charts
title: Charts - Overview
---

# Charts - Overview

<p class="description">This page groups general topics that are common to multiple charts.</p>

> ⚠️ This library is in alpha phase. Which means it might receives some breaking changes if they are needed to improve the components.

## Overview

The `@mui-x/chars` is an MIT library to render charts.
It relies on D3 for data manipulation and SVG for rendering.

Like other MUI components, charts are built to be production-ready components with nice integration into your application for common use cases.
They also provide a high level of customization.

To achieve this goal, the `@mui-x/chars` relies on three levels of customization:
_single components_ with nice default, extensive _configuration props_, and sub components for _composition_.

To modify the styling of charts you can rely on all the MUI styling tools, such as the theme override, or the `sx` props.

## Getting started

To install this library, run

```sh
npm install @mui/x-charts
// or
yarn add @mui/x-charts
```

## Display charts

Charts can be rendered in two ways.
With a single component or by composing sub components.

### Single charts

For common use cases, the single component is the recommended way.

Those components' name ends with "Chart" and only require the `series` prop, describing the data to render.

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
