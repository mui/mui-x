---
product: charts
title: Charts - Lines
---

# Charts - Lines

<p class="description">Line charts can express qualities about data, such as hierarchy, highlights, and comparisons.</p>

## Basics

### Data format

To plot lines, a series must have a `data` property containing an array of numbers.
This `data` array corresponds to y values.
To modify x value, you should provide a `xAxis` with data properties.

{{"demo": "BasicLineChart.js", "bg": "inline"}}

### Area

You can fill the area of the line by setting the series' `area` property to `true`.

{{"demo": "BasicArea.js", "bg": "inline"}}

## Stacking

Each line series can get a `stack` property which expects a string value.
Series with the same `stack` will be stacked on top of each other.

{{"demo": "StackedAreas.js", "bg": "inline"}}

### Stacking strategy 🚧

## Styling

### Interpolation

The interpolation between data points can be customized by the `curve` property.
This property expects one of the following string values, corresponding to the interpolation method: `'catmullRom'`, `'linear'`, `'monotoneX'`, `'monotoneY'`, `'natural'`, `'step'`, `'stepBefore'`, `'stepAfter'`.

{{"demo": "InterpolationDemo.js", "bg": "inline"}}

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

{{"demo": "CSSCustomization.js", "bg": "inline"}}
