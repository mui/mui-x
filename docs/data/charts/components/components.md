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

We call **drawing area** the space available to plot data (scatter points, lines, or pie arcs).
The `margin` is used to leave some space for extra elements, such as the axes, the legend, or the title.

You can use `useDrawingArea` hook into charts subcomponents to get the coordinate of the **drawing area**.

```jsx
import { useDrawingArea } from '@mui/x-charts';

const { left, top, width, height } = useDrawingArea();
```

### Scales

Some charts, such as line, bar, and scatter do a mapping between their data and the drawing coordinates.
This mapping is defined by [axes' properties](/x/react-charts/axis/) and represented by [`d3-scale` objects](https://github.com/d3/d3-scale).

You can use `useXScale()` and `useYScale()` to get access to those scales.
They both accept either a number to select the index of the axis to select.
Or a string to select an axis by its id.

