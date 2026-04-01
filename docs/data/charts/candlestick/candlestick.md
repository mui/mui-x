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

### Using a dataset

You can use the `dataset` prop to provide OHLC data and `datasetKeys` on the series to map dataset fields to the open, high, low, and close values.

{{"demo": "DatasetCandlestick.js"}}

### Value getter

You can use `valueGetter` on the OHLC series to transform dataset items into OHLC values.
The `valueGetter` receives the full dataset item and should return a `[open, high, low, close]` tuple or `null`.

```tsx
series={[
  {
    type: 'ohlc',
    valueGetter: (item) => [item.open, item.high, item.low, item.close],
  },
]}
```

See the [Dataset](/x/react-charts/dataset) page to learn how to use value getters.

## Value formatting

Use the series `valueFormatter` to customize how OHLC values appear in the tooltip.

The `valueFormatter` receives the individual field value (a number) and a context object with `dataIndex` and `field` properties.
The `field` property indicates which OHLC component is being formatted: `'open'`, `'high'`, `'low'`, or `'close'`.

{{"demo": "CandlestickValueFormatter.js"}}

## Customization

Similarly to other chart types, you can customize the appearance and behavior of the candlestick chart.

The example below shows how to define the formatting of values in both axes.

{{"demo": "CustomizedCandlestick.js"}}

### Color

Use the `upColor` and `downColor` properties on the series to customize the candle body colors.
The `upColor` is used when the close price is greater than or equal to the open price, and `downColor` when it is less.

Those properties accept callback with type `(mode: 'light' | 'dark') => string`.

{{"demo": "ColorCandlestick.js"}}

### Custom tooltip

When building a custom tooltip with the `useItemTooltip()` or `useAxesTooltip()` hooks, you need to provide `'ohlc'` as a generic type parameter.
By default, these hooks exclude the `'ohlc'` series type, so the OHLC-specific value shape is not available unless explicitly specified.

```tsx
// Item tooltip
const itemTooltipData = useItemTooltip<'ohlc'>();

// Axis tooltip
const axesTooltipData = useAxesTooltip<'ohlc'>();
```

This gives you properly typed `value` and `formattedValue` properties. Which are now objects containing the `open`, `high`, `low`, and `close` properties.

If your chart combines OHLC with other series types, provide a union:

```tsx
const axesTooltipData = useAxesTooltip<'ohlc' | 'line' | 'bar'>();
```

## Composition

Similar to other chart types, candlestick charts can be composed using multiple components to create more complex visualizations.

In this example, we demonstrate how to create a candlestick chart that displays the volume of trades as a bar chart, as well as the 20-day moving average, shown as a line chart.

:::info
When using composition, you need to set a scale type for the x-axis.

A candlestick series requires a band x-axis, so you need to set the `scaleType` of the x-axis to `band`.
:::

Since the candlestick plot is a WebGL canvas, you need to render it inside a `ChartsWebGLLayer`. You can read more about layering in the [Layering](/x/react-charts/composition/#layering) documentation.

{{"demo": "CandlestickComposition.js"}}
