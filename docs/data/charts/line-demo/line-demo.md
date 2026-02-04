---
title: Charts - Line demos
productId: x-charts
components: LineChart, LineElement, LineHighlightElement, LineHighlightPlot, LinePlot, MarkElement, MarkPlot
---

# Charts - Line demos

<p class="description">This page groups demos using line charts.</p>

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

## CustomLabelLineChart

{{"demo": "CustomLabelChart.js"}}

## Line chart with live data

{{"demo": "LiveLineChartNoSnap.js"}}

## Line with forecast

To show that parts of the data have different meanings, you can render stylised lines for each of them.

In the following example, the chart shows a dotted line to exemplify that the data is estimated.
To do so, the `slots.line` is set with a custom component that render the default line twice.

- The first one is clipped to show known values (from the left of the chart to the limit).
- The second one is clipped to show predictions (from the limit to the right of the chart) with dash styling.

Additionally, an uncertainty area is shown to represent the uncertainty of the forecast.

{{"demo": "LineWithUncertaintyArea.js"}}

## CustomLineMarks

Notice that using another shape than "circle" renders a `<path />` instead of the `<circle />` for mark elements.
This modification results in a small drop in rendering performance (around 50ms to render 1,000 marks).

{{"demo": "CustomLineMarks.js"}}

## Larger interaction area

A line is highlighted when a pointer is hovering over it.
Which is a narrow interaction area.
While a permanent solution isn't implemented, it's possible to define a larger interaction area with slots.

The idea is to have two paths:
A small one to display the line, and a larger invisible one that handles the interactions.

This solution has an issue when lines cross over each other, as the highlight is not on the closest line to the pointer, but by the last defined series.

{{"demo": "LargerHighlightLineNoSnap.js"}}
