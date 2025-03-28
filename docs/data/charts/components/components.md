---
title: Charts - Custom components
productId: x-charts
components: ChartsClipPath, ChartsSurface
---

# Charts - Custom components

<p class="description">Creating custom chart components is made easier by hooks.</p>

## Interact with dimensions

### Drawing area

Charts dimensions are defined by a few props:

- `height` and `width` for the `<svg />` size. If not provided, those values are derived from the container.
- `margin` for adding space between the `<svg />` border and the **drawing area**.

The term **drawing area** refers to the space available to plot data (scatter points, lines, or pie arcs).
The `margin` is used to leave some space for extra elements, such as the axes, the legend, or the title.

You can use the `useDrawingArea()` hook in the charts subcomponents to get the coordinates of the **drawing area**.

```jsx
import { useDrawingArea } from '@mui/x-charts';

const { left, top, width, height } = useDrawingArea();
```

{{"demo": "BasicScaleDemo.js"}}

### Scales

Some charts, such as line, bar, and scatter do a mapping between their series' data and the SVG coordinates.

For example, a line chart series with a value of 36,725$ on the 6th of December 2022 could be mapped to coordinates (628, 514).
This operation can be reversed.
Coordinate with x=628 would be associated with the 6th of December 2022 and y=514 would be associated with value 36,725$.

Those mappings depend on the dimensions of the SVG and the drawing area.
It also depends on the [axes' properties](/x/react-charts/axis/) such as the scale (linear, log, square root) and min/max values.

All that data is available in the [`d3-scale` objects](https://github.com/d3/d3-scale).

You can use `useXScale()` and `useYScale()` to access those scales.
Both accept either:

- a number to select the index of the axis to select.
- a string to select an axis by its id.

The scale object is generated such that it maps values to SVG coordinates.
You don't need extra work to take into account the drawing area.

#### Value to coordinate

The `d3-scale` default method maps from values to coordinates.
For example, you can get the `x=0` coordinate as follows:

```jsx
const xAxisScale = useXScale(); // get the default X scale
const xOrigin = xAxisScale(0);
```

{{"demo": "OriginDemo.js"}}

#### Coordinate to value

The `d3-scale` object allows you to convert a coordinate to a data value with the `invert` method.

The next example contains two lines drawn using different y-axes.
By using `invert`, the value associated with the current mouse coordinate `y` can be resolved as follows:

```jsx
<text>{leftAxisScale.invert(yCoordinate).toFixed(0)}</text>
```

{{"demo": "ScaleDemo.js"}}

### Series

Series information is accessible through the `useSeries` hook for all series types, and `useXxxSeries` hook for a specific series type.
These hooks return the order of the series and their configuration, including data points, color, among others.

You can leverage that information to create custom charts.
For example, you can use `useLineSeries` to obtain the series of a line chart and display an indicator of the minimum and maximum values of each series:

{{"demo": "SeriesDemo.js"}}

### Animation

Some elements of charts are animated, such as the bars in a bar chart or the slices in a pie chart.

Charts use CSS animations when possible, but some animations can't be done using CSS only. In those cases, JavaScript is used to animate elements.

The animations of elements that are animated using CSS can be customized by overriding the CSS classes:

{{"demo": "CSSAnimationCustomization.js"}}

When it isn't possible to leverage CSS animations, the default components are animated using custom hooks.

If you want to use the default animations in custom components, you can use these hooks.
They are available for each element that is animated using JavaScript and are prefixed with `useAnimate`.
The following hooks are available:

- `useAnimateArea`;
- `useAnimateBar`;
- `useAnimateBarLabel`;
- `useAnimateLine`;
- `useAnimatePieArc`;
- `useAnimatePieArcLabel`.

{{"demo": "JSDefaultAnimation.js"}}

You can also use the `useAnimate` hook, in case you want to customize the default animations.
In the example below, labels are positioned above the bars they refer to and are animated using the `useAnimation` hook:

{{"demo": "JSAnimationCustomization.js"}}

Alternatively, you can use your own animation library to create custom animations, such as React Spring:

{{"demo": "ReactSpringAnimationCustomization.js"}}

Note that sometimes JavaScript animation libraries cause performance issues, especially when rendering many data points or when interactions are enabled (e.g., zoom, highlight).

## HTML components

With the introduction of the `ChartDataProvider` in v8, the chart data can be accessed from any component.
This allows you to create HTML components that interact with the charts data.

In the next example, notice that `MyCustomLegend` component displays the series names and colors.
This creates an html `table` element, which can be customized in any way.

{{"demo": "HtmlLegend.js"}}

:::warning
Note that the HTML components are not part of the SVG hierarchy.
Hence, they should be:

- Outside the `<ChartsSurface />` component to avoid mixing HTML and SVG.
- Inside the `<ChartDataProvider />` component to get access to the data.

:::
