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

It can also be moved by the property `position: { vertical, horizontal }` which defines how the legend aligns into the SVG.

- `vertical` can be `'top'`, `'middle'`, or `'bottom'`.
- `horizontal` can be `'left'`, `'middle'`, or `'right'`.

From a given `position`, you can add some space with `padding` which can either be a number, or an object `{ top, bottom, left, right }`.
This `padding` will add space between the SVG borders and the legend.

Defaults are such that the legend is placed on top of the charts.

{{"demo": "LegendPositionNoSnap.js", "hideToolbar": true, "bg": "inline"}}

### Dimensions

Inside the legend, the mark can be customized with `itemMarkWidth` and `itemMarkHeight` which are the width/height in pixels.

You also have access to the `markGap` which is the gap between the mark and its label given in pixels.
And `itemGap` which is the gap between two legend items.

### Label styling

To break line in legend labels, use the special character `\n`.

To customize its style, you should not use CSS. Instead pass a styling object to the `labelStyle` property.

The `labelStyle` property is needed to measure text size, and then place legend items at the correct position.
