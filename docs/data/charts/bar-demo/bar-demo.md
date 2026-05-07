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
The Bar Chart doesn't bin values for you, so compute the bins from your dataset and feed the counts to a `BarChart`.

Use a `band` x-axis with `categoryGapRatio` and `barGapRatio` set to `0` to get the contiguous bars that make a histogram readable.

{{"demo": "HistogramBarChart.js"}}
