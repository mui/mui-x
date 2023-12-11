---
title: Charts - Legend
---

# Charts - Legend

<p class="description">Legend is the UI element mapping symbols and colors to the series' label.</p>

## Basic display

In chart components, the legend links series with `label` properties and their color.

{{"demo": "BasicLegend.js"}}

## Customization

### Position

The legend can either be displayed in a `'column'` or `'row'` layout controlled with the `direction` property.

It can also be moved with the `position: { vertical, horizontal }` property which defines how the legend aligns within the SVG.

- `vertical` can be `'top'`, `'middle'`, or `'bottom'`.
- `horizontal` can be `'left'`, `'middle'`, or `'right'`.

You can add spacing to a given `position` with the `padding` property, which can be either a number or an object `{ top, bottom, left, right }`.
This `padding` will add space between the SVG borders and the legend.

By default, the legend is placed above the charts.

{{"demo": "LegendPositionNoSnap.js", "hideToolbar": true, "bg": "playground"}}

### Hiding

You can hide the legend with the property `slotProps.legend.hidden`.

{{"demo": "HiddenLegend.js"}}

### Dimensions

Inside the legend, you can customize the pixel value of the width and height of the mark with the `itemMarkWidth` and `itemMarkHeight` props.

You can also access the `markGap` prop to change the gap between the mark and its label, or the `itemGap` to change the gap between two legend items.
Both props impact the values defined in pixels.

{{"demo": "LegendDimensionNoSnap.js", "hideToolbar": true, "bg": "playground"}}

### Label styling

To break lines in legend labels, use the special `\n` character. To customize the label style, you should not use CSS.
Instead, pass a styling object to the `labelStyle` property.

{{"demo": "LegendTextStylingNoSnap.js", "hideToolbar": true, "bg": "playground"}}

:::info
The `labelStyle` property is needed to measure text size, and then place legend items at the correct position.
Style applied by other means will not be taken into account.
Which can lead to label overflow.
:::
