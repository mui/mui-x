---
title: React Radial Bar chart
productId: x-charts
components: ChartsRadialDataProvider, ChartsRadialDataProviderPremium, ChartsRadialGrid, RadialBarChart, RadialBarPlot, ChartsRadiusAxis, ChartsRotationAxis
---

# Charts - Radial Bars [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🧪

<p class="description">Use radial bar charts to compare values along periodic categories.</p>

:::info
This feature is in preview. It is ready for production use, but its API, visuals and behavior may change in future minor or patch releases.
:::

## Basics

The `RadialBarChart` is similar to the [`BarChart`](/x/react-charts/bars/) but uses polar coordinates.
The `xAxis` and `yAxis` being replaced by the `rotationAxis` and `radiusAxis`.

{{"demo": "BasicRadialBarChart.js", "bg": "outline"}}

## Common display options

The radial bar chart accepts the same display options as the [bar chart](/x/react-charts/bars/):

- `stack`: Series with same `stack` property get stacked on top of each other.
- `layout`: Swap the axis used to represent values. By default (`'vertical'`) the radius represents the values. With `layout='horizontal'` the rotation represents the values.
- `categoryGapRatio` and `barGapRatio` can be used on the band axis to control the gap between categories and between bars within a category.

The demo below demonstrates those options.

{{"demo": "RadialBarConfig.js", "hideToolbar": true, "bg": "playground"}}

## Click events

The `RadialBarChart` provides an `onAxisClick` handler that fires when the user clicks anywhere in the chart area.
Its signature matches the bar chart:

```js
const clickHandler = (
  event, // The native mouse event emitted by the SVG component.
  params, // An object that identifies the clicked rotation axis item and its series values.
) => {};
```

{{"demo": "RadialBarClick.js"}}
