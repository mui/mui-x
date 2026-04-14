---
title: Charts - Axis
productId: x-charts
components: ChartsAxis, ChartsReferenceLine, ChartsText, ChartsXAxis, ChartsYAxis
---

# Charts - Axis

<p class="description">Define, format, and customize Chart axes.</p>

An axis is a reference line that data points are measured against in a chart.
The MUI X Line Chart, Bar Chart, Scatter Chart, and Heatmap give you customization options for both x-axes and y-axes to suit a wide range of use cases.

## Creating custom axes

Use the `xAxis` and `yAxis` props to define custom axes.
These props expect an array of objects.

In the demo below, two lines are rendered using the same data points.
One has a linear y-axis and the other has a logarithmic one.
Each axis definition is identified by its property `id`.
Then each series specifies the axis it uses with the `xAxisId` and `yAxisId` properties.

{{"demo": "ScaleExample.js"}}

:::info
ID management, as shown in the example above, is not necessary for most common use cases.

If you don't provide `xAxisId` or `yAxisId` then the series uses the axis defined first.
This is why you won't see definitions of `id`, `xAxisId`, or `yAxisId` in most demos in the Charts docs—they rely on the default values.
:::

### Axis type and data

The axis type is specified by its property `scaleType`.
The axis definition object has a `data` property which expects an array of values corresponding to the `scaleType`, as shown in the table below:

| scaleType                              | Description                                              | Number | Date | String |
| :------------------------------------- | :------------------------------------------------------- | :----: | :--: | :----: |
| `'band'`                               | Splits the axis in equal bands.                          |   ✅   |  ✅  |   ✅   |
| `'point'`                              | Splits the axis in equally spaced points.                |   ✅   |  ✅  |   ✅   |
| `'linear'` `'log'` `'symlog'` `'sqrt'` | Maps numerical values to the available space.            |   ✅   |  ❌  |   ❌   |
| `'time'` `'utc'`                       | Maps JavaScript `Date()` objects to the available space. |   ❌   |  ✅  |   ❌   |

Some series types also require specific axis attributes:

- In line charts, the `xAxis` must have a `data` array so each y-value maps to a specific x-value for proper chart rendering.
- In bar charts, the axis that represents categories (x-axis for vertical bars or y-axis for horizontal bars) must use `scaleType: 'band'`.

## Axis formatter

Axis data can be displayed in ticks, tooltips, and other locations.
You can use the `valueFormatter` property to change how the data is displayed.
The formatter's second argument provides rendering context for advanced use cases.

In the demo below, `valueFormatter` is used to shorten months and introduce a new line for ticks.
It uses the `context.location` to determine where the value is rendered.

{{"demo": "FormatterDemo.js"}}

### Ticks without labels

Some use cases may call for displaying ticks with no labels.
For example, it's common to use ticks to indicate a logarithmic scale but omit the labels from the axis when they'd be too numerous or complex to display.

The default tick formatter achieves this by rendering an empty string for ticks that should not show labels.
If you want to customize the formatting, but want to keep the default behavior for ticks without labels, you can check that the `context.defaultTickLabel` property is different from the empty string:

{{"demo": "TicksWithoutLabels.js"}}

### Using the D3 formatter

