---
title: React Candlestick chart
productId: x-charts
components: CandlestickChart, CandlestickPlot
---

# Charts - Candlestick [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🧪

<p class="description">A candlestick chart is used to visualize price movement over time.</p>

:::warning
This feature is in preview. It is not yet ready for production use, and its API, visuals and behavior may change in future minor or patch releases.
:::

## Overview

A candlestick chart provides a visual overview of how a price changes over time, commonly used in financial contexts like stock market analysis.

Each candlestick represents a time period and shows where the price started, where it ended, and how high or low it moved during that period.

This makes it easier to understand overall trends, compare price movements, and see how buying and selling activity evolves.

{{"demo": "CandlestickOverview.js"}}

## Basics

Candlestick chart's series should contain a `data` property containing an array of open, high, low, and close (OHLC) prices for a given time period.

These OHLC values should be provided as an array in the following format: `[open, high, low, close]`.

Consequently, the `data` array should look similar to this:

```ts
const data = [
  [open1, high1, low1, close1],
  [open2, high2, low2, close2],
  // ...
];
```

You can specify the time period with the `xAxis` prop. This axis must have a band scale and its data should have the same length as your series.

{{"demo": "BasicCandlestick.js"}}

## Value formatting

Use the series `valueFormatter` to customize how OHLC values appear in the tooltip.

The `valueFormatter` receives the individual field value (a number) and a context object with `dataIndex` and `field` properties.
The `field` property indicates which OHLC component is being formatted: `'open'`, `'high'`, `'low'`, or `'close'`.

{{"demo": "CandlestickValueFormatter.js"}}

## Customization

Similarly to other chart types, you can customize the appearance and behavior of the candlestick chart.

The example below shows how to define the formatting of values in both axes.

{{"demo": "CustomizedCandlestick.js"}}

## Composition

Similar to other chart types, candlestick charts can be composed using multiple components to create more complex visualizations.

In this example, we demonstrate how to create a candlestick chart that displays the volume of trades as a bar chart, as well as the 20-day moving average, shown as a line chart.

:::info
When using composition, you need to set a scale type for the x-axis.

A candlestick series requires a band x-axis, so you need to set the `scaleType` of the x-axis to `band`.
:::

Since the candlestick plot is a WebGL canvas, you need to render it inside a `ChartsWebGLLayer`. You can read more about layering in the [Layering](/x/react-charts/composition/#layering) documentation.

{{"demo": "CandlestickComposition.js"}}
