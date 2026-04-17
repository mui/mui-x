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
Each line usually represents one series, so you can compare multiple variables or groups at a glance.

{{"demo": "LineOverview.js"}}

## Basics

### Data format

Line chart series must contain a `data` property with an array of numbers.
That array holds the y-values.

To set x-values, pass `data` on the `xAxis` configuration.
The axis can use any `scaleType`, and its `data` should have the same length as the series.

When you omit the `xAxis` prop entirely, `LineChart` supplies a default x-axis with `scaleType='point'`.
Its `data` is `[0, 1, 2, …]` with length matching the longest series, so each y-value pairs with its index in the series `data` array.

{{"demo": "BasicLineChart.js"}}

### Using a dataset

If your data is stored in an array of objects, you can use the `dataset` helper prop.
It accepts an array of objects such as `dataset={[{x: 1, y: 32}, {x: 2, y: 41}, ...]}`.

You can reuse this data when defining the series and axes by using the `dataKey` property.
For example, `xAxis={[{ dataKey: 'x' }]}` or `series={[{ dataKey: 'y' }]}`.

The demo below plots the evolution of world electricity production by source.

{{"demo": "LineDataset.js"}}

### Area

Set the series `area` property to `true` to fill the area under the line.

{{"demo": "BasicArea.js"}}

### Log scale

A y-axis with a log scale cannot plot a line that crosses zero, and it cannot plot an area chart, because the logarithm of zero is undefined.