The context gives you access to the axis scale, the number of ticks (if applicable), and the default formatted value.
You can use the D3 [`tickFormat(tickNumber, specifier)`](https://d3js.org/d3-scale/linear#tickFormat) method to adapt the tick format based on the scale properties as shown below:

{{"demo": "FormatterD3.js"}}

## Axis subdomain

By default, the axis domain is computed so that all data is visible.
To show a specific range of values, you can provide the `min` and/or `max` properties to the axis definition:

```js
xAxis={[
  {
    min: 10,
    max: 50,
  },
]}
```

{{"demo": "MinMaxExample.js"}}

### Relative axis subdomain

You can adjust the axis range relative to its data by using the `domainLimit` option.
This expects one of three possible values:

- `"nice"` (default): Rounds the domain to human-friendly values
- `"strict"`: Sets the domain to the min/max value to display
- `(minValue, maxValue) => { min, max }`: Receives the calculated extrema as parameters, and should return the axis domain

The demo below illustrates these differences in behavior, showing data ranging from -15 to 92 with different domain limits:

{{"demo": "CustomDomainYAxis.js"}}

## Axis direction

By default, the axes run from left to right and from bottom to top.
You can apply the `reverse` property to change this:

{{"demo": "ReverseExample.js"}}

## Position

You can customize axis positioning with the `position` property of the axis configuration.
This property expects the following values:

- `'top'` or `'bottom'` for the x-axis
- `'left'` or `'right'` for the y-axis
- `'none'` to hide the axis

{{"demo": "ModifyAxisPosition.js"}}

### Hiding axes

To hide an axis, set its `position` to `'none'`.
Note that the axis is still computed and used for scaling.

{{"demo": "HidingAxis.js"}}

### Multiple axes on one side

You can display multiple axes on one side.
If two or more axes share the same `position`, they're displayed in the order they're defined from closest to farthest away from the chart.

{{"demo": "MultipleAxes.js"}}

### Coordinates

You can obtain the coordinates of the axis by calling the `useXAxisCoordinates()` or `useYAxisCoordinates()` hooks.

Below is an example of how to use the these hooks to get the coordinates of several axes and render rectangles delineating their area.

{{"demo": "AxisCoordinatesDemo.js"}}

## Grouped axes

To group `band` or `point` axes together, provide a `groups` property in the axis definition.
This property expects an array of objects with a `getValue()` function.
This feature is available for both x- and y-axes.

The `getValue()` function receives the axis data value and should return a group name.
Each group name is used as-is, overriding any `valueFormatter` for the axis.
Groups are displayed in the order they're defined in the `groups` array.

The demos below show the feature with:

- The x-axis grouped by month, quarter, and year.
- The y-axis is grouped by category and subcategory.

{{"demo": "GroupedAxes.js", "defaultCodeOpen": false}}

{{"demo": "GroupedYAxes.js", "defaultCodeOpen": false}}

## Auto-sizing axes

You can set the axis `height` (for x-axes) or `width` (for y-axes) to `'auto'` to automatically calculate the axis dimension based on the tick label measurements.
This is useful when your tick labels have varying lengths or when you use rotated labels.

{{"demo": "AxisAutoSize.js"}}

Auto-sizing works well with rotated tick labels.
In the demo below, adjust the angle slider to see how the axis height automatically adapts to accommodate the rotated labels.

{{"demo": "AxisAutoSizeRotated.js"}}

Auto-sizing also works with grouped axes.
When an axis has `groups` defined, the auto-size calculation accounts for each group level's tick labels and tick sizes.

{{"demo": "GroupedAxesAutoSize.js"}}

:::info
Auto-sizing is computed on the client side after hydration.
During server-side rendering (SSR), the axis uses the default size until the client-side measurement is complete.
:::

## Symlog scale

A log scale cannot plot zero because log(0) is undefined.
To overcome this, you can use a symlog scale, which uses a linear scale for values close to zero and a logarithmic scale for the rest.
You can customize the value where the scale switches from linear to logarithmic using the `constant` property, which defaults to 1.

{{"demo": "SymlogScale.js"}}

## Composition

If you're using composition, you must provide the axis settings in the `<ChartsContainer />` using the `xAxis` and `yAxis` props.
This provides all the scaling properties to its children, and lets you use the `<XAxis/>` and `<YAxis/>` components as children.

In turn, those components require an `axisId` prop to link them to an axis you defined in the `<ChartsContainer />`.
You can choose their position with the `position` prop which accepts `'top'`/`'bottom'` for `<XAxis />` and `'left'`/`'right'` for `<YAxis />`.
The props described in the [rendering playground](/x/react-charts/axis-customization/#custom-axis-rendering) are also available.

{{"demo": "AxisWithComposition.js"}}

### Reference line

Use the `<ChartsReferenceLine />` component to add a reference line to a chart.
You can provide an `x` or a `y` prop for a vertical or horizontal line, respectively, at this value.

You can also add a `label` to this reference line, and position it using the `labelAlign` prop which accepts `'start'`, `'middle'`, and `'end'` values.
Elements can be styled with the `lineStyle` and `labelStyle` props.

More examples are available in [docs page about references](/x/react-charts/references/).

{{"demo": "ReferenceLine.js"}}
