---
title: React Pyramid chart
productId: x-charts
components: FunnelChart, FunnelPlot
---

# Charts - Pyramid [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">The pyramid chart is a variation of the funnel chart.</p>

## Guidelines

Pyramid charts are ideal for visualizing hierarchical data or showing how quantities build up through progressive levels, making them perfect for displaying demographic data, organizational structures, or any data that naturally forms a pyramid shape.

- **Hierarchical visualization**: Perfect for showing data with natural hierarchical relationships
- **Population analysis**: Ideal for age demographics, organizational levels, or skill distributions
- **Foundation-to-peak progression**: Show how smaller segments build toward a larger base or peak
- **Comparative hierarchy**: Compare different pyramid structures side by side

**When to use pyramid charts:**

- Your data has a natural hierarchical or layered structure
- You want to show how smaller categories contribute to larger ones
- You're displaying demographic data (age pyramids, population distribution)
- You need to visualize organizational hierarchies or skill levels
- The pyramid metaphor helps communicate your data story

**Data requirements:**

- Hierarchical or layered categorical data
- Positive numerical values with meaningful relationships between levels
- Natural ordering from base to peak (or vice versa)
- Works best with 3-7 levels for clarity
- Clear labels that convey the hierarchical relationship

**Choose pyramid charts when:** your data naturally forms a pyramid structure, you're showing demographic distributions, organizational hierarchies, or when the pyramid shape adds meaning to your data presentation.

**Direction matters:** Use ascending pyramids for growth/building concepts, descending for filtering/reduction concepts. Consider **proportional segments** when relative sizes within levels are important.

## Pyramid Chart

To create a pyramid chart, set the `curve` property to `pyramid` in the series.

{{"demo": "Pyramid.js"}}

## Direction

The pyramid automatically changes its direction based on the provided data. If the values are sorted in ascending order, the pyramid is drawn upright.
If the values are sorted in descending order, the pyramid is drawn upside-down.

In order to manually control the direction of the pyramid, the `funnelDirection` property can be set to either `increasing` or `decreasing`.

This is useful when the data is not sorted, or when you want to enforce a specific direction regardless of the data order.

{{"demo": "PyramidDirection.js"}}

## Segments

By default, the pyramid chart creates segments with the same height. To make the segments proportional to the values, set `categoryAxis.scaleType` to `linear`.
This adjusts the height of each segment based on the value it represents.

{{"demo": "PyramidSegmentLinear.js"}}

## Styling

A pyramid chart can be styled in all the same ways as the [funnel chart](/x/react-charts/funnel/#styling).

{{"demo": "PyramidPlayground.js"}}
