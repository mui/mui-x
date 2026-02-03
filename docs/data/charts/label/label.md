---
title: Charts - Label
productId: x-charts
components: BarChart, ScatterChart, LineChart, PieChart
---

# Charts - Label

<p class="description">Customize how series and data points are labeled in charts.</p>

A label is the text that identifies a series or data point in a chart, appearing in locations such as the legend, tooltip, or directly on chart elements.

You can set a series label by passing a string to the `label` property of a series.
The label appears in different locations such as the legend and tooltip.

:::info
The Pie chart has specific behavior described in [Pie chart labels](#pie-chart-labels) below.
:::

{{"demo": "BasicLabel.js"}}

## Conditional formatting

The `label` property accepts a function that lets you change the label content based on location.
The function receives `location` as its first argument, which can have the following values:

- `'legend'`: Format the label in the [Legend](/x/react-charts/legend/)
- `'tooltip'`: Format the label in the [Tooltip](/x/react-charts/tooltip/)

{{"demo": "FunctionLabel.js"}}

## Pie chart labels

The [Pie chart](/x/react-charts/pie/) behaves differently due to its nature.
It has labels per slice instead of per series, and provides one additional location where labels can be rendered.
Instead of receiving the `label` as part of the series, it receives it as part of the `data` set inside a series.

The `location` argument can have the following values:

- `'legend'`: Format the label in the [Legend](/x/react-charts/legend/)
- `'tooltip'`: Format the label in the [Tooltip](/x/react-charts/tooltip/)
- `'arc'`: Format the [Arc label](/x/react-charts/pie/#labels) when `arcLabel` is set to `'label'`

{{"demo": "PieLabel.js"}}
