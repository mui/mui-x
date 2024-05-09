---
title: Charts - Label
productId: x-charts
components: BarChart, ScatterChart, LineChart, PieChart
---

# Charts - Label

<p class="description">Label refers to the text reference of a series or data. In the UI it is used in many components like the `legend`, `tooltip` and inside an `arc` of a pie chart.</p>

## Basic display

In the most basic example, you can pass in a `string` as a series' label, and it will be rendered like that by all the different components that use it in order to differentiate each series.

{{"demo": "BasicLabel.js"}}

## Conditional Formatting

In order to change the content of the label based on where it is being displayed. You can pass a function to the `label` property of the [BarSeriesType](/x/api/charts/bar-series-type/), [LineSeriesType](/x/api/charts/line-series-type/) and [ScatterSeriesType](/x/api/charts/scatter-series-type/) or [PieSeriesType](/x/api/charts/pie-series-type/)`.data.label` in case of a pie chart.

### Bars, Lines and Scatter

The [Bars](/x/react-charts/bars/), [Lines](/x/react-charts/lines/) and [Scatter](/x/react-charts/scatter/) charts all work in the same way regarding the `label` property.

Each of the `series` can receive a different `function` or `string` as their `label`.

The function receives `location` as its first argument, and it can have the following values:

- `'legend'` in order to format the label to display in the [Legend](/x/react-charts/legend/)
- `'tooltip'` to format for displaying in the [Tooltip](/x/react-charts/tooltip/)

{{"demo": "FunctionLabel.js"}}

### Pie

The [Pie](/x/react-charts/pie/) charts however, behave a little different due to their nature. They also have one more place where the label can be rendered.

Instead of receiving the `label` as part of the series. It instead receives it as part of the `data` set inside a series.

And its `location` argument can have the following values:

- `'legend'` in order to format the label to display in the [Legend](/x/react-charts/legend/)
- `'tooltip'` to format for displaying in the [Tooltip](/x/react-charts/tooltip/)
- `'arc'` for formatting the [Arc](http://localhost:3001/x/react-charts/pie/#labels) label when `arcLabel` is set to `'label'`

{{"demo": "PieLabel.js"}}
