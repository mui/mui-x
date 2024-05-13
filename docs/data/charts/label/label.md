---
title: Charts - Label
productId: x-charts
components: BarChart, ScatterChart, LineChart, PieChart
---

# Charts - Label

<p class="description">Label refers to the text reference of a series or data.</p>

## Basic display

To set series' label, you can pass in a `string` as a series' property `label`.
The provided label will be visible at different locations such as the legend, or the tooltip.

:::info
The Pie chart has some specificity described in its [own section](#pie).
:::

{{"demo": "BasicLabel.js"}}

## Conditional formatting

In order to change the content of the label based on where it is being displayed. You can pass a function to the `label` property of the [BarSeriesType](/x/api/charts/bar-series-type/), [LineSeriesType](/x/api/charts/line-series-type/) and [ScatterSeriesType](/x/api/charts/scatter-series-type/) or [PieSeriesType](/x/api/charts/pie-series-type/)`.data.label` in case of a pie chart.

### Bars, Lines and Scatter

The [Bars](/x/react-charts/bars/), [Lines](/x/react-charts/lines/) and [Scatter](/x/react-charts/scatter/) charts all work in the same way regarding the `label` property.

Each of the `series` can receive a different `function` or `string` as their `label`.

The function receives `location` as its first argument, and it can have the following values:

- `'legend'` in order to format the label to display in the [Legend](/x/react-charts/legend/)
- `'tooltip'` to format for displaying in the [Tooltip](/x/react-charts/tooltip/)

{{"demo": "FunctionLabel.js"}}

### Pie

The [Pie](/x/react-charts/pie/) chart behaves a little differently due to its nature. It also has one more place where the label can be rendered.

Instead of receiving the `label` as part of the series. It instead receives it as part of the `data` set inside a series.

Its `location` argument can have the following values:

- `'legend'` to format the label to display in the [Legend](/x/react-charts/legend/)
- `'tooltip'` to format for displaying in the [Tooltip](/x/react-charts/tooltip/)
- `'arc'` to format the [Arc](http://localhost:3001/x/react-charts/pie/#labels) label when `arcLabel` is set to `'label'`

{{"demo": "PieLabel.js"}}
