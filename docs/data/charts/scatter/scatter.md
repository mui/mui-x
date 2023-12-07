---
title: React Scatter chart
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

## Styling

### CSS 🚧

### Shape 🚧

### Size 🚧
