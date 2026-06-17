---
title: React Radial Bar chart
productId: x-charts
components: ChartsRadialDataProvider, ChartsRadialDataProviderPremium, ChartsRadialGrid, RadialBarChart, RadialBarPlot, ChartsRadiusAxis, ChartsRotationAxis
---

# Charts - Radial Bars [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Use radial bar charts to compare values along periodic categories.</p>

## Overview

Radial bar charts plot values in polar coordinates, with each bar growing along the radius from a shared center.
This circular layout reads naturally for periodic or cyclic data—months, hours of the day, or compass directions—and offers a compact display for medium-sized bar datasets that would stretch a straight axis.

The chart below compares average trust in others (people aged 16 and over) across Europe between 2013 and 2025.

{{"demo": "TrustRadialBarChart.js" }}

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

## Coloring each bar

Set a `colorMap` on the band axis to give each category its own color.
With `layout='horizontal'` the band categories sit on the `radiusAxis`, so an `'ordinal'` color map there paints each concentric ring independently.

The demo below uses this to build a health dashboard where every metric ring tracks progress toward its goal.

{{"demo": "HealthRadialBarChart.js", "bg": "outline"}}

## Click events

The `RadialBarChart` provides an `onAxisClick` handler that fires when the user clicks anywhere in the chart area.
Its signature matches the bar chart:

```js
const clickHandler = (
  event, // The native mouse event emitted by the SVG component.
  params, // An object that identifies the clicked axis item and its series values.
) => {};
```

{{"demo": "RadialBarClick.js"}}
