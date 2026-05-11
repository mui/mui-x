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

The `RadialBarChart` component accepts `series`, `rotationAxis`, and `radiusAxis` props to render data in polar coordinates.

{{"demo": "BasicRadialBarChart.js", "bg": "outline"}}

## Horizontal layout

Set `layout: 'horizontal'` on a series to swap the rotation and radius axes.
The value drives the angular sweep, while the radius axis carries the categories.

{{"demo": "HorizontalRadialBarChart.js", "bg": "outline"}}
