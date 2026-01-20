---
title: Charts - Styling
productId: x-charts
---

# Charts - Styling

<p class="description">Customize chart appearance, colors, and styling.</p>

This page covers how to customize chart colors, including series colors, color palettes, and value-based color mapping.
It also explains how to customize overlays, chart sizing and placement, CSS styling, and advanced features like gradients and patterns.

## Colors

### Series color

You can set a `color` property on a chart's series.
This is the base color used to render its components.

```jsx
<LineChart series={[{ ..., color: '#fdb462'}]} />
```

{{"demo": "BasicColor.js"}}

### Built-in color palettes

The library provides three built-in color palettes to automatically assign colors to series.
If a series doesn't have a `color` prop, the chart assigns a color based on the series' index.

You can set a custom color palette using the `colors` prop on chart components (or `ChartContainer` when composing a custom component).
You can pass an array of colors, or a callback whose input is the theme's mode (`'dark'` or `'light'`) and returns the array of colors.

{{"demo": "MuiColorTemplate.js"}}

### Custom color palettes

You can generate custom color palettes using [d3-scale-chromatic](https://observablehq.com/@d3/color-schemes) or any color manipulation library you prefer.

The example below shows the d3 Categorical color palette.

{{"demo": "ColorTemplate.js"}}

### Value-based colors

You can set colors according to item values using the `colorMap` property of the corresponding axis.

See the dedicated documentation sections for each chart component to learn more about this feature:

- [Bar charts](/x/react-charts/bars/#color-scale)
- [Line charts](/x/react-charts/lines/#color-scale)
- [Scatter charts](/x/react-charts/scatter/#color-scale)

The `colorMap` property accepts three kinds of objects for color maps: piecewise, continuous, and ordinal.

#### Piecewise color map

You can configure a piecewise color map with an array of _n_ `thresholds` values and _n+1_ `colors`.

```ts
{
  type: 'piecewise';
  thresholds: Value[];
  colors: string[];
}
```

#### Continuous color map

The continuous configuration lets you map values from `min` to `max` properties to their corresponding colors.

The `color` property can be either an array of two colors to interpolate, or an interpolation function that returns a color corresponding to a number _t_ with a value between 0 and 1.
The [d3-scale-chromatic](https://d3js.org/d3-scale-chromatic) library provides many of these functions.

Values lower than `min` get the color of the `min` value.
Similarly, values higher than `max` get the color of the `max` value.
By default, the `min`-`max` range is 0-100.

```ts
{
  type: 'continuous';
  min?: Value;
  max?: Value;
  color: [string, string] | ((t: number) => string);
}
```

#### Ordinal color map

You can configure an ordinal color map with two properties—`values` and `colors`—which map those values to their respective colors.

If a value isn't defined, it falls back to `unknownColor`.
If `unknownColor` is also undefined, it falls back to the series color.

You can use this configuration in bar charts to set colors according to string categories.

```ts
{
  type: 'ordinal';
  values: Value[];
  colors: string[];
  unknownColor?: string;
}
```

### Color callback

If you need more control over the color assignment, you can provide a `colorGetter()` callback prop to the chart component.
The callback function receives a `{ value, dataIndex }` object and should return a color string for the provided data point.

In components where a series-level color is required (for example, the legend), the `color` prop is used instead.

{{"demo": "ColorCallback.js"}}

## Overlay

Charts have built-in overlays for loading and "no data" states that appear when the `loading` prop is `true` and when there is no data to display, respectively.

{{"demo": "Overlay.js"}}

### Axis display

You can provide axis data to display axes while loading the data.

{{"demo": "OverlayWithAxis.js"}}

### Custom overlay

To modify the default overlay message or translate it, use the `noData` or `loading` key with your [preferred locale](/x/react-charts/localization/).

```jsx
<BarChart
  localeText={{
    loading: 'Data should be available soon.',
    noData: 'Select some data to display.',
  }}
/>
```

For more advanced customization, use the `loadingOverlay` and `noDataOverlay` slots as shown in the demo below.

{{"demo": "CustomOverlay.js"}}

## Styling

### Size

Charts adapt their sizing to fill their parent element by default.
You can modify this behavior by providing `height` and/or `width` props.

These props set the chart's size to the given value (in `px`).

### Placement

When defining the placement of a chart, consider both the margin and the axis size:

- Margin: The space between the SVG border and the axis or drawing area
- Axis size: The space taken by the [axis](/x/react-charts/axis/#position); each axis has its own size

Axes have a default size.
You can update it using the `xAxis` and `yAxis` configuration:

- `x-axis`: Uses the `height` prop to define the space taken by the axis
- `y-axis`: Uses the `width` prop instead

Axes only take up space on the side where they are positioned.
If an axis is not displayed (`position: 'none'`), it does not take up any space, regardless of its size.

{{"demo": "Margin.js", "hideToolbar": true, "bg": "playground"}}

### CSS

Charts use SVG for rendering, so you can customize them using the `sx` prop and target any subcomponents using their class names.

{{"demo": "SxStyling.js"}}

### Drawing area background

To set a background color in the drawing area, create an SVG `<rect>` element.
This is only possible when [composing custom charts](/x/react-charts/composition/) because you must place this new component before all plot components.

The demo below defines a basic `Background` component that adds a light gray background.

{{"demo": "BackgroundStyling.js"}}

### Gradients and patterns

You can use gradients and patterns to fill charts by passing gradient or pattern definitions as children of the chart component.

Gradients or patterns defined this way are only usable for SVG.
A direct definition like `color: "url(#Pattern)"` causes undefined colors in HTML elements.

{{"demo": "GradientTooltip.js"}}
