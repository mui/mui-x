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

Since scatter element can be small, interaction do not require to hover elements.
By default when mouse is in the drawing area, the closest element will be used for interactions (tooltip, or highlights).

To limit this behavior, you define a maximal radius with prop `voronoiMaxRadius`.
If the distance with the mouse is larger than this radius, no item will be selected.
Or set `disableVoronoi` prop to true to only interact with hover events.

{{"demo": "VoronoiInteraction.js"}}

To use this feature with composition, add the ChartsVoronoiHandler.

```jsx
<ChartsVoronoiHandler voronoiMaxRadius={50} />
```

## Styling

### CSS 🚧

### Shape 🚧

### Size 🚧
