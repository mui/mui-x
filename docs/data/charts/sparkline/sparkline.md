---
title: React Sparkline chart
productId: x-charts
components: SparkLineChart
---

# Charts - Sparkline

<p class="description">Use sparklines to show value trends in a compact chart without axes or coordinates.</p>

## Overview

A sparkline is a small chart without axes that plots a sequence of values.
It stays compact so you can place it inline (for example, in a table cell, a dashboard widget, or next to text).
The curve or bar shape conveys the trend without scales or labels.

The demo below shows how npm displays a package's weekly download trend in a sparkline.

{{"demo": "NpmSparkLine.js"}}

## Basics

`SparkLineChart` only needs the `data` prop, which is an array of numbers.
Set `plotType` to `"bar"` to switch from a line chart to a bar chart.

{{"demo": "BasicSparkLine.js"}}

## Line customization

Set the `area` prop to fill the area under the curve.
Use the `curve` prop to change how the line is interpolated between points.
See [Lines—Interpolation](/x/react-charts/lines/#interpolation) for curve options.

{{"demo": "AreaSparkLine.js"}}

## Interaction

Use the `showTooltip` and `showHighlight` props to enable the default tooltip and highlight.

For more control, pass custom props to the `tooltip` and `highlight` slots.
See [Tooltip](/x/react-charts/tooltip/) for details.

{{"demo": "BasicSparkLineCustomization.js"}}

## Axis management

### X-axis data

By default, the sparkline uses an ascending integer sequence starting at 0 (0, 1, 2, …) for the x-axis.
Those values are hidden in the tooltip.
Use the `xAxis` prop when your data points are not evenly spaced or when you need custom labels.

The sparkline has a single axis, so `xAxis` takes one axis configuration object, not an array.

```jsx
<SparkLineChart data={[1, 4, 2, 5, 7, 2, 4, 6]} xAxis={{ scaleType, data }} />
```

{{"demo": "CustomAxis.js"}}

### Y-axis range

Set `min` and `max` on the `yAxis` configuration to fix the y-axis range.

The demo below shows two sparklines with different value scales: the first row uses the default y-axis, and the second row uses a fixed range from 0 to 100.

{{"demo": "CustomYAxis.js"}}

Use the `domainLimit` option in the `yAxis` configuration to adjust the y-axis range relative to the data.
See [Axis—Relative axis subdomain](/x/react-charts/axis/#relative-axis-subdomain) for details.

The demo below uses the same data (values from -15 to 92) with different `domainLimit` settings.

{{"demo": "CustomDomainYAxis.js"}}

## Color customization

Pass a color to the `color` prop to set the sparkline color.

{{"demo": "ColorCustomization.js"}}

The `color` prop also accepts a function that receives the mode (`'light'` or `'dark'`), so you can change the color for the current theme.

The demo below uses a white line in dark mode and a black line in light mode.

{{"demo": "ColorCustomizationMode.js"}}

## Line width

The default stroke width for sparkline lines is 2px.
With clipping enabled, a line drawn at the chart edge can be partially clipped.

Clipping is on by default.
`clipAreaOffset` defaults to 1 to reduce visible clipping.
Set `disableClipping` to `true` to turn clipping off.

The demo below shows how stroke width, `disableClipping`, and `clipAreaOffset` affect the result.

{{"demo": "SparklineLineWidth.js"}}
