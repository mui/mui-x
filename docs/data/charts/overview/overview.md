---
product: charts
title: Charts - Overview
---

# Charts - Overview

<p class="description">This page groups general topics that are common to multiple charts.</p>

> ⚠️ This is an upcoming library. Please upvote 👍 features you would like to see first.
> And comments if you have specific needs to be solved by them.

:::info
💡 If you do not see the charts you want in the menu, we may have forget it.
Please open an issue to ask for it, explaining which need it solves.
:::

## Display charts

Charts can be rendered in two ways.
With a single component or by composing sub components.

### Single charts

For common use case, single component is the recommended way.

You have to provide the `series` props.
The `width` and `height` if the component is not responsive.

{{"demo": "SimpleCharts.js", "bg": "inline"}}

### Multiple charts

To combine different charts, like lines with bars, you can use composition with `<ChartContainer />` wrapper.

Inside this wrapper, you can render `<XAxis />`, `<YAxis />`, or any plot component (`<BarPlot />`, `<LinePlot />`, `<ScatterPlot />`)

{{"demo": "Combining.js", "bg": "inline"}}

## Axis management

### Multiple axis scales

### Axis customization

## Zoom management

## Data selection
