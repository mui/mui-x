---
title: React Bar chart
productId: x-charts
components: BarChart, BarChartPro, BarElement, BarPlot, ChartsGrid, BarLabel
---

# Charts - Bars

<p class="description">Bar charts express quantities through a bar's length, using a common baseline.</p>

## Overview

Bar charts are ideal for comparing discrete categories.
They excel at visualizing differences in magnitude across categories (or a group of categories), highlight trends, and compare proportions at a glance.
The categories can represent progressive values such as time periods, or independent groups such as products, countries, age brackets, etc.
Here are the basic requirements to create a bar chart:

- One categorical dimension (x-axis for vertical bars, y-axis for horizontal bars)
- One or more numerical metric for length of each bar

The horizontal bar chart below compares voter turnout in some European countries:

{{"demo": "ShinyBarChartHorizontal.js"}}

## Basics

Bar charts series should contain a `data` property containing an array of values.

You can specify bar ticks with the `xAxis` prop.
This axis might have `scaleType='band'` and its `data` should have the same length as your series.

{{"demo": "BasicBars.js"}}

### Using a dataset

If your data is stored in an array of objects, you can use the `dataset` helper prop.
It accepts an array of objects such as `dataset={[{x: 1, y: 32}, {x: 2, y: 41}, ...]}`.

You can reuse this data when defining the series and axis, thanks to the `dataKey` property.

For example `xAxis={[{ dataKey: 'x'}]}` or `series={[{ dataKey: 'y'}]}`.

{{"demo": "BarsDataset.js"}}

## Bar size

You can define bar dimensions with `categoryGapRatio` and `barGapRatio` properties.

The `categoryGapRatio` defines the gap between two categories.
The ratio is obtained by dividing the size of the gap by the size of the category (the space used by bars).

The `barGapRatio` defines the gap between two bars of the same category.
It's the size of the gap divided by the size of the bar.
So a value of `1` will result in a gap between bars equal to the bar width.
And a value of `-1` will make bars overlap on top of each other.

{{"demo": "BarGap.js", "hideToolbar": true, "bg": "playground"}}

## Stacking

Bar series accept a string property named `stack`.
Series with the same `stack` value are stacked on top of each other.

{{"demo": "StackBars.js"}}

### Stacking strategy

You can use the `stackOffset` and `stackOrder` properties to define how the series will be stacked.

By default, they are stacked in the order you defined them, with positive values stacked above 0 and negative values stacked below 0.

For more information, see [stacking docs](/x/react-charts/stacking/).

## Layout

### Bar direction

Bar charts can be rendered with a horizontal layout by providing the `layout="horizontal"` prop.
If you're using [composition](/x/react-charts/composition/), you should set the property `layout: 'horizontal'` to each bar series object.

{{"demo": "HorizontalBars.js"}}

### Tick placement

When using a `"band"` scale, the axis has some additional customization properties about the tick position.

- `tickPlacement` for the position of ticks
- `tickLabelPlacement` for the position of the label associated with the tick

You can test all configuration options in the following demo:

{{"demo": "TickPlacementBars.js"}}

### Date axis

