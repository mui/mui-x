---
title: Charts - Reference elements
productId: x-charts
components: ChartsReferenceLine
---

# Charts - Reference elements

<p class="description">Add visual markers to add extra context to your charts.</p>

Reference elements are visual markers overlaid on charts to draw attention to notable data values.
They help users interpret data by providing context such as thresholds, target values, acceptable ranges, or specific data points of interest.

There are three types of reference elements:

- **Reference line**: A line drawn across the chart at a specific value on an axis.
- **Reference area**: A shaded region between two values on an axis.
- **Reference point**: A marker placed at a specific coordinate.

## Reference line

The `<ChartsReferenceLine />` component draws a horizontal or vertical line at a given value.
Common use cases include marking thresholds, averages, or targets.

Provide an `x` prop for a vertical line or a `y` prop for a horizontal line.

{{"demo": "ReferenceLineBasic.js"}}

### Label

You can add a `label` prop to display text alongside the reference line.
Position it with the `labelAlign` prop, which accepts `'start'`, `'middle'` (default), and `'end'`.

{{"demo": "ReferenceLineLabel.js"}}

### Styling

Use the `lineStyle` and `labelStyle` props to customize the appearance of the line and its label.
For example, you can create a dashed line with `lineStyle={{ strokeDasharray: '10 5' }}`.

{{"demo": "ReferenceLineStyled.js"}}

### Axis targeting

When a chart has multiple axes, use the `axisId` prop to specify which axis the reference value belongs to.
By default, it targets the first defined axis.

## Reference area 🧪

:::warning
The reference area component is not yet available.
This section describes the planned API.
:::

The reference area highlights a range between two values, creating a shaded region on the chart.
This is useful for indicating acceptable ranges, confidence intervals, or notable regions.

{{"demo": "ReferenceAreaBasic.js"}}

## Reference point 🧪

:::warning
The reference point component is not yet available.
This section describes the planned API.
:::

The reference point places a marker at a specific (x, y) coordinate on the chart.
This is useful for highlighting outliers, key milestones, or specific data values.

{{"demo": "ReferencePointBasic.js"}}
