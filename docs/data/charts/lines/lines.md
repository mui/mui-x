---
title: React Line chart
productId: x-charts
components: LineChart, LineChartPro, LineElement, LineHighlightElement, LineHighlightPlot, LinePlot, MarkElement, MarkPlot, AreaElement, AreaPlot, AnimatedLine, AnimatedArea, ChartsOnAxisClickHandler, ChartsGrid
---

# Charts - Lines

<p class="description">Line charts can express qualities about data, such as hierarchy, highlights, and comparisons.</p>

## Basics

### Data format

To plot lines, a series must have a `data` property containing an array of numbers.
This `data` array corresponds to y values.

By default, those y values will be associated with integers starting from 0 (0, 1, 2, 3, ...).
To modify the x values, you should provide a `xAxis` with data property.

{{"demo": "BasicLineChart.js"}}

### Using a dataset

If your data is stored in an array of objects, you can use the `dataset` helper prop.
It accepts an array of objects such as `dataset={[{x: 1, y: 32}, {x: 2, y: 41}, ...]}`.

You can reuse this data when defining the series and axis, thanks to the `dataKey` property.

For example `xAxis={[{ dataKey: 'x'}]}` or `series={[{ dataKey: 'y'}]}`.

Here is a plot of the evolution of world electricity production by source.

{{"demo": "LineDataset.js"}}

### Area

You can fill the area of the line by setting the series' `area` property to `true`.

{{"demo": "BasicArea.js"}}

## Stacking

Each line series can get a `stack` property which expects a string value.
Series with the same `stack` will be stacked on top of each other.

{{"demo": "StackedAreas.js"}}

### Stacking strategy

You can use the `stackOffset` and `stackOrder` properties to define how the series will be stacked.

By default, they are stacked in the order you defined them, with positive values stacked above 0 and negative values stacked below 0.

For more information, see [stacking docs](/x/react-charts/stacking/).

## Partial data

### Skip missing points

Line series can have fewer data points than the axis.
You can handle lines with partial data or data starting at different points by providing `null` values.

By default, the tooltip does not show series if they have no value.
To override this behavior, use the `valueFormatter` to return a string if the value is `null` or `undefined`.

{{"demo": "DifferentLength.js"}}

:::info
When series data length is smaller than the axis one, overflowing values are `undefined` and not `null`.

The following code plots a line for x between 2 and 4.

- For x<2, values are set to `null` and then not shown.
- For x>4, values are set to `undefined` and then not shown.

```jsx
<LineChart
  series={[{ data: [null, null, 10, 11, 12] }]}
  xAxis={[{ data: [0, 1, 2, 3, 4, 5, 6] }]}
/>
```

:::

### Connect missing points

Line series accepts a `connectNulls` property which will continue the interpolation across points with a `null` value.
This property can link two sets of points, with `null` data between them.
However, it cannot extrapolate the curve before the first non-null data point or after the last one.

{{"demo": "ConnectNulls.js"}}

## Click event

Line charts provides multiple click handlers:

- `onAreaClick` for click on a specific area.
- `onLineClick` for click on a specific line.
- `onMarkClick` for click on a specific mark.
- `onAxisClick` for a click anywhere in the chart

They all provide the following signature.

```js
const clickHandler = (
  event, // The mouse event.
  params, // An object that identifies the clicked elements.
) => {};
```

{{"demo": "LineClickNoSnap.js"}}

:::info
Their is a slight difference between the `event` of `onAxisClick` and the others:

- For `onAxisClick` it's a native mouse event emitted by the svg component.
- For others, it's a React synthetic mouse event emitted by the area, line, or mark component.

:::

### Composition

If you're using composition, you can get those click event as follow.
Notice that the `onAxisClick` will handle both bar and line series if you mix them.

```jsx
import ChartsOnAxisClickHandler from '@mui/x-charts/ChartsOnAxisClickHandler';
// ...

<ChartContainer>
  {/* ... */}
  <ChartsOnAxisClickHandler onAxisClick={onAxisClick} />
  <LinePlot onItemClick={onLineClick} />
  <AreaPlot onItemClick={onAreaClick} />
</ChartContainer>;
```

