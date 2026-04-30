---
title: React Radial Bar chart
productId: x-charts
components: ChartsRadialDataProvider, ChartsRadialDataProviderPremium, ChartsRadialGrid, RadialBarChart, ChartsRadiusAxis, ChartsRotationAxis
---

# Charts - Radial Bars

<p class="description">Use radial bar charts to compare values along periodic categories.</p>

## Basics

The `RadialBarChart` component accepts `series`, `rotationAxis`, and `radiusAxis` props to render data in polar coordinates.

{{"demo": "BasicRadialBarChart.js", "bg": "outline"}}

## Horizontal layout

Set `layout: 'horizontal'` on a series to swap the rotation and radius axes.
The value drives the angular sweep, while the radius axis carries the categories.

{{"demo": "HorizontalRadialBarChart.js", "bg": "outline"}}
