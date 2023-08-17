---
title: Charts - Pie
---

# Charts - Pie

<p class="description">Pie charts express portions of a whole, using arcs or angles within a circle.</p>

## Basics

To plot a pie chart, a series must have a data property containing an array of objects.
Those objects should contain a property `value`.
They can also have a `label` property.

If you plan to update/reorder those data, you should add an `id` property which is used for `key` props.

{{"demo": "BasicPie.js"}}

## Colors

The pie colors can be customized in two ways.

1. You can provide a [color palette](/x/react-charts/styling/#color-palette). Each arc of the pie will be colored according to this palette.
2. You can provide a `color` property in `data` objects which overrides the palette.

```jsx
<PieChart
  colors={['red', 'blue', 'green']} // Use palette
  series={[
    {
      data: [
        { value: 10, color: 'orange' }, // Use color property
        // ...
      ],
    },
  ]}
/>
```

{{"demo": "PieColor.js"}}

## Sizing

Pie series shape is described by multiple properties:

- `innerRadius` The radius between the center and the beginning of the arc. The default is set to 0.
- `outerRadius` The radius between the center and the end of the arc. The default is the largest value available in the drawing area.
- `paddingAngle` The angle (in degrees) between two arcs.
- `cornerRadius` Similar to the CSS `border-radius`.
- `startAngle`/`endAngle` The angle range of the pie chart. Values are given in degrees.
- `cx`/`cy` The center of the pie charts. By default the middle of the drawing area.

{{"demo": "PieShapeNoSnap.js", "hideToolbar": true, "bg": "inline"}}

## Labels

You can display labels on the arcs.
To do so, the series should get `arcLabel` property.
It can either get a function that gets the object associated with the arc and returns the label.
Or you can pass one of the following values:

- `'value'` display the raw value of the arc.
- `'formattedValue'` display the returned value of `valueFormatter` for the arc.
- `'label'` display the `label` property of the arc if provided.

To avoid displaying labels on small arcs, you can provide `arcLabelMinAngle` property.
Arcs with angles smaller than the value (in deg) will not have labels.

{{"demo": "PieArcLabel.js"}}

## Highlight

Pie series can get `highlightScope` property to manage element highlighting.
Its behavior is described in the [dedicated page](/x/react-charts/tooltip/#highlighting-series).

When elements are highlighted or faded they can be customized with dedicated CSS classes: `.MuiPieArc-faded` and `.MuiPieArc-highlighted`.

CSS is well suited to modify the `color`, `stroke-width`, or `opacity`.
However, to modify the size of a pie arc, you must use the `highlighted` and `faded` properties, with which you can override any of the properties `innerRadius`, `outerRadius`, and `cornerRadius` when an arc is highlighted or faded.

If you do not want to provide absolute values, you can use `additionalRadius` which will be added to the `outerRadius`.
This value can be negative to reduce arc size.

{{"demo": "PieActiveArc.js"}}
