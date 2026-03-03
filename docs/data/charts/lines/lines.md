---
title: React Line chart
productId: x-charts
components: LineChart, LineChartPro, LineElement, LineHighlightElement, LineHighlightPlot, LinePlot, MarkElement, MarkPlot, AreaElement, AreaPlot, AnimatedLine, AnimatedArea, ChartsGrid
---

# Charts - Lines

<p class="description">Use line charts to show trends over time, compare series, and highlight changes in continuous data.</p>

## Overview

Line charts work well when you want to show how values change over a continuous dimension such as time or a measurement scale.

They emphasize trends, patterns, and fluctuations, so they are useful for exploring relationships, spotting cycles, or tracking performance over time.
Each line usually represents one series, so you can easily compare multiple variables or groups.

{{"demo": "LineOverview.js"}}

## Basics

### Data format

A line chart series should include a `data` property with an array of numbers.
That array holds the y-values.

Use the `xAxis` prop to specify x-values.
The axis can use any `scaleType`, and its `data` should have the same length as the series.

By default, those y-values are paired with integers starting from 0 (0, 1, 2, 3, ...).

{{"demo": "BasicLineChart.js"}}

### Using a dataset

When your data lives in an array of objects, use the `dataset` prop.
It accepts an array of objects, for example `dataset={[{x: 1, y: 32}, {x: 2, y: 41}, ...]}`.

Use the `dataKey` property to reference that data from your series and axis definitions.

For example, `xAxis={[{ dataKey: 'x'}]}` or `series={[{ dataKey: 'y'}]}`.

The demo below plots the evolution of world electricity production by source.

{{"demo": "LineDataset.js"}}

### Area

Set the series `area` property to `true` to fill the area under the line.

{{"demo": "BasicArea.js"}}

### Log scale

A y-axis with a log scale cannot plot a line that crosses zero, and it cannot plot an area chart, because the logarithm of zero is undefined.

