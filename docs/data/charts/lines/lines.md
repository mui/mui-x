---
product: charts
title: Charts - Lines
---

# Charts - Lines

<p class="description">Line charts can express qualities about data, such as hierarchy, highlights, and comparisons.</p>

## Overview

### Data format

To plot lines, series must be of type `'line'` and have property `data` containing an array of numbers.
It has to be associated to an xAxis with `data` property.

:::info
Latter on, the `xAxis` should be optional with by default an axis with `data:[1, 2, 3, ...]`.
:::

{{"demo": "BasicLineChart.js", "bg": "inline"}}

### Adding area

You can fill the area be:low the curve by defining the series' property `area`.
This property will be used to customize the area.
But you can simply pass an empty object if you're fine with default settings.

Overlapping areas is not a nice pattern.
To stack lines, you can define the `stack` property.
LInes with the same `stack` value will be stacked on top of each other.

{{"demo": "StackedAreas.js", "bg": "inline"}}

## Styling

### Interpolation

### CSS

Line pots are made of two elements named `LineElement` and `AreaElement` (will come `SymbolElement`).
Each element can be selected with the CSS class name `.MuiLineElement-root` or `.MuiAreaElement-root`.
If you want to select the element of a given series, you can use classes `.MuiLineElement-series-<seriesId>` with `<seriesId>` the id of the series you want to customize.

In the next example, we use the following code to customize line style, and the area of the germany GDP.
The definition of `myGradient` is passed as a children of the chart component.

```jsx
sx={{
  '& .MuiLineElement-root': {
    strokeDasharray: '10 5',
  },
  '& .MuiAreaElement-series-Germany': {
    fill: "url('#myGradient')",
  },
}}
```

{{"demo": "CSSCustomization.js", "bg": "inline"}}

### Props

I assume, we could have properties `area`, `line`, and `symbol` in the series definition. Those objects would the be passes as props to the components.
