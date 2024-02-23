---
title: React Scatter chart
productId: x-charts
components: Scatter, ScatterChart, ScatterPlot, ChartsVoronoiHandler, ChartsGrid
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

### Grid

You can add a grid in the background of the chart with the `grid` prop.

See [Axis—Grid](/x/react-charts/axis/#grid) documentation for more information.

{{"demo": "GridDemo.js"}}

### CSS 🚧

### Shape 🚧

### Size 🚧
