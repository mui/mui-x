---
title: Charts - Line demos
productId: x-charts
components: LineChart, LineElement, LineHighlightElement, LineHighlightPlot, LinePlot, MarkElement, MarkPlot
---

# Charts - Line demos

<p class="description">Demos that use line charts for basic plots, live data, reference lines, and custom styling.</p>

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

To show that parts of the data have different meanings, you can style each part differently.

In the demo below, a dotted line indicates estimated or predicted values.
Set the `slots.line` prop to a custom component that renders the default line twice.

- The first path is clipped to show known values (from the left of the chart up to the limit).
- The second path is clipped to show predictions (from the limit to the right of the chart) with dash styling.

An uncertainty area illustrates the forecast uncertainty.

{{"demo": "LineWithUncertaintyArea.js"}}

## CustomLineMarks

Using a shape other than `"circle"` renders a `<path />` instead of a `<circle />` for mark elements.
That change can reduce rendering performance (for example, around 50 ms to render 1,000 marks).

{{"demo": "CustomLineMarks.js"}}

## Larger interaction area

A line highlights when the pointer hovers over it, but the interaction area is narrow.
Until a built-in solution exists, you can define a larger hit area with slots.

Use two paths: a thin visible one for the line and a wider invisible one for pointer events.

When lines cross, the highlighted series is the last one defined in the slots, not necessarily the one closest to the pointer.

{{"demo": "LargerHighlightLineNoSnap.js"}}