See the [symlog scale](/x/react-charts/axis/#symlog-scale) section for a workaround.

### Stacking

Add a `stack` property to each line series (a string value).
Series that share the same `stack` value are stacked on top of each other.

Use the `stackOffset` and `stackOrder` properties to control how stacking works.
By default, series are stacked in the order you define them, with positive values above 0 and negative values below 0.

See the [stacking documentation](/x/react-charts/stacking/) for details.

{{"demo": "StackedAreas.js"}}

### Axis domain

By default, axes round their limits to human-readable values.
For example, if your data ranges from 2 to 195, the axis shows 0 to 200.
You can change this with the [axis property `domainLimit`](/x/react-charts/axis/#relative-axis-subdomain).

:::info
The current default behavior can lead to empty space on left/right of the line chart.
To fix that issue, future major version will default the x-axis domain limit to `'strict'`.

To test this behavior, add the `experimentalFeatures` prop to your chart with `preferStrictDomainInLineCharts: true` value.
You can also enable it globally using [theme default props](/material-ui/customization/theme-components/#theme-default-props)

```js
components: {
  MuiChartsDataProvider: {
    defaultProps: {
       experimentalFeatures: { preferStrictDomainInLineCharts: true }
    },
  },
}
```

:::

{{"demo": "LineDefaultDomainLimit.js"}}

## Partial data

### Skip missing points

A line series can have fewer data points than the axis.
Use `null` values when you have partial data or series that start at different points.

By default, the tooltip omits series that have no value at the hovered position.
To show something for missing values, use `valueFormatter` to return a string when the value is `null` or `undefined`.

{{"demo": "DifferentLength.js"}}

:::info
When the series `data` array is shorter than the axis `data`, values outside the series length are `undefined`, not `null`.

The following code draws a line for x between 2 and 4.

- For x &lt; 2, values are `null`, so the line is not drawn.
- For x &gt; 4, values are `undefined`, so the line is not drawn.

```jsx
<LineChart
  series={[{ data: [null, null, 10, 11, 12] }]}
  xAxis={[{ data: [0, 1, 2, 3, 4, 5, 6] }]}
/>
```

:::

### Connect missing points

Set the `connectNulls` property on a line series to continue the curve across points whose value is `null`.
That links two segments with a gap of `null` values in between.
The curve is not extrapolated before the first non-null point or after the last one.

{{"demo": "ConnectNulls.js"}}

## Click event

Line charts provide several click handlers:

- `onAreaClick` when a specific area is clicked.
- `onLineClick` when a specific line is clicked.
- `onMarkClick` when a specific mark is clicked.
- `onAxisClick` when anywhere in the chart is clicked.

Each handler receives the same signature:

```js
const clickHandler = (
  event, // The mouse event.
  params, // An object that identifies the clicked elements.
) => {};
```

{{"demo": "LineClick.js"}}

:::info
There is a small difference between the `event` passed to `onAxisClick` and the others:

- For `onAxisClick`, it is the native mouse event from the SVG element.
- For the rest, it is a React synthetic mouse event from the area, line, or mark component.

:::

### Composition

If you are composing a custom component, you can receive these click events as follows.
Note that `onAxisClick` runs for both bar and line series when you mix them.

```jsx
<ChartsContainer onAxisClick={onAxisClick}>
  {/* ... */}
  <LinePlot onItemClick={onLineClick} />
  <AreaPlot onItemClick={onAreaClick} />
</ChartsContainer>
```

## Styling

### Grid

Use the `grid` prop to add a grid behind the chart.

See the [Axis—Grid](/x/react-charts/axis/#grid) section for details.

{{"demo": "GridDemo.js"}}

### Color scale

As with other chart types, you can change [series colors](/x/react-charts/styling/#colors) per series or via the color palette.

You can also drive color from the axes with `colorMap`, which maps axis values to colors.
Line charts resolve color in this order:

1. The y-axis color
2. The x-axis color
3. The series color

See [Styling—Value-based colors](/x/react-charts/styling/#value-based-colors) for `colorMap` options.

{{"demo": "ColorScale.js"}}

:::warning
Ordinal color config is not yet supported for line charts.
:::

### Interpolation

Use the `curve` property to choose how the line is drawn between points.
It accepts one of: `'catmullRom'`, `'linear'`, `'monotoneX'`, `'monotoneY'`, `'natural'`, `'step'`, `'stepBefore'`, `'stepAfter'`, `'bumpX'`, and `'bumpY'`.

You can set `curve` per series, so different series can use different interpolations.

{{"demo": "InterpolationDemo.js", "hideToolbar": true}}

#### Expanding steps

For step interpolations (`curve` set to `'step'`, `'stepBefore'`, or `'stepAfter'`), the line expands to cover the full band width to simplify composing line and area charts.

Set the `strictStepCurve` series property to turn off this behavior.

{{"demo": "ExpandingStep.js"}}

### Baseline

The area chart uses the y-axis value `0` as the baseline by default.
That works well as a reference, but you may want a different baseline.

Set `baseline` to `"min"` or `"max"` to fill the area above or below the line.
You can also set `baseline` to a number to fix the baseline at a specific value.

:::warning
Do not use `baseline` with stacked areas; the result will not match expectations.
:::

{{"demo": "AreaBaseline.js"}}

### Optimization

Use the `showMark` series property to show mark elements.
It accepts a boolean or a callback.
The demo below uses a callback to show a mark only every two data points.

When a value is highlighted, a mark is drawn for that value.
If the chart already shows marks (for example with `showMark={true}`), the highlight mark is drawn on top.

Turn off this behavior with the `disableHighlight` series property or the `disableLineItemHighlight` prop on the line chart.

In the demo, there is one mark for every value with an even index.
The highlighted point always shows a mark, whether its index is even or odd.

{{"demo": "MarkOptimization.js"}}

### CSS

Line plots use three elements: `LineElement`, `AreaElement`, and `MarkElement`.
Target them with the CSS classes `.MuiLineElement-root`, `.MuiAreaElement-root`, and `.MuiMarkElement-root`.

To target a specific series, use the `data-series` attribute.

In the demo below, each line uses a custom dash style and marks are hidden.
The area for Germany's GDP uses a custom gradient.
The gradient is defined as a child of the chart (for example, `myGradient` referenced in `fill`).

```jsx
<LineChart
  sx={{
    '& .MuiLineElement-root': {
      strokeDasharray: '10 5',
      strokeWidth: 4,
    },
    '& .MuiAreaElement-root[data-series="Germany"]': {
      fill: "url('#myGradient')",
    },
  }}
/>
```

{{"demo": "CSSCustomization.js"}}

## Animation

Chart containers respect the [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) media query.
You can also turn off animation by setting the `skipAnimation` prop to `true`.

With `skipAnimation` set, the chart renders without animation.

:::warning
If you add or remove series interactively, give each series an `id`.

Otherwise the chart cannot tell whether you are updating, removing, or adding a series, and the animation can behave incorrectly.
:::

```jsx
// For a single component chart
<LineChart skipAnimation />

// For a composed chart
<ChartsContainer>
  <LinePlot skipAnimation />
  <AreaPlot skipAnimation />
</ChartsContainer>
```

{{"demo": "LineAnimation.js"}}

## Composition

Use `ChartsDataProvider` to supply `series`, `xAxis`, and `yAxis` when composing a custom chart.

In addition to the shared components described in [Composition](/x/react-charts/composition/), you can use:

- `AreaPlot` to draw series areas.
- `LinePlot` to draw series lines.
- `MarkPlot` to draw series marks.
- `LineHighlightPlot` to draw the larger mark at the highlighted value.
- `FocusedLineMark` to draw a focus ring when a data point is focused.

The following shows how the line chart is built from these pieces:

```jsx
<ChartsDataProvider>
  <ChartsWrapper>
    <ChartsLegend />
    <ChartsSurface>
      <ChartsGrid />
      <g clipPath={`url(#${clipPathId})`}>
        {/* Elements clipped inside the drawing area. */}
        <AreaPlot />
        <LinePlot />
        <ChartsOverlay />
        <ChartsAxisHighlight />
      </g>
      <FocusedLineMark />
      <ChartsAxis />
      <g data-drawing-container>
        {/* Elements able to overflow the drawing area. */}
        <MarkPlot />
      </g>
      <LineHighlightPlot />
      <ChartsClipPath id={clipPathId} />
    </ChartsSurface>
    <ChartsTooltip />
  </ChartsWrapper>
</ChartsDataProvider>
```

:::info
The `data-drawing-container` attribute marks children as part of the drawing area even when they overflow.

See [Composition—clipping](/x/react-charts/composition/#clipping) for details.
:::