See [Axis—Symlog scale](/x/react-charts/axis/#symlog-scale) for a workaround.

### Stacking

You can use the `stack` string property to group line series into stacks.
Series that share the same `stack` value are stacked on top of each other.

You can use the `stackOffset` and `stackOrder` properties to define how the series is stacked.
By default, they are stacked in the order you defined them, with positive values stacked above 0 and negative values stacked below 0.

See [Stacking](/x/react-charts/stacking/) for more details.

{{"demo": "StackedAreas.js"}}

### Axis domain

By default, the x-axis domain limit for line charts is set to `'strict'`, meaning the axis range matches the data range exactly.
For other chart types, axes round their limits to match human-readable values (for example, data ranging from 2 to 195 displays values from 0 to 200).
This behavior can be modified by the [axis property `domainLimit`](/x/react-charts/axis/#relative-axis-subdomain).

{{"demo": "LineDefaultDomainLimit.js"}}

## Partial data

### Skip missing points

A line series can have fewer data points than the axis.
Use `null` values when you have partial data or series that start at different points.

By default, the tooltip omits series that have no value at the hovered position.
To show a tooltip for missing values, use `valueFormatter` to return a string when the value is `null` or `undefined`.

{{"demo": "DifferentLength.js"}}

:::info
When the series `data` array is shorter than the axis `data`, values outside the series length are `undefined`, not `null`.

The following code draws a line for x between 2 and 4.

- For x<2, values are `null`, so the line is not drawn.
- For x>4, values are `undefined`, so the line is not drawn.

```jsx
<LineChart
  series={[{ data: [null, null, 10, 11, 12] }]}
  xAxis={[{ data: [0, 1, 2, 3, 4, 5, 6] }]}
/>
```

:::

### Connect missing points

Set the `connectNulls` property on a line series to continue the curve across points whose value is `null`.
This links two segments with a gap of `null` values in between.
The curve is not extrapolated before the first non-null point or after the last one.

{{"demo": "ConnectNulls.js"}}

## Click event

Line charts provide several click handlers:

- `onAreaClick` when a specific area is clicked
- `onLineClick` when a specific line is clicked
- `onMarkClick` when a specific mark is clicked
- `onAxisClick` when the chart background is clicked

Each handler receives the same signature:

```js
const clickHandler = (
  event, // The mouse event.
  params, // An object that identifies the clicked elements.
) => {};
```

{{"demo": "LineClick.js"}}

:::info
The `event` differs slightly between `onAxisClick` and the others:

- For `onAxisClick`, it is the native mouse event from the SVG element.
- For the rest, it is a React synthetic mouse event from the area, line, or mark component.

:::

### Composition

If you're composing a custom component, you can receive these click events as follows.
Note that `onAxisClick` runs for both bar and line series when you mix them.

```jsx
<ChartsContainer onAxisClick={onAxisClick}>
  {/* ... */}
  <LinePlot onItemClick={onLineClick} />
  <AreaPlot onItemClick={onAreaClick} />
</ChartsContainer>
```

### Pointer interaction 🧪

By default, line and area series are highlighted when the pointer hovers directly over the SVG element (the line stroke or area fill).
This can make it difficult to interact with thin lines.

Enabling `experimentalFeatures.enablePositionBasedPointerInteraction` switches to a pointer-position-based detection that determines the closest series to the cursor.
For area series, it detects whether the pointer is inside the filled area.
For line series (without area), it finds the series whose curve is closest to the pointer's vertical position.

This uses the same curve interpolation as the rendered line (for example, `monotoneX`, `catmullRom`), so the hit detection matches the visual shape.

:::warning
This feature is experimental.
Its API and behavior may change in future releases.
:::

{{"demo": "LinePointerInteraction.js"}}

## Styling

### Grid

You can add a grid in the background of the chart with the `grid` prop.

See [Axis—Grid](/x/react-charts/axis-ticks/#grid) for details.

{{"demo": "GridDemo.js"}}

### Color scale

As with other charts, you can modify the [series color](/x/react-charts/styling/#colors) either directly, or with the color palette.

You can also modify the color by using the axes' `colorMap`, which maps values to colors.
Line charts use the following, in order of priority:

1. The y-axis color
2. The x-axis color
3. The series color

See [Styling—Value-based colors](/x/react-charts/styling/#value-based-colors) for the `colorMap` properties.

{{"demo": "ColorScale.js"}}

:::warning
Ordinal color config is not yet supported for line charts.
:::

### Interpolation

Use the `curve` property to choose how the line is drawn between points.
It accepts these string values: `'linear'`, `'catmullRom'`, `'monotoneX'`, `'monotoneY'`, `'natural'`, `'step'`, `'stepBefore'`, `'stepAfter'`, `'bumpX'`, and `'bumpY'`.

Use the select in the demo below to compare how each value renders on the same data.

You can set `curve` per series, so different series can use different interpolations.

{{"demo": "InterpolationDemo.js", "hideToolbar": true}}

#### Expanding steps

For step interpolations (when `curve` is set to `'step'`, `'stepBefore'`, or `'stepAfter'`), the line expands to cover the full band width to simplify composing line and area charts.

Use the `strictStepCurve` series property to turn off this behavior.

{{"demo": "ExpandingStep.js"}}

### Baseline

The area chart uses the y-axis value `0` as the baseline by default.
That works well as a reference, but your use case may call for a different baseline.

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
If the chart already shows marks (`showMark={true}`), the highlight mark is drawn on top.

You can turn off this behavior with the `disableHighlight` series property or the `disableLineItemHighlight` prop on the line chart.

The demo shows one mark for every value with an even index.
The highlighted point always shows a mark, whether its index is even or odd.

{{"demo": "MarkOptimization.js"}}

### CSS

You can customize the line chart elements using CSS selectors.
Line plots use three elements: `LineElement`, `AreaElement`, and `MarkElement`.
You can target them with the CSS classes `lineClasses.line`, `lineClasses.area`, and `lineClasses.mark`.
To target a specific series, use the `data-series` attribute.

In the demo below, each line uses a custom dash style and marks are hidden.
The area for Germany's GDP uses a custom gradient.
The gradient is defined as a child of the chart (`myGradient` referenced in `fill`).

```jsx
<LineChart
  sx={{
    '& .MuiLineElement-root': {
      strokeDasharray: '10 5',
      strokeWidth: 4,
    },
    [`& .${lineClasses.line}`]: {
      strokeDasharray: '10 5',
      strokeWidth: 4,
    },
    [`& .${lineClasses.area}[data-series="Germany"]`]: {
      fill: "url('#myGradient')",
    },
  }}
/>
```

{{"demo": "CSSCustomization.js"}}

The next example shows how to apply a dashed stroke to the chart line, legend mark, and tooltip mark for each series using the `[data-series]` attribute selector.

{{"demo": "StyledLineChart.js"}}

## Animation

Chart containers respect [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion), but you can also disable animations manually by setting the `skipAnimation` prop to `true`.

When you set `skipAnimation` to `true`, the chart renders without animations.

:::warning
If you add or remove series interactively, give each series an `id`.
Otherwise the chart cannot tell whether you are updating, removing, or adding a series, and the animation may not behave as expected.
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

Use `ChartsDataProvider` to provide `series`, `xAxis`, and `yAxis` props for composition.

In addition to the shared chart components available for [composition](/x/react-charts/composition/), you can use `LinePlot`, `AreaPlot`, `MarkPlot`, `LineHighlightPlot`, and `FocusedLineMark` to draw the lines, areas, marks, and focus ring.

Here's how the line chart is composed:

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
