---
title: Charts - Bar demos
productId: x-charts
components: BarChart, BarElement, BarPlot
---

# Charts - Bar demos

<p class="description">Explore bar chart demos and examples.</p>

## TinyBarChart

{{"demo": "TinyBarChart.js"}}

## SimpleBarChart

{{"demo": "SimpleBarChart.js"}}

## StackedBarChart

{{"demo": "StackedBarChart.js"}}

## MixedBarChart

{{"demo": "MixedBarChart.js"}}

## PositiveAndNegativeBarChart

{{"demo": "PositiveAndNegativeBarChart.js"}}

## BarChartStackedBySign

{{"demo": "BarChartStackedBySign.js"}}

## BiaxialBarChart

{{"demo": "BiaxialBarChart.js"}}

## Population pyramid

{{"demo": "PopulationPyramidBarChart.js"}}

## Waterfall chart [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

The following demo shows a waterfall chart built with a [range bar chart](/x/react-charts/range-bar/).

{{"demo": "WaterfallChart.js"}}

## Histogram

A histogram displays the distribution of a numeric variable.
The Bar Chart has no built-in histogram, so split your dataset into equal-width bins first (the demo includes a `computeBins` helper as a starting point), then plot the counts.

Use a `band` x-axis with `categoryGapRatio` and `barGapRatio` set to `0` so adjacent bars touch — what makes a histogram readable.
To avoid artifacts between bars, set the `shape-rendering` to `'crispEdges'` for the bars.

{{"demo": "HistogramBarChart.js"}}
