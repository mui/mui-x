---
title: React Bar chart
productId: x-charts
components: BarChart, BarChartPro, BarElement, BarPlot, ChartsGrid, ChartsOnAxisClickHandler, BarLabel
---

# Charts - Bars

<p class="description">Bar charts express quantities through a bar's length, using a common baseline.</p>

## Basics

Bar charts series should contain a `data` property containing an array of values.

You can customize bar ticks with the `xAxis`.
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

{{"demo": "BarGapNoSnap.js", "hideToolbar": true, "bg": "playground"}}

## Stacking

Each bar series can get a `stack` property expecting a string value.
Series with the same `stack` will be stacked on top of each other.

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

Learn more about the `colorMap` properties in the [Styling docs](/x/react-charts/styling/#values-color).

{{"demo": "ColorScale.js"}}

### Border Radius

To give your bar chart rounded corners, you can change the value of the `borderRadius` property on the [BarChart](/x/api/charts/bar-chart/#bar-chart-prop-slots).

It will work with any positive value and will be properly applied to horizontal layouts, stacks and negative values.

{{"demo": "BorderRadius.js"}}

## Labels

You can display labels on the bars.
To do so, the `BarChart` or `BarPlot` accepts a `barLabel` property.
It can either get a function that gets the bar item and some context.
Or you can pass `'value'` to display the raw value of the bar.

{{"demo": "BarLabel.js"}}

### Custom Labels

You can display, change or hide labels based on conditional logic.
To do so, provide a function to the `barLabel`.
Labels are not displayed if the function returns `null`.

In the example we display a `'High'` text on values higher than 10, and hide values when the generated bar height is lower than 60px.

{{"demo": "CustomLabels.js"}}

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

{{"demo": "BarClickNoSnap.js"}}

:::info
Their is a slight difference between the `event` of `onItemClick` and `onAxisClick`:

- For `onItemClick` it's a React synthetic mouse event emitted by the bar component.
- For `onAxisClick` it's a native mouse event emitted by the svg component.

:::

### Composition

If you're using composition, you can get those click event as follows.
Notice that the `onAxisClick` will handle both bar and line series if you mix them.

```jsx
import ChartsOnAxisClickHandler from '@mui/x-charts/ChartsOnAxisClickHandler';
// ...

<ChartContainer>
  {/* ... */}
  <ChartsOnAxisClickHandler onAxisClick={onAxisClick} />
  <BarPlot onItemClick={onItemClick} />
</ChartContainer>;
```

## Animation

To skip animation at the creation and update of your chart, you can use the `skipAnimation` prop.
When set to `true` it skips animation powered by `@react-spring/web`.

Charts containers already use the `useReducedMotion` from `@react-spring/web` to skip animation [according to user preferences](https://react-spring.dev/docs/utilities/use-reduced-motion#why-is-it-important).

```jsx
// For a single component chart
<BarChart skipAnimation />

// For a composed chart
<ResponsiveChartContainer>
  <BarPlot skipAnimation />
</ResponsiveChartContainer>
```

{{"demo": "BarAnimation.js"}}
