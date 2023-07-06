---
title: Charts - Custom components
---

# Charts - Custom components

<p class="description">Creating custom charts components can be simplified with some data manager.</p>

## Introduction to scale

### Drawing area

Charts dimensions are defined by a few props:

- `height` and `width` for the `<svg />` size. If not provided those values are derived from the container.
- `margin` for adding space between the `<svg />` border and the **drawing area**.

The term **drawing area** refers to the space available to plot data (scatter points, lines, or pie arcs).
The `margin` is used to leave some space for extra elements, such as the axes, the legend, or the title.

You can use `useDrawingArea` hook into charts subcomponents to get the coordinate of the **drawing area**.

```jsx
import { useDrawingArea } from '@mui/x-charts';

const { left, top, width, height } = useDrawingArea();
```

{{"demo": "BasicBarDemo.js"}}

### Scales

Some charts, such as line, bar, and scatter do a mapping between their series' data and the SVG coordinates.

For example, a line chart series with a value of 36,725$ on the 6th of December 2022 could be mapped to coordinates (628, 514).
And you can revert the operation.
Coordinate with x=628 would be associated with the 6th of December 2022 and those with y=514 would be associated with value 36,725$.

Those mappings depend on the dimensions of the SVG and the drawing area.
It also depends on the [axes' properties](/x/react-charts/axis/) such as the scale (linear, log, square root) and min/max values.

All those data are available in the [`d3-scale` objects](https://github.com/d3/d3-scale).

You can use `useXScale()` and `useYScale()` to access those scales.
Both accept either:

- a number to select the index of the axis to select.
- a string to select an axis by its id.

The scale object is generated such that they map values to SVG coordinates.
You don't need extra work to take into account the drawing area.

#### Value to coordinate

The `d3-scale` default method map from values to coordinates.
For example, you can get the `x=0` coordinate as follow:

```jsx
const xAxisScale = useXScale(); // get the default X scale
const xOrigine = xAxisScale(0);
```

{{"demo": "OrigineDemo.js"}}

#### Coordinate to value

The `d3-scale` object allows you to convert a coordinate to a data value with the `invert` method.

The next example contains two lines drawn using different y-axes.
By using `invert`, the value associated to the current mouse coordinate `y` can be recovered as follow:

```jsx
<text>{leftAxisScale.invert(yCoordinate).toFixed(0)}</text>
```

{{"demo": "ScaleDemo.js"}}
