---
title: React Bar chart
productId: x-charts
components: BarChart, BarChartPro, BarElement, BarPlot, ChartsGrid, BarLabel
---

# Charts - Bars

<p class="description">Use bar charts to compare discrete categories and quantities using bar length and a common baseline.</p>

## Overview

Bar charts compare discrete categories by showing quantities as bar lengths from a common baseline.
They work well for comparing magnitude across categories, highlighting trends, and comparing proportions at a glance.
Categories can be progressive (for example, time periods) or independent (for example, products, countries, or age brackets).

The horizontal bar chart below compares voter turnout in several European countries.

{{"demo": "ShinyBarChartHorizontal.js"}}

## Basics

To create a bar chart you need:

- One categorical dimension (for example, the x-axis for vertical bars or the y-axis for horizontal bars)
- One or more numerical values that set the length of each bar

Bar chart series must contain a `data` property with an array of values.

You can specify bar ticks with the `xAxis` prop.
The category axis uses `scaleType='band'` and its `data` should have the same length as your series.

{{"demo": "BasicBars.js"}}

### Using a dataset

If your data is stored in an array of objects, you can use the `dataset` helper prop.
It accepts an array of objects such as `dataset={[{x: 1, y: 32}, {x: 2, y: 41}, ...]}`.

You can reuse this data when defining the series and axes by using the `dataKey` property.
For example, `xAxis={[{ dataKey: 'x' }]}` or `series={[{ dataKey: 'y' }]}`.

{{"demo": "BarsDataset.js"}}

## Bar size

You can define bar dimensions with `categoryGapRatio` and `barGapRatio` properties.

The `categoryGapRatio` defines the gap between two categories.
The ratio is obtained by dividing the size of the gap by the size of the category (the space used by bars).

The `barGapRatio` defines the gap between two bars of the same category.
It's the size of the gap divided by the size of the bar.
So a value of `1` will result in a gap between bars equal to the bar width.
A value of `-1` will make bars overlap.

{{"demo": "BarGap.js", "hideToolbar": true, "bg": "playground"}}

## Stacking

Bar series accept a string property called `stack`.
Series with the same `stack` value are stacked on top of each other.

{{"demo": "StackBars.js"}}

### Stacking strategy

You can use the `stackOffset` and `stackOrder` properties to define how the series is stacked.

By default, they are stacked in the order you defined them, with positive values stacked above 0 and negative values stacked below 0.

See [Stacking](/x/react-charts/stacking/) for more details.

## Layout

### Bar direction

Use the `layout="horizontal"` prop to render bar charts in a horizontal layout.
If you're composing a custom component, set the `layout: 'horizontal'` property on each bar series object.

{{"demo": "HorizontalBars.js"}}

### Tick placement

When using a `"band"` scale, the axis has some additional customization properties for the tick position:

- `tickPlacement` for the position of ticks
- `tickLabelPlacement` for the position of the label associated with the tick

You can test all configuration options in the following demo:

{{"demo": "TickPlacementBars.js"}}

### Date axis

