---
title: Charts - Line demonstration
productId: x-charts
components: LineChart, LineElement, LineHighlightElement, LineHighlightPlot, LinePlot, MarkElement, MarkPlot
---

# Charts - Line demonstration

<p class="description">This page groups demonstration using line charts.</p>

## SimpleLineChart

{{"demo": "SimpleLineChart.js"}}

## TinyLineChart

{{"demo": "TinyLineChart.js"}}

## DashedLineChart

{{"demo": "DashedLineChart.js"}}

## BiaxialLineChart

{{"demo": "BiaxialLineChart.js"}}

## LineChartWithReferenceLines

{{"demo": "LineChartWithReferenceLines.js"}}

## LineChartConnectNulls

{{"demo": "LineChartConnectNulls.js"}}

## Line with forecast

To show that parts of the data have different meanings, you can render stylised lines for each of them.

In the following example, the chart shows a dotted line to exemplify that the data is estimated.
To do so, the `slots.line` is set with a custom components that render the default line twice.

- The first one is clipped to show known values (from the left of the chart to the limit).
- The second one is clipped to show predictions (from the limit to the right of the chart) with dash styling.

{{"demo": "LineWithPrediction.js"}}
