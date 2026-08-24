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

Radial bars support the same [color scale](/x/react-charts/bars/#color-scale) as the bar chart.
The only difference is that the cartesian `x` and `y` axes are replaced by the `rotationAxis` and `radiusAxis`, so you can set a `colorMap` on either of them.

The demo below sets an `'ordinal'` color map on the `radiusAxis` to build a health dashboard where every metric ring tracks progress toward its goal.

{{"demo": "HealthRadialBarChart.js", "bg": "outline"}}

## Click events

The `RadialBarChart` provides two click handlers:

- `onItemClick` for clicks on a specific bar
- `onAxisClick` for clicks anywhere in the chart area

They both provide the following signature:

```js
const clickHandler = (
  event, // The mouse event.
  params, // An object that identifies the clicked elements.
) => {};
```

{{"demo": "RadialBarClick.js"}}

:::info
There is a slight difference between the `event` of `onItemClick` and `onAxisClick`:

- For `onItemClick` the event is a React synthetic mouse event emitted by the chart container.
  Radial bars have no per-element click handler, so the clicked bar is resolved from the pointer position.
- For `onAxisClick` the event is a native mouse event emitted by the SVG component.

:::

## Custom annotations and overlays

For advanced customizations like reference lines, custom markers, or data overlays, use the [`usePolarGeometry` hook](/x/react-charts/hooks/use-polar-geometry/).
This hook provides access to the chart's coordinate transformations, allowing you to position custom SVG elements precisely within the polar coordinate space.

Common use cases include:

- **Reference rings** — Visual targets or threshold indicators
- **Data annotations** — Labels and markers for specific points
- **Period overlays** — Comparing current data with historical periods
- **Custom markers** — Icons or shapes at specific coordinates

See the [usePolarGeometry hook documentation](/x/react-charts/hooks/use-polar-geometry/) for detailed examples and API reference.