If your band axis represents dates that are sorted and evenly spaced (as is typical), you can set `ordinalTimeTicks` to pick certain date frequencies.
This modifies the [tick management](/x/react-charts/axis-ticks/#ordinal-tick-management).

Instead of one tick per band, the axis renders ticks according to the provided frequencies and the tick number.

### Minimum bar size

You can set a minimum bar size with the `minBarSize` property.
This property is useful when you want to ensure that bars are always visible, even when the data is sparse or the chart is small.

The `minBarSize` property is ignored if the series value is `null` or `0`.
It also doesn't work with stacked series.

{{"demo": "MinBarSize.js"}}

### Log scale

A bar chart renders a bar from 0 to the value of a data point. However, the logarithm of zero is undefined, meaning that a y-axis with a log scale cannot plot the bar.

You can work around this limitation by using a [symlog scale](/x/react-charts/axis/#symlog-scale).

## Customization

### Grid

You can add a grid in the background of the chart with the `grid` prop.

See [Axis—Grid](/x/react-charts/axis-ticks/#grid) for details.

{{"demo": "GridDemo.js"}}

### Color scale

As with other charts, you can modify the [series color](/x/react-charts/styling/#colors) either directly, or with the color palette.

You can also modify the color by using the axes' `colorMap`, which maps values to colors.
Bar charts use the following, in order of priority:

1. The value axis color
2. The band axis color
3. The series color

See [Styling—Value-based colors](/x/react-charts/styling/#value-based-colors) for the `colorMap` properties.

{{"demo": "ColorScale.js"}}

### Border radius

To give your bar chart rounded corners, set the `borderRadius` property on [`BarChart`](/x/api/charts/bar-chart/#bar-chart-prop-slots).
It works with any positive value and is properly applied to horizontal layouts, stacks, and negative values.

When composing a custom component, you can set the `borderRadius` prop on the `BarPlot` component.

{{"demo": "BorderRadius.js"}}

### CSS

You can customize the bar chart elements using CSS selectors.

Each series renders a `g` element that contains a `data-series` attribute.
You can use this attribute to target elements based on their series.

{{"demo": "BarGradient.js"}}

### Gradients

By default, a gradient's units are set to [`objectBoundingBox`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/gradientUnits#objectboundingbox).
When applied to a bar, the gradient stretches to fill the entire size of the bar, regardless of the bar's value.

Alternatively, you can set `gradientUnits` to `userSpaceOnUse`, which stretches the gradient to fill the entire size of the chart.
With `userSpaceOnUse`, the gradient's coordinates are relative to the SVG, so a gradient with `x1="0"` and `x2="100%"` stretches across the entire width of the SVG.
This effectively reveals the gradient depending on the bar's value, as the gradient is clipped to the bar's size.

In the example below, there are two gradients:

1. The series `color` property references the gradient with `gradientUnits="objectBoundingBox"`, which is applied to the tooltip, legend, and other elements that reference the series color.
2. The bar's `fill` property is overridden using CSS to reference the gradient with `gradientUnits="userSpaceOnUse"`.

The first gradient is used for elements showing the whole gradient, such as tooltips and legend.
The second one is shown in the bars themselves that display the part of the gradient that corresponds to their value.

{{"demo": "BarOECDHouseholdSavings.js"}}

## Labels

You can display labels on the bars.
This can be useful to show the value of each bar directly on the chart.

If you provide `'value'` to the `barLabel` property of a bar series, the value of that bar is shown.
Alternatively, the `barLabel` property accepts a function that is called with the bar item and context about the bar.

In the example below, the value of the first series is displayed using the default formatter, and the value of the second series is formatted as US dollars.
The labels of the third series are hidden.

{{"demo": "BarLabel.js"}}

### Label placement

To customize the position of the bar label, set a series' `barLabelPlacement` property to one of the following values:

- `center`: the label is centered on the bar.
- `outside`: the label is placed after the end of the bar, from the point of view of the origin.
  For a vertical positive bar, the label is above its top edge.
  For a horizontal negative bar, the label is to the left of its leftmost limit.

{{"demo": "BarLabelPlacement.js"}}

:::info
When using `outside` placement, if the label doesn't fit in the chart area, it will be clipped.
To avoid this, you can decrease or increase the axis min/max, respectively, to make enough space for the labels.
:::

### Custom labels

To display, change, or hide labels based on conditional logic, provide a function to the `barLabel` prop.
Labels are not displayed if the function returns `null`.

The example below displays the text `'High'` on values higher than 10 and hides values when the generated bar height is lower than 60px.

{{"demo": "CustomLabels.js"}}

You can further customize the labels by providing a component to the `barLabel` slot.
The example below positions the labels above the bars they refer to.

{{"demo": "LabelsAboveBars.js"}}

## Click events

Bar charts provide two click handlers:

- `onItemClick` for clicks on a specific bar
- `onAxisClick` for clicks anywhere in the chart

They both provide the following signature:

```js
const clickHandler = (
  event, // The mouse event.
  params, // An object that identifies the clicked elements.
) => {};
```

{{"demo": "BarClick.js"}}

:::info
There is a slight difference between the `event` of `onItemClick` and `onAxisClick`:

- For `onItemClick` the event is a React synthetic mouse event emitted by the bar component.
- For `onAxisClick` the event is a native mouse event emitted by the SVG component.

:::

If you're composing a custom component, you can incorporate click events as shown in the code snippet below.
Note that `onAxisClick` can handle both bar and line series if you mix them.

```jsx
<ChartsContainer onAxisClick={onAxisClick}>
  {/* ... */}
  <BarPlot onItemClick={onItemClick} />
</ChartsContainer>
```

## Animation

Chart containers respect [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion), but you can also disable animations manually by setting the `skipAnimation` prop to `true`.

When you set `skipAnimation` to `true`, the chart renders without animations.

```jsx
// For a single component chart
<BarChart skipAnimation />

// For a composed chart
<ChartsContainer>
  <BarPlot skipAnimation />
</ChartsContainer>
```

{{"demo": "BarAnimation.js"}}

## Performance

By default, each bar is drawn as an SVG `rect` element.
With many bars, this can slow down rendering.
To render bars more efficiently, you can set the `renderer` prop to `"svg-batch"`.
This has some trade-offs:

- Styling individual bars with CSS is not supported.
- Transparent highlight styles are not fully supported: the highlight is drawn as a bar on top for performance, so transparency can make the original bar show through.
- Bar highlight and fade animations are not available.
- The `onItemClick` handler receives a native `MouseEvent` instead of `React.MouseEvent`.
  The type was not changed to avoid breaking changes; add `import type {} from '@mui/x-charts/moduleAugmentation/barChartBatchRendererOnItemClick'` for correct typing.
- The batch renderer is not available for [range bar charts](/x/react-charts/range-bar/).

The example below uses the `renderer` prop to improve performance when rendering a dataset with 500 data points.

{{"demo": "BarBatchRenderer.js"}}

## Composition

Use `ChartDataProvider` to provide `series`, `xAxis`, and `yAxis` props for composition.

In addition to the shared chart components available for [composition](/x/react-charts/composition/), you can use the `BarPlot` component to render the bars and their labels.

Here's how the bar chart is composed:

```jsx
<ChartsDataProvider>
  <ChartsWrapper>
    <ChartsLegend />
    <ChartsSurface>
      <ChartsGrid />
      <g clipPath={`url(#${clipPathId})`}>
        <BarPlot />
        <ChartsOverlay />
        <ChartsAxisHighlight />
        <FocusedBar />
      </g>
      <ChartsAxis />
      <ChartsClipPath id={clipPathId} />
    </ChartsSurface>
    <ChartsTooltip />
  </ChartsWrapper>
</ChartsDataProvider>
```

{{"demo": "BarScatterCompostion.js"}}
