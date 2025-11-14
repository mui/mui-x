---
title: React Range Bar chart
productId: x-charts
components: BarChart, RangeBarPlot
---

# Charts - Bars

<p class="description">Range bar charts highlight the range between minimum and maximum values across categories.</p>

## Overview

A range bar chart displays the span between two values for each category.

Each bar extends from a lower to an upper value, and is commonly used for visualizing data like temperature ranges, project timelines, or performance intervals.

## Basics

A range bar chart is created by rendering a `<BarChartPro />` where at least one series has the type `'rangeBar'`.

Each data point in a range bar series consists of a `{ start: number, end: number }` object.

{{"demo": "BasicRangeBar.js"}}

## Composition

You can use the `<ChartDataProviderPro />` to provide `series`, `xAxis`, and `yAxis` props for composition.

Besides the common chart components available for [composition](/x/react-charts/composition/), to compose a range bar chart you need to render the `<RangeBarPlot />` component to display the range bars and their labels.

Here's roughly a `<BarChartPro />` is composed, which you can use as a reference:

```jsx
<ChartDataProviderPro>
  <ChartsWrapper>
    <ChartsLegend />
    <ChartsSurface>
      <ChartsGrid />
      <g clipPath={`url(#${clipPathId})`}>
        <BarPlot />
        <RangeBarPlot />
        <ChartsOverlay />
        <ChartsAxisHighlight />
      </g>
      <ChartsAxis />
      <ChartsClipPath id={clipPathId} />
    </ChartsSurface>
    <ChartsTooltip />
  </ChartsWrapper>
</ChartDataProviderPro>
```

In the example below, we follow a similar pattern and create a project schedule chart using range bars to represent task durations.

{{"demo": "RangeBarProjectSchedule.js"}}
