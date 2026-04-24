---
title: React Radial Line chart
productId: x-charts
components: ChartsRadialDataProvider, ChartsRadialGrid, RadialLineChart, RadialMarkPlot, RadialLinePlot, RadialAreaPlot, RadialLineHighlightPlot
---

# Charts - Radial Lines

<p class="description">Use radial line charts to show trends along periodic values.</p>

## Basics

The `RadialLineChart` component accepts `series`, `rotationAxis`, and `radiusAxis` props to render data in polar coordinates.

{{"demo": "BasicRadialLineChart.js", "bg": "outline"}}

## Highlight

Like other series, the radial line series has a `highlightScope` property that accepts an object with `highlight` and `fade` properties.

{{"demo": "ElementHighlights.js", "bg": "outline"}}

## Radial grid

Similarly to the `ChartsGrid` we provide a `ChartsRadialGrid` for radial coordinates

{{"demo": "RadialGridPlayground.js", "hideToolbar": true, "bg": "playground"}}
