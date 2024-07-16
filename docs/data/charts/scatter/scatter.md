---
title: React Scatter chart
productId: x-charts
components: ScatterChart, ScatterChartPro, ScatterPlot, ChartsVoronoiHandler, ChartsGrid
---

# Charts - Scatter

<p class="description">Scatter charts express the relation between two variables, using points in a surface.</p>

## Basics

Scatter chart series should contain a `data` property containing an array of objects.
Those objects require `x`, `y`, and `id` properties.

{{"demo": "BasicScatter.js"}}

## Interaction

Since scatter elements can be small, interactions do not require hovering exactly over an element.
When the pointer is in the drawing area, the closest scatter element will be used for interactions (tooltip or highlights).
To do so, the chart computes [Voronoi cells](https://en.wikipedia.org/wiki/Voronoi_diagram) which map the pointer position to the closest element.

You can define a maximal radius with the `voronoiMaxRadius` prop.
If the distance with the pointer is larger than this radius, no item will be selected.
Or set the `disableVoronoi` prop to `true` to trigger interactions only when hovering exactly over an element instead of Voronoi cells.

{{"demo": "VoronoiInteraction.js"}}

To use this feature with composition, add the `ChartsVoronoiHandler`.

```jsx
<ChartsVoronoiHandler voronoiMaxRadius={50} />
```

## Click event

Scatter Chart provides an `onItemClick` handler for handling clicks on specific scatter items.
It has the following signature.

```js
const onItemClick = (
  event, // The mouse event.
  params, // An object that identifies the clicked elements.
) => {};
```

{{"demo": "ScatterClickNoSnap.js"}}

If `disableVoronoi=true`, users need to click precisely on the scatter element, and the mouse event will come from this element.

Otherwise, the click behavior will be the same as defined in the [interaction section](#interaction) and the mouse event will come from the svg component.

## Styling

### Color scale

As with other charts, you can modify the [series color](/x/react-charts/styling/#colors) either directly, or with the color palette.

You can also modify the color by using axes `colorMap` which maps values to colors.
The scatter charts use by priority:

1. The z-axis color
2. The y-axis color
3. The x-axis color
4. The series color

:::info
The z-axis is a third axis that allows to customize scatter points independently from their position.
It can be provided with `zAxis` props.

The value to map can either come from the `z` property of series data, or from the zAxis data.
Here are three ways to set z value to 5.

```jsx
<ScatterChart
  // First option
  series={[{ data: [{ id: 0, x: 1, y: 1, z: 5 }] }]}
  // Second option
  zAxis={[{ data: [5] }]}
  // Third option
  dataset={[{ price: 5 }]}
  zAxis={[{ dataKey: 'price' }]}
/>
```

:::

Learn more about the `colorMap` properties in the [Styling docs](/x/react-charts/styling/#values-color).

{{"demo": "ColorScale.js"}}

### Grid

You can add a grid in the background of the chart with the `grid` prop.

See [Axis—Grid](/x/react-charts/axis/#grid) documentation for more information.

{{"demo": "GridDemo.js"}}

### CSS 🚧

### Shape 🚧

### Size 🚧