If your band axis represents dates in a usual way (they are sorted and evenly spaced), you can set `ordinalTimeTicks` to pick some date frequencies.
This modifies the [tick management](/x/react-charts/axis/#ordinal-tick-management).

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

See [Axis—Grid](/x/react-charts/axis/#grid) documentation for more information.

{{"demo": "GridDemo.js"}}

### Color scale

As with other charts, you can modify the [series color](/x/react-charts/styling/#colors) either directly, or with the color palette.

You can also modify the color by using axes `colorMap` which maps values to colors.
The bar charts use by priority:

1. The value axis color
2. The band axis color
3. The series color

Learn more about the `colorMap` properties in [Styling—Value-based colors](/x/react-charts/styling/#value-based-colors).

{{"demo": "ColorScale.js"}}

### Border radius

To give your bar chart rounded corners, you can change the value of the `borderRadius` property on the [BarChart](/x/api/charts/bar-chart/#bar-chart-prop-slots).

It works with any positive value and is properly applied to horizontal layouts, stacks, and negative values.

When using composition, you can set the `borderRadius` prop on the `BarPlot` component.

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
`userSpaceOnUse` means that the gradient's coordinates are relative to the SVG, meaning that a gradient with `x1="0"` and `x2="100%"` stretches across the entire width of the SVG.
This effectively reveals the gradient depending on the bar's value, as the gradient is clipped to the bar's size.

{{"demo": "BarOECDHouseholdSavings.js"}}

Note that, in the example above, there are two gradients:

- The series `color` property references the gradient with `gradientUnits="objectBoundingBox"`, which is applied to the tooltip, legend, and other elements that reference the series color.
- The bar's `fill` property is overridden using CSS to reference the gradient with `gradientUnits="userSpaceOnUse"`.

The first gradient is used for elements showing the whole gradient, such as tooltips and legend.
The second one is shown in the bars themselves that display the part of the gradient that corresponds to their value.

## Labels

You can display labels on the bars. This can be useful to show the value of each bar directly on the chart.

If you provide `'value'` to the `barLabel` property of a bar series, the value of that bar is shown.
Alternatively, the `barLabel` property accepts a function that is called with the bar item and context about the bar.

In the example below, the value of the first series is displayed using the default formatter, and format the value of the second series as US dollars. The labels of the third series are hidden.

{{"demo": "BarLabel.js"}}

### Label placement

The position of the bar label can be customized.
To do so, set a series' `barLabelPlacement` property to one of the following values:

- `center`: the label is centered on the bar;
- `outside`: the label is placed after the end of the bar, from the point of the view of the origin. For a vertical positive bar, the label is above its top edge; for a horizontal negative bar, the label is placed to the left of its leftmost limit.

{{"demo": "BarLabelPlacement.js"}}

:::info
When using `outside` placement, if the label does not fit in the chart area, it will be clipped.
To avoid this, you can decrease/increase the axis min/max respectively so that there's enough space for the labels.
:::

### Custom labels

You can display, change, or hide labels based on conditional logic.
To do so, provide a function to the `barLabel`.
Labels are not displayed if the function returns `null`.

In the example we display a `'High'` text on values higher than 10, and hide values when the generated bar height is lower than 60px.

{{"demo": "CustomLabels.js"}}

You can further customize the labels by providing a component to the `barLabel` slot.

In the example below, we position the labels above the bars they refer to.

{{"demo": "LabelsAboveBars.js"}}

## Click event

Bar charts provides two click handlers:

- `onItemClick` for click on a specific bar.
- `onAxisClick` for a click anywhere in the chart

They both provide the following signature.

```js
const clickHandler = (
  event, // The mouse event.
  params, // An object that identifies the clicked elements.
) => {};
```

{{"demo": "BarClick.js"}}

:::info
There is a slight difference between the `event` of `onItemClick` and `onAxisClick`:

- For `onItemClick` it's a React synthetic mouse event emitted by the bar component.
- For `onAxisClick` it's a native mouse event emitted by the svg component.

:::

If you're composing a custom component, you can incorporate click events as shown in the code snippet below.
Note that `onAxisClick` can handle both bar and line series if you mix them.

```jsx
<ChartContainer onAxisClick={onAxisClick}>
  {/* ... */}
  <BarPlot onItemClick={onItemClick} />
</ChartContainer>
```

## Animation

Chart containers respect [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion), but you can also disable animations manually by setting the `skipAnimation` prop to `true`.

When `skipAnimation` is enabled, the chart renders without any animations.

```jsx
// For a single component chart
<BarChart skipAnimation />

// For a composed chart
<ChartContainer>
  <BarPlot skipAnimation />
</ChartContainer>
```

{{"demo": "BarAnimation.js"}}

## Performance

Bar charts can display many bars, which can impact performance. The default rendering of bars use SVG `rect` elements, which can be slow for a large number of bars.

To improve performance, you can use the `renderer` prop set to `"svg-batch"`, which renders the bars more efficiently.
However, this comes with the following trade-offs:

- CSS styling of single bars is no longer possible;
- Transparent highlight style: for performance reasons, the highlighted state creates a highlighted bar on top of the original bar. Applying transparency to the highlighted bar can cause the original bar to be partially visible;
- No animation when highlighting or fading bars;
- The event of the `onItemClick` handler is a `MouseEvent` instead of a `React.MouseEvent`. To avoid breaking changes, the type of `onItemClick` was not changed, but you can import a type overload to fix it: `import type {} from '@mui/x-charts/moduleAugmentation/barChartBatchRendererOnItemClick'`;
- It is not available for [range bar charts](/x/react-charts/range-bar/).

The example below uses the `renderer` prop to improve performance when rendering a dataset with 500 data points.

{{"demo": "BarBatchRenderer.js"}}

## Composition

Use the `<ChartDataProvider />` to provide `series`, `xAxis`, and `yAxis` props for composition.

In addition to the common chart components available for [composition](/x/react-charts/composition/), you can use the `<BarPlot />` component that renders the bars and their labels.

Here's how the Bar Chart is composed:

```jsx
<ChartDataProvider>
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
</ChartDataProvider>
```

{{"demo": "BarScatterCompostion.js"}}
