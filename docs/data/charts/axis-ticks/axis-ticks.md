---
title: Charts - Axis ticks and grid
productId: x-charts
components: ChartsAxis, ChartsGrid, ChartsXAxis, ChartsYAxis
---

# Charts - Axis ticks and grid

<p class="description">Configure axis ticks and the chart grid.</p>

## Grid

You can add a grid in the background of a Cartesian chart with the `grid` prop.
This prop accepts an object with `vertical` and `horizontal` properties that are responsible for creating their respective lines when set to `true`.

If you use composition you can pass these as props to the `<ChartsGrid />` component:

```jsx
<BarChart grid={{ vertical: true }}>

<ChartsContainer>
  <ChartsGrid vertical />
</ChartsContainer>
```

In this Demo the horizontal grid is customized with some CSS selectors.

{{"demo": "GridDemo.js", "defaultCodeOpen": false}}

## Tick position

### Automatic tick position

Use the `tickNumber` property to customize the number of ticks.

:::info
This number does _not_ necessarily represent the exact number of ticks displayed.
This is because D3 automatically places ticks to optimize for human readability, and it rounds up or down from the provided `tickNumber` as needed to accomplish this.

For example, if you set `tickNumber=5` but there are only four years to display on the axis, the component renders four total ticks (one for each year) instead of trying to divide four years into five.
:::

To better control how the ticks render, you can also provide `tickMinStep` and `tickMaxStep`, which compute `tickNumber` so that the step between two ticks respects the minimum and maximum values.

In the demo below, the top axis has a `tickMinStep` of half a day, and the bottom axis has a `tickMinStep` of a full day.

{{"demo": "TickNumber.js"}}

### Tick spacing

Use the `tickSpacing` property to define the minimum spacing in pixels between two ticks.

Having a minimum space between ticks improves the readability of the axis and can also improve the chart's performance.

This property defaults to 0 and is only available for ordinal axes, that is, axes with a band or point scale.

{{"demo": "TickSpacing.js"}}

### Fixed tick position

If you want more control over the tick position, you can use the `tickInterval` property.
This property accepts an array of values that define exactly where ticks are placed.

For axes with the `'point'` scale type, the `tickInterval` property can be a filtering function of the type `(value, index) => boolean`.

In the demo below, both axes are set to `scaleType='point'`.
The top axis demonstrates the default behavior with a tick for each point.
The bottom axis uses a filtering function to only display a tick at the beginning of a day.

{{"demo": "TickPosition.js"}}

### Filtering tick labels

You can use the `tickLabelInterval` property to only display labels on a specific subset of ticks.
This is a filtering function in the `(value, index) => boolean` form.
For example, `tickLabelInterval: (value, index) => index % 2 === 0` will show the label every two ticks.

:::warning
The `value` and `index` arguments are those of the ticks, not the axis data.
:::

By default, ticks are filtered so that their labels don't overlap.
You can override this behavior with `tickLabelInterval: () => true` which forces the tick label to be shown for each tick.

In the example below, the top axis is a reference for the default behavior: tick labels don't overflow.
At the bottom, you can see one tick for the beginning and the middle of the day, but the tick label is only displayed for the beginning of the day.

{{"demo": "TickLabelPosition.js"}}

### Ordinal tick management

Ordinal scales (`'band'` and `'point'`) display one tick per item by default.
If you have a date axis, you can use the `ordinalTimeTicks` property to configure which ticks to show.

It takes an array of frequencies at which ticks can be placed.
Those frequencies must be sorted from the largest to the smallest.
For example `['years', 'months', 'days']`.
Visible ticks are selected according to those frequencies and the `tickNumber`.

The `ordinalTimeTicks` property can either be an implementation of the `TickFrequencyDefinition` type or a subset of the built-in frequencies: `'years'`, `'quarterly'`, `'months'`, `'biweekly'`, `'weeks'`, `'days'`, `'hours'`.

When using `ordinalTimeTicks` the property `tickPlacement` is ignored, and computation are done as if set to `'middle'`.

In the following demo, you can modify the `ordinalTimeTicks` based on built-in frequencies and see how it impacts zoom behavior.

{{"demo": "OrdinalTickPlacement.js"}}

The `TickFrequencyDefinition` is an object made of following properties:

- `getTickNumber: (from: Date, to: Date) => number` Returns the number of ticks that will be displayed between `from` and `to` dates.
- `isTick: (prev: Date, value: Date) => boolean` Returns `true` is a tick should be placed on `value`. For example if it's the beginning of a new month.
- `format: (d: Date) => string` Returns for tick label.

The built-in frequency definitions are exported as `tickFrequencies` from `'@mui/x-charts/utils'`.

In the following demo, we use the `tickFrequencies` to display quarters and weeks with different labels.

{{"demo": "CustomTickFrequency.js"}}
