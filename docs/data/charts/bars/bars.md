---
title: Charts - Bars
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
And a value of `-1` will make bars overlap on top of each over.

{{"demo": "BarGapNoSnap.js"}}

## Stacking

Each bar series can get a `stack` property expecting a string value.
Series with the same `stack` will be stacked on top of each other.

{{"demo": "StackBars.js"}}

### Stacking strategy

You can use the `stackOffset` and `stackOrder` properties to define how the series will be stacked.

By default, they are stacked in the order you defined them, with positive values stacked above 0 and negative values stacked below 0.

For more information, see [stacking docs](/x/react-charts/stacking/).
