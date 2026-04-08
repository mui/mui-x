---
title: React Radial Line chart
productId: x-charts
components: RadialLineChart, RadialLinePlot, ChartsPolarGrid, ChartsPolarDataProvider
---

# Charts - Radial Lines

<p class="description">Use radial line charts to show trends along periodic values.</p>

## Overview

Radial line charts plot line series on polar coordinates instead of a Cartesian grid.

Each data point maps to an angle on the rotation axis and a distance on the radius axis, creating a shape that wraps around the center.

They work well when you want to compare cyclical patterns or display multivariate data on a shared circular layout.

{{"demo": "RadialLineOverview.js"}}

## Basics

### Data format

Radial line chart series use the same `data` property as regular line charts: an array of numbers representing the values along the radius axis.

To set the categories around the circle, pass `data` on the `rotationAxis` configuration with `scaleType: 'point'`.
Its `data` should have the same length as the series.

When you omit the `rotationAxis` prop entirely, `RadialLineChart` supplies a default rotation axis with `scaleType='point'`.
Its `data` is `[0, 1, 2, ...]` with length matching the longest series, so each value pairs with its index in the series `data` array.

<!-- {{"demo": "BasicRadialLine.js"}} -->

## Composition

Use `ChartsPolarDataProvider` to provide `series`, `rotationAxis`, and `radiusAxis` props for composition.

In addition to the shared chart components available for [composition](/x/react-charts/composition/), you can use `RadialLinePlot` to draw the lines and `ChartsPolarGrid` to draw the grid.

Here's how the radial line chart is composed:

```jsx
<ChartsPolarDataProvider>
  <ChartsWrapper>
    <ChartsLegend />
    <ChartsSurface>
      <ChartsPolarGrid />
      <g clipPath={`url(#${clipPathId})`}>
        {/* Elements clipped inside the drawing area. */}
        <RadialLinePlot />
        <ChartsOverlay />
      </g>
      <ChartsClipPath id={clipPathId} />
    </ChartsSurface>
    <ChartsTooltip />
  </ChartsWrapper>
</ChartsPolarDataProvider>
```
