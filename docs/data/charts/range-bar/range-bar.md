---
title: React Range Bar chart
productId: x-charts
components: BarChartPremium, RangeBarPlot, ChartDataProviderPremium, ChartsContainerPremium, FocusedRangeBar
---

# Charts - Range Bar [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Show the span between minimum and maximum values across categories.</p>

## Overview

A range bar chart displays the span between two values for each category.

Each bar extends from a lower to an upper value.
This type of chart is commonly used for visualizing data like temperature ranges, project timelines, or performance intervals.

## Basics

A range bar chart is created by rendering `BarChartPremium` with at least one series of type `'rangeBar'`.

Each data point in a range bar series consists of a `{ start: number, end: number }` object.

{{"demo": "BasicRangeBar.js"}}

## Customization

### Grid

You can add a grid in the background of the chart with the `grid` prop.

See [Axis—Grid](/x/react-charts/axis/#grid) for details.

### Border radius

To achieve rounded corners, set the `borderRadius` prop on `BarChartPremium` to any positive value.

When composing a custom component, set the `borderRadius` prop on the `RangeBarPlot` component.

{{"demo": "RangeBarBorderRadius.js"}}

### Color

You can modify the series color either directly or with the color palette.

Use a `colorMap` to map values to colors.
The color set by `colorMap` has priority over other color settings.

:::warning
Unlike other chart types, the `colorMap` property does not work for the numerical axis of range bar charts (that is, the y-axis for vertical range bar charts and the x-axis for horizontal range bar charts).
:::

See [Styling—Value-based colors](/x/react-charts/styling/#value-based-colors) for more on `colorMap`.

{{"demo": "RangeBarColorScale.js"}}

### CSS

You can customize the range bar chart elements using CSS selectors.

Like a bar chart, each series renders a `g` element that contains a `data-series` attribute.
You can use this attribute to target elements based on their series.

{{"demo": "RangeBarGradient.js"}}

## Click event

The click event handlers work similarly to bar charts.
See the bar chart [Click event](/x/react-charts/bars/#click-event) page for details.

{{"demo": "RangeBarClick.js"}}

:::info
If you use `onAxisClick`, the `seriesValues` type will be missing `RangeBarValueType`.

In case you use `onItemClick`, the `itemIdentifier` type will be missing `RangeBarItemIdentifier`.

To correct both these types, you need to import the following file:

```ts
import type {} from '@mui/x-charts-pro/moduleAugmentation/rangeBarOnClick';
```

:::

## Animation

Animation works similarly to bar charts.
See the bar chart [Animation](/x/react-charts/bars/#animation) page for details.

{{"demo": "RangeBarAnimation.js"}}

## Composition

Use `ChartDataProviderPremium` to provide `series`, `xAxis`, and `yAxis` props for composition.

Besides the common chart components available for [composition](/x/react-charts/composition/), render the `RangeBarPlot` component to display the range bars and their labels.

Here's roughly how `BarChartPremium` is composed:

```jsx
<ChartDataProviderPremium>
  <ChartsWrapper>
    <ChartsLegend />
    <ChartsSurface>
      <ChartsGrid />
      <g clipPath={`url(#${clipPathId})`}>
        <BarPlot />
        <RangeBarPlot />
        <ChartsOverlay />
        <ChartsAxisHighlight />
        <FocusedBar />
        <FocusedRangeBar />
      </g>
      <ChartsAxis />
      <ChartsClipPath id={clipPathId} />
    </ChartsSurface>
    <ChartsTooltip />
  </ChartsWrapper>
</ChartDataProviderPremium>
```

In the example below, we follow a similar pattern and create a project schedule chart using range bars to represent task durations.

{{"demo": "RangeBarProjectSchedule.js"}}
