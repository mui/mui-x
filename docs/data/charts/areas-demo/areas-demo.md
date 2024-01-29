---
title: Charts - Areas demonstration
productId: x-charts
components: LineChart, LineElement, LineHighlightElement, LineHighlightPlot, LinePlot, MarkElement, MarkPlot, AreaElement, AreaPlot
---

# Charts - Areas demonstration

<p class="description">This page groups demonstration using area charts.</p>

## SimpleAreaChart

{{"demo": "SimpleAreaChart.js"}}

## StackedAreaChart

{{"demo": "StackedAreaChart.js"}}

## TinyAreaChart

{{"demo": "TinyAreaChart.js"}}

## PercentAreaChart

{{"demo": "PercentAreaChart.js"}}

## AreaChartConnectNulls

{{"demo": "AreaChartConnectNulls.js"}}

## AreaChartFillByValue

To display multiple colors in the area you can specify a gradient to fill the area (the same method can be applied on other SVG components).

You can pass this gradient definition as a children of the `<LineChart />` and use `sx` to override the area `fill` property.
To do so you will need to use the [`<linearGradient />`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/linearGradient) and [`<stop />`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/stop) SVG elements.

The first part is to get the SVG total height.
Which can be done with the `useDrawingArea` hook.
It's useful to define the `<linearGradient />` as a vector that goes from the top to the bottom of our SVG container.

Then to define where the gradient should switch from one color to another, you can use the `useYScale` hook to get the y coordinate of value 0.

:::info
The `<stop />` offset is a ratio of gradient vector.
That's why you need to divide the coordinate by the SVG height.
:::

{{"demo": "AreaChartFillByValue.js"}}
