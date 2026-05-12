---
title: React Radial axes
productId: x-charts
components: ChartsRadialDataProvider, ChartsRadialGrid, ChartsRadiusAxis, ChartsRotationAxis, ChartsRadialAxisHighlight
---

# Charts - Radial axes

<p class="description">Display grid and axes in radial coordinates.</p>

## Radial grid 🧪

:::info
This feature is in preview. It is ready for production use, but its API, visuals and behavior may change in future minor or patch releases.
:::

Similarly to the `ChartsGrid` we provide a `ChartsRadialGrid` for radial coordinates.

This component accepts two boolean props `rotation` and `radius` to display grid lines corresponding to the rotation and radius axis.

Use the `chartsRadialGridClasses` to modify the style of this component.

{{"demo": "RadialGridPlayground.js", "hideToolbar": true, "bg": "playground"}}

## Axes

The radial charts have two axis components.
The `ChartsRadiusAxis` and `ChartsRotationAxis`.

They both use the classes from `chartsRadialAxisClasses`.
To distinguish radius axis from the rotation axis, use the `chartsRadialAxisClasses.rotation` or `chartsRadialAxisClasses.radius` classes. They are applied at the root of the component.

```ts
[`.${chartsRadialAxisClasses.tick} `]: { /* Modify all ticks */ },
[`.${chartsRadialAxisClasses.radius} .${chartsRadialAxisClasses.tick} `]: { /* Modify only ticks from the radius axis */ },
```

### Radius axis

The `ChartsRadiusAxis` component renders tick labels along a radius direction.

The axis `position` prop defines the angle at which the axis is displayed.
It can be set to

- `'start'`: Place the axis at the `startAngle` of the rotation axis.
- `'end'`: Place the axis at the `endAngle` of the rotation axis.
- `number`: The angle in degree where to plot the axis.

{{"demo": "RadiusAxisPlayground.js", "hideToolbar": true, "bg": "playground"}}

### Rotation axis

The `ChartsRotationAxis` component renders an arc along the rotation axis with tick marks and labels.

The axis `position` prop defines the angle at which the axis is displayed.
It can be set to

- `'outside'`: Place the axis at the `maxRadius` of the radius axis. Places labels and ticks outside by default.
- `'inside'`: Place the axis at the `minRadius` of the radius axis. Places labels and ticks inside by default.

{{"demo": "RotationAxisPlayground.js", "hideToolbar": true, "bg": "playground"}}

## Axis highlight

Highlight data based on mouse position.
It can be displayed either as a dashed line, or as a band.

To customize this behavior, use the `axisHighlight` prop:

```jsx
axisHighlight={{
  rotation: 'line', // Or 'none', or 'band'
  radius: 'line', // Or 'none', or 'band'
}}
```

Or the component when using composition:

```jsx
<ChartsRadialAxisHighlight
  rotation="line" // Or 'none', or 'band'
  radius="line" // Or 'none', or 'band'
/>
```

{{"demo": "BandHighlight.js", "bg": "outline"}}