## Styling

### Grid

You can add a grid in the background of the chart with the `grid` prop.

See [Axis—Grid](/x/react-charts/axis/#grid) documentation for more information.

{{"demo": "GridDemo.js"}}

### Color scale

As with other charts, you can modify the [series color](/x/react-charts/styling/#colors) either directly, or with the color palette.

You can also modify the color by using axes `colorMap` which maps values to colors.
The line charts use by priority:

1. The y-axis color
2. The x-axis color
3. The series color

Learn more about the `colorMap` properties in the [Styling docs](/x/react-charts/styling/#values-color).

{{"demo": "ColorScale.js"}}

:::warning
For now, ordinal config is not supported for line chart.
:::

### Interpolation

The interpolation between data points can be customized by the `curve` property.
This property expects one of the following string values, corresponding to the interpolation method: `'catmullRom'`, `'linear'`, `'monotoneX'`, `'monotoneY'`, `'natural'`, `'step'`, `'stepBefore'`, `'stepAfter'`.

This series property adds the option to control the interpolation of a series.
Different series could even have different interpolations.

{{"demo": "InterpolationDemoNoSnap.js", "hideToolbar": true}}

### Baseline

The area chart draws a `baseline` on the Y axis `0`.
This is useful as a base value, but customized visualizations may require a different baseline.

To get the area filling the space above or below the line, set `baseline` to `"min"` or `"max"`.
It is also possible to provide a `number` value to fix the baseline at the desired position.

:::warning
The `baseline` should not be used with stacked areas, as it will not work as expected.
:::

{{"demo": "AreaBaseline.js"}}

### Optimization

To show mark elements, use `showMark` series property.
It accepts a boolean or a callback.
The next example shows how to use it to display only one mark every two data points.

When a value is highlighted, a mark is rendered for that given value.
If the charts already have some marks (due to `showMark=true`) the highlight one will be on top of others.

This behavior can be removed with the `disableHighlight` series property or at the root of the line chart with a `disableLineItemHighlight` prop.

In this example, you have one mark for every value with an even index.
The highlighted data has a mark regardless if it has an even or odd index.

{{"demo": "MarkOptimization.js"}}

### CSS

Line plots are made of three elements named `LineElement`, `AreaElement`, and `MarkElement`.
Each element can be selected with the CSS class name `.MuiLineElement-root`, `.MuiAreaElement-root`, or `.MuiMarkElement-root`.

If you want to select the element of a given series, you can use classes `.MuiLineElement-series-<seriesId>` with `<seriesId>` the id of the series you want to customize.

In the next example, each line style is customized with dashes, and marks are removed.
The area of Germany's GDP also gets a custom gradient color.
The definition of `myGradient` is passed as a children of the chart component.

```jsx
sx={{
  '& .MuiLineElement-root': {
    strokeDasharray: '10 5',
    strokeWidth: 4,
  },
  '& .MuiAreaElement-series-Germany': {
    fill: "url('#myGradient')",
  },
}}
```

{{"demo": "CSSCustomization.js"}}

## Animation

To skip animation at the creation and update of your chart, you can use the `skipAnimation` prop.
When set to `true` it skips animation powered by `@react-spring/web`.

Charts containers already use the `useReducedMotion` from `@react-spring/web` to skip animation [according to user preferences](https://react-spring.dev/docs/utilities/use-reduced-motion#why-is-it-important).

:::warning
If you support interactive ways to add or remove series from your chart, you have to provide the series' id.

Otherwise the chart will have no way to know if you are modifying, removing, or adding some series.
This will lead to strange behaviors.
:::

```jsx
// For a single component chart
<LineChart skipAnimation />

// For a composed chart
<ResponsiveChartContainer>
  <LinePlot skipAnimation />
  <AreaPlot skipAnimation />
</ResponsiveChartContainer>
```

{{"demo": "LineAnimation.js"}}
