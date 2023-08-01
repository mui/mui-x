---
title: Charts - Lines
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

## Styling

### Interpolation

The interpolation between data points can be customized by the `curve` property.
This property expects one of the following string values, corresponding to the interpolation method: `'catmullRom'`, `'linear'`, `'monotoneX'`, `'monotoneY'`, `'natural'`, `'step'`, `'stepBefore'`, `'stepAfter'`.

{{"demo": "InterpolationDemo.js", "hideToolbar": true, "bg": "inline"}}

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
  '& .MuiMarkElement-root': {
    display: 'none',
  },
  '& .MuiAreaElement-series-Germany': {
    fill: "url('#myGradient')",
  },
}}
```

{{"demo": "CSSCustomization.js"}}
