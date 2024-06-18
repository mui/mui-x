---
title: React Heatmap chart
productId: x-charts
---

# Charts - Heatmap [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')🚧

<p class="description">Heatmap charts allow to highlight correlation between categories.</p>

:::warning
The Heatmap Chart component isn't stable. Don't hesitate to open issues to give feedback.
:::

## Basics

The Heatmap requires two axes with `data` properties.
Those data defined the x and y categories.

The series `data` is an array of 3-tuples.
The 2 first numbers are respectively the x and y indexes of the cell.
And the third is its value.

{{"demo": "BasicHeatmap.js"}}

## Customization

### Color mapping

To customize the color mapping, use the `zAxis` configuration.
You can either use the piecewise or continuous [color mapping](https://mui.com/x/react-charts/styling/#values-color).

{{"demo": "ColorConfig.js"}}

### Highlight 🚧

Is this a disco dancefloor? 🕺🪩

Planned work:

- Add a way to override the styling. I woudl be in favor of adding a CSS classes instead of using styled component with ownerState, to let user apply filters on top of the current color, but they could not do crazy thing like complete color modification. They would need to use slots for that
- Adding an other highlight scopes: `x-axis`, `y-axis`, and `xy-axis`

{{"demo": "HighlightHeatmap.js"}}

### Axes

The Heatmap axes can be customized like any other chart axis.
The available options are available in the [dedicated page](/x/react-charts/axis/#axis-customization).

### Tooltip 🚧

## Legend 🚧

## Labels 🚧
