---
title: Charts - Axis
productId: x-charts
components: ChartsAxis, ChartsReferenceLine, ChartsText, ChartsXAxis, ChartsYAxis, ChartsReferenceLine
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

## Grid

You can add a grid in the background of a Cartesian chart with the `grid` prop.
This prop accepts an object with `vertical` and `horizontal` properties that are responsible for creating their respective lines when set to `true`.

If you use composition you can pass these as props to the `<ChartsGrid />` component:

```jsx
<BarChart grid={{ vertical: true }}>

<ChartContainer>
  <ChartsGrid vertical />
</ChartContainer>
```

{{"demo": "GridDemo.js"}}

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

You can obtain the coordinates of the axis by calling the `useXAxisCoordinates` or `useYAxisCoordinates` hooks.

Below is an example of how to use the these hooks to get the coordinates of several axes and render rectangles delineating their area.

{{"demo": "AxisCoordinatesDemo.js"}}

## Grouped axes

To group `band` or `point` axes together, provide a `groups` property in the axis definition.
This property expects an array of objects with a `getValue` function.
This feature is available for both x- and y-axes.

The `getValue` function receives the axis data value and should return a group name.
Each group name is used as-is, overriding any `valueFormatter` for the axis.
Groups are displayed in the order they're defined in the `groups` array.

### X-axis grouping

In the demo below, the x-axis is grouped by month, quarter, and year.

{{"demo": "GroupedAxes.js"}}

### Y-axis grouping

In the following demo, the y-axis is grouped by category and subcategory.

{{"demo": "GroupedYAxes.js"}}

### Tick size

You can customize the tick size for each group by providing a `tickSize` property in the `groups` array.
The `tickSize` also affects the tick label position.
Each item in the array corresponds to a group defined in the `getValue` function.

{{"demo": "GroupedAxesTickSize.js"}}

### Styling grouped axes

To target a specific group, use the `data-group-index` attribute as a selector.
The example below has a yellow tick color for the last group and blue text for the first group.

{{"demo": "GroupedAxesStyling.js"}}

## Axis customization

Beyond the axis definition, there are several other ways to further customize how axes are rendered:

### Styling axes by ID

To target a specific axis by its ID, use the `data-axis-id` attribute as a selector.
This is useful when you have multiple axes and want to style them differently.

In the example below, the revenue axis label is styled with a teal color and the profit axis label with a blue color to match their respective series.

{{"demo": "AxisIdStyling.js"}}

### Auto-sizing axes

You can set the axis `height` (for x-axes) or `width` (for y-axes) to `'auto'` to automatically calculate the axis dimension based on the tick label measurements.
This is useful when your tick labels have varying lengths or when you use rotated labels.

{{"demo": "AxisAutoSize.js"}}

Auto-sizing works well with rotated tick labels.
In the demo below, adjust the angle slider to see how the axis height automatically adapts to accommodate the rotated labels.

{{"demo": "AxisAutoSizeRotated.js"}}

:::info
Auto-sizing is computed on the client side after hydration.
During server-side rendering (SSR), the axis uses the default size until the client-side measurement is complete.
:::

### Fixing tick label overflow issues

When your tick labels are too long, they're clipped to avoid overflowing.
To reduce clipping due to overflow, you can [apply an angle to the tick labels](/x/react-charts/axis/#text-customization), use [auto-sizing](/x/react-charts/axis/#auto-sizing-axes), or [increase the axis size](/x/react-charts/styling/#placement) to accommodate them.
In the demo below, the size of the x- and y-axes is modified to increase the space available for tick labels.

The first and last tick labels may bleed into the margin, and if that margin is not enough to display the label, it might be clipped.
To avoid this, you can use the `margin` prop to increase the space between the chart and the edge of the container.

{{"demo": "MarginAndLabelPosition.js"}}

### Rendering

The demo below illustrates all of the props available to customize axis rendering:

{{"demo": "AxisCustomization.js", "hideToolbar": true, "bg": "playground"}}

### Text customization

To customize the text elements (tick labels and axis labels), use the `tickLabelStyle` and `labelStyle` properties of the axis configuration.

When not set, the default values for the `textAnchor` and `dominantBaseline` properties depend on the value of the `angle` property.
You can test how these values behave and relate to one another in the demo below:

{{"demo": "AxisTextCustomization.js", "hideToolbar": true, "bg": "playground"}}

### Adding tick label icons

A `foreignObject` element can be used to render non-SVG elements inside SVGs. You can leverage this to create components that interact with the charts data. In the demo below, custom tick labels are built by displaying an icon below the text.

Bear in mind that using `foreignObject` might prevent charts from being [exported](/x/react-charts/export/).

{{"demo": "TickLabelImage.js"}}

## Symlog scale

A log scale cannot plot zero because log(0) is undefined.
To overcome this, you can use a symlog scale, which uses a linear scale for values close to zero and a logarithmic scale for the rest.
You can customize the value where the scale switches from linear to logarithmic using the `constant` property, which defaults to 1.

{{"demo": "SymlogScale.js"}}

## Composition

If you're using composition, you must provide the axis settings in the `<ChartContainer />` using the `xAxis` and `yAxis` props.
This provides all the scaling properties to its children, and lets you use the `<XAxis/>` and `<YAxis/>` components as children.

In turn, those components require an `axisId` prop to link them to an axis you defined in the `<ChartContainer />`.
You can choose their position with the `position` prop which accepts `'top'`/`'bottom'` for `<XAxis />` and `'left'`/`'right'` for `<YAxis />`.
The props described in the [rendering playground above](/x/react-charts/axis/#rendering) are also available.

{{"demo": "AxisWithComposition.js"}}

### Reference line

Use the `<ChartsReferenceLine />` component to add a reference line to a chart.
You can provide an `x` or a `y` prop for a vertical or horizontal line, respectively, at this value.

You can also add a `label` to this reference line, and position it using the `labelAlign` prop which accepts `'start'`, `'middle'`, and `'end'` values.
Elements can be styled with the `lineStyle` and `labelStyle` props.

{{"demo": "ReferenceLine.js"}}
