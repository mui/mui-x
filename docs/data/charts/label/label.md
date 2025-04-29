---
title: Charts - Label
productId: x-charts
components: BarChart, ScatterChart, LineChart, PieChart
---

# Charts - Label

<p class="description">Label is the text reference of a series or data.</p>

## Basic display

To set a series' label, you can pass in a `string` as a series' property `label`.
The provided label will be visible at different locations such as the legend, or the tooltip.

:::info
The Pie chart has some specificity described in its [own section](#pie).
:::

{{"demo": "BasicLabel.js"}}

## Conditional formatting

The `label` property also accepts a `function` allowing you to change the label content based on location.

The function receives `location` as its first argument which can have the following values:

- `'legend'` to format the label in the [Legend](/x/react-charts/legend/)
- `'tooltip'` to format the label in the [Tooltip](/x/react-charts/tooltip/)

{{"demo": "FunctionLabel.js"}}

## Pie

The [Pie](/x/react-charts/pie/) chart behaves differently due to its nature.
It has labels per slice instead of per series.
It also has one more place where the label can be rendered.

Instead of receiving the `label` as part of the series.
It instead receives it as part of the `data` set inside a series.

Its `location` argument can have the following values:

- `'legend'` to format the label in the [Legend](/x/react-charts/legend/)
- `'tooltip'` to format the label in the [Tooltip](/x/react-charts/tooltip/)
- `'arc'` to format the [Arc label](/x/react-charts/pie/#labels) when `arcLabel` is set to `'label'`

{{"demo": "PieLabel.js"}}
