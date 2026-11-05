---
title: Charts - Bar demos
productId: x-charts
components: BarChart, BarElement, BarPlot
---

# Charts - Bar demos

<p class="description">Explore bar chart demos and examples.</p>

## TinyBarChart

{{"component": "file://./demos/tiny-bar-chart/index.ts"}}

## SimpleBarChart

{{"component": "file://./demos/simple-bar-chart/index.ts"}}

## StackedBarChart

{{"component": "file://./demos/stacked-bar-chart/index.ts"}}

## MixedBarChart

{{"component": "file://./demos/mixed-bar-chart/index.ts"}}

## PositiveAndNegativeBarChart

{{"component": "file://./demos/positive-and-negative-bar-chart/index.ts"}}

## BarChartStackedBySign

{{"component": "file://./demos/bar-chart-stacked-by-sign/index.ts"}}

## BiaxialBarChart

{{"component": "file://./demos/biaxial-bar-chart/index.ts"}}

## Population pyramid

{{"component": "file://./demos/population-pyramid-bar-chart/index.ts"}}

## Waterfall chart [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

The following demo shows a waterfall chart built with a [range bar chart](/x/react-charts/range-bar/).

{{"component": "file://./demos/waterfall-chart/index.ts"}}

## Histogram

A histogram displays the distribution of a numeric variable.
The Bar Chart has no built-in histogram, so split your dataset into equal-width bins first (the demo includes a `computeBins` helper as a starting point), then plot the counts.

Use a `band` x-axis with `categoryGapRatio` and `barGapRatio` set to `0` so adjacent bars touch — what makes a histogram readable.
To avoid artifacts between bars, set the `shape-rendering` to `'crispEdges'` for the bars.

{{"component": "file://./demos/histogram-bar-chart/index.ts"}}
