---
title: React Pie chart
productId: x-charts
components: PieArc, PieArcLabel, PieArcLabelPlot, PieArcPlot, PieChart, PiePlot
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
- `arcLabelRadius` The radius between the center and the arc label.
- `paddingAngle` The angle (in degrees) between two arcs.
- `cornerRadius` Similar to the CSS `border-radius`.
- `startAngle`/`endAngle` The angle range of the pie chart. Values are given in degrees.
- `cx`/`cy` The center of the pie charts. By default the middle of the drawing area.

{{"demo": "PieShapeNoSnap.js", "hideToolbar": true, "bg": "playground"}}

The following properties accept percentage string (for example `'50%'`).

- `innerRadius`/`outerRadius`/`arcLabelRadius` with `'100%'` equivalent to maximal radius fitting in the drawing area.
- `cx`, `cy` with `'100%'` equivalent to the drawing area width/height.

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

## Click event

Pie Chart provides an `onItemClick` handler for handling clicks on specific pie arcs.
It has the following signature.

```js
const onItemClick = (
  event, // The mouse event.
  params, // An object that identifies the clicked element.
) => {};
```

{{"demo": "PieClickNoSnap.js"}}

## Animation

To skip animation at the creation and update of your chart you can use the `skipAnimation` prop.
When set to `true` it skips animation powered by `@react-spring/web`.

Charts containers already use the `useReducedMotion` from `@react-spring/web` to skip animation [according to user preferences](https://react-spring.dev/docs/utilities/use-reduced-motion#why-is-it-important).

```jsx
// For a single component chart
<PieChart skipAnimation />

// For a composed chart
<ResponsiveChartContainer>
  <PiePlot skipAnimation />
</ResponsiveChartContainer>
```

{{"demo": "PieAnimation.js"}}
