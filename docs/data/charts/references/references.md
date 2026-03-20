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

{{"demo": "ReferenceOverview.js"}}

## Reference line

The `<ChartsReferenceLine />` component draws a horizontal or vertical line at a given value.
Common use cases include marking thresholds, averages, or targets.

Provide an `x` prop for a vertical line or a `y` prop for a horizontal line.

:::info
When a chart has multiple axes, use the `axisId` prop to specify which axis the reference value belongs to.
By default, it targets the first defined axis.
:::

{{"demo": "ReferenceLineBasic.js"}}

### Label

You can add a `label` prop to display text alongside the reference line.
Position it with the `labelAlign` prop, which accepts `'start'`, `'middle'` (default), and `'end'`.

{{"demo": "ReferenceLineLabel.js"}}

### Styling

Use the `lineStyle` and `labelStyle` props to customize the appearance of the line and its label.
For example, you can create a dashed line with `lineStyle={{ strokeDasharray: '10 5' }}`.

{{"demo": "ReferenceLineStyled.js"}}

## Reference area

The next demo shows the implementation of a reference area between points (x1, y1) and (x2, y2).

Coordinates can either be axis values, or `'start'`/`'end'` to extend the area to the min or max of the axis domain.
Omitted coordinates also default to the full axis range.

For customization, use the associated `useReferenceArea()` which returns the coordinates of the rectangle.
This allows for example adding some labels to the area.

Notice the usage of composition to be able to put the reference area below the plots

{{"demo": "ReferenceAreaBasic.js"}}

## Reference point

With the same logic as the previous section, you can highlight specific point in the chart.

{{"demo": "ReferencePointBasic.js"}}
