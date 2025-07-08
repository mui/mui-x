---
title: React Pyramid chart
productId: x-charts
components: FunnelChart, FunnelPlot
---

# Charts - Pyramid [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')🧪

<p class="description">The pyramid chart is a variation of the funnel chart.</p>

:::info
This feature is in preview. It is ready for production use, but its API, visuals and behavior may change in future minor or patch releases.
:::

## Pyramid Chart

To create a pyramid chart, set the `curve` property to `pyramid` in the series.

{{"demo": "Pyramid.js"}}

## Direction

The pyramid automatically changes its direction based on the provided data. If the values are sorted in ascending order, the pyramid will be inverted.
If the values are sorted in descending order, the pyramid will be upright.

In order to manually control the direction of the pyramid, the `funnelDirection` property can be set to either `increasing` or `decreasing`.
This is useful when the data is not sorted, or when you want to enforce a specific direction regardless of the data order, like in the below example where an upright pyramid is required to show income levels.

{{"demo": "PyramidInverted.js"}}

## Segments

By default, the pyramid chart creates segments with the same height. To make the segments proportional to the values, set `categoryAxis.scaleType` to `linear`.
This will adjust the height of each segment based on the value it represents.

{{"demo": "PyramidSegmentLinear.js"}}

## Styling

A pyramid chart can be styled in all the same ways as the [funnel chart](/x/react-charts/funnel/#styling).

{{"demo": "PyramidPlayground.js"}}
