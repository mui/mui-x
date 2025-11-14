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

Similarly, you can use the `<RangeBarPlot />` component to render range bar series in a composed chart.

In the example below, we create a project schedule chart using range bars to represent task durations.

{{"demo": "RangeBarProjectSchedule.js"}}
