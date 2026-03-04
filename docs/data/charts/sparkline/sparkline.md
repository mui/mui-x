---
title: React Sparkline chart
productId: x-charts
components: SparkLineChart
---

# Charts - Sparkline

<p class="description">Show data trends in a compact form without axes or coordinates.</p>

A sparkline is a small, axis-free chart that plots a sequence of values.
It stays compact so it can sit inline—in a table cell, a dashboard widget, or next to text—and the shape of the curve or bars conveys the trend without scales or labels.

For example, npm uses a sparkline to display a package's weekly 
downloads trend.

{{"demo": "NpmSparkLine.js"}}

## Basics

`SparkLineChart` only needs the `data` prop, which is an array of numbers.
Use `plotType="bar"` to switch from a line to a bar plot.

{{"demo": "BasicSparkLine.js"}}

## Line customization

Set the `area` prop to fill the area under the curve.
Use the `curve` prop to change how the line is interpolated between points.
See the [line charts—Interpolation](/x/react-charts/lines/#interpolation) section for curve options.

{{"demo": "AreaSparkLine.js"}}

## Interaction

The sparkline has extra props to configure interaction: `showTooltip` and `showHighlight` turn on the default tooltip and highlight.

For more control, pass custom props to the `tooltip` and `highlight` slots as described on the [Tooltip](/x/react-charts/tooltip/) page.

{{"demo": "BasicSparkLineCustomization.js"}}

## Axis management

### X-axis data

By default, the sparkline uses an ascending integer sequence starting from 0 (0, 1, 2, …) for the x-axis.
Those values are hidden in the tooltip.
Use the `xAxis` prop when your data are not evenly spaced or when you need custom labels.

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
See the [Axis—Relative axis subdomain](/x/react-charts/axis/#relative-axis-subdomain) section for details.

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

Clipping is on by default; `clipAreaOffset` defaults to 1 to reduce visible clipping.
Set `disableClipping` to `true` to turn clipping off.

The demo below shows how stroke width, `disableClipping`, and `clipAreaOffset` affect the result.

{{"demo": "SparklineLineWidth.js"}}
