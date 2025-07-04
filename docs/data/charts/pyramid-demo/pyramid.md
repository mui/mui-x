---
title: Charts - Pyramid demonstration
productId: x-charts
components: FunnelChart, FunnelPlot
---

# Charts - Pyramid demonstration

<p class="description">This page demonstrates the pyramid chart.</p>

## Pyramid Chart

The pyramid chart is a variation of the funnel chart.

To create a pyramid chart, set the `curve` property to `pyramid` in the series.

{{"demo": "Pyramid.js"}}

Based on the order of the data items, the pyramid chart can be inverted. Also by default, the sections have the same size because they use the band scale type. A linear scale, is also available, and will scale the the sections based on their value. To do so, set the `scaleType` property to `linear` in the `categoryAxis`.

{{"demo": "PyramidInverted.js"}}

### Styling

A pyramid chart can be styled using `layout`, `gap`, `borderRadius`, `variant` and `curve` properties.

{{"demo": "PyramidPlayground.js"}}
