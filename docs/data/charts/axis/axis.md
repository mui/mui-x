---
title: Charts - Axis
productId: x-charts
components: ChartsAxis, ChartsReferenceLine, ChartsText, ChartsXAxis, ChartsYAxis, ChartsReferenceLine
---

# Charts - Axis

<p class="description">Define, format, and customize Chart axes.</p>

An axis is a reference line that data points are measured against in a chart.
The MUI X Line Chart, Bar Chart, and Scatter Chart give you customization options for both x-axes and y-axes to suit a wide range of use cases.

## Creating custom axes

Use the `xAxis` and `yAxis` props to define custom axes.
These props expect an array of objects.

In the demo below, two lines are rendered using the same data points.
One uses linear axes and the other is logarithmic.
Each axis definition is identified by its property `id`.
Then each series specifies the axis it uses with the `xAxisId` and `yAxisId` properties.

{{"demo": "ScaleExample.js"}}

:::info
ID management, as shown in the example above, is not necessary for most common use cases.

If you don't provide `xAxisId` or `yAxisId` then the series uses the first axis defined.
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
  <ChartsGrid vertical >
</ChartContainer>
```

{{"demo": "GridDemo.js"}}

## Tick position

### Automatic tick position

Use the `tickNumber` property to customize the number of ticks.

:::info
This number does _not_ necessarily represent the exact number of ticks that will be displayed.
This is because D3 automatically places ticks to optimize for human readability, and it will round up or down from the provided `tickNumber` as needed to accomplish this.

For example, if you set `tickNumber=5` but there are only four years to display on the axis, the component will render four total ticks (one for each year) instead of trying to divide four years into five.
:::

To better control how the ticks render, you can also provide `tickMinStep` and `tickMaxStep`, which compute `tickNumber` so that the step between two ticks respects the minimum and maximum values.

In the demo below, the top axis has a `tickMinStep` of half a day, and the bottom axis has a `tickMinStep` of a full day.

{{"demo": "TickNumber.js"}}

### Fixed tick position

If you want more control over the tick position, you can use the `tickInterval` property.
This property accepts an array of values that define where ticks will be placed.

For axes with the`'point'` scale type, the `tickInterval` property can be a filtering function of the type `(value, index) => boolean`.

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

## Grouped axes

To group `band` or `point` axes together, provide a `groups` property in the axis definition.
This property expects an array of objects with a `getValue` function.
This feature is available for both x- and y-axes.

The `getValue` function receives the axis data value and should return a group name.
Each group name will be used as is, overriding any `valueFormatter` for the axis.
Groups are displayed in the order they are defined in the `groups` array.

### X-axis grouping

In the next demo, the x-axis is grouped by month, quarter, and year.

{{"demo": "GroupedAxes.js"}}

### Y-axis grouping

In the following demo, the y-axis is grouped by category and subcategory.

{{"demo": "GroupedYAxes.js"}}

### Tick size

The tick size can be customized for each group.
To do so, you can provide a `tickSize` property in the `groups` array, the `tickSize` also affects the tick label position.
Each item in the array corresponds to a group defined in the `getValue` function.

{{"demo": "GroupedAxesTickSize.js"}}

### Grouped axes styling

In order to target a specific group, the `data-group-index` attribute can be used as a selector.
The example below has a yellow tick color for the last group and blue text for the first group.

{{"demo": "GroupedAxesStyling.js"}}

## Axis customization

You can further customize the axis rendering besides the axis definition.

### Fixing tick label overflow issues

When your tick labels are too long, they are clipped to avoid overflowing.
If you would like to reduce clipping due to overflow, you can [apply an angle to the tick labels](/x/react-charts/axis/#text-customization) or [increase the axis size](/x/react-charts/styling/#placement) to accommodate them.

In the following demo, the size of the x- and y-axes is modified to increase the space available for tick labels.

The first and last tick labels may bleed into the margin. If that margin is not enough to display the label, it might be clipped.
To avoid this, you can use the `margin` prop to increase the space between the chart and the edge of the container.

{{"demo": "MarginAndLabelPosition.js"}}

### Rendering

Axes rendering can be further customized. Below is an interactive demo of the axis props.

{{"demo": "AxisCustomization.js", "hideToolbar": true, "bg": "playground"}}

### Text customization

To customize the text elements (ticks label and the axis label) use the `tickLabelStyle` and `labelStyle` properties of the axis configuration.

When not set, the default values for the properties `textAnchor` and `dominantBaseline` depend on the value of the `angle` property.
You can test below how the value of `angle` influences them.

{{"demo": "AxisTextCustomization.js", "hideToolbar": true, "bg": "playground"}}

## Symlog scale

A log scale cannot plot zero since the logarithm of zero is undefined.

To overcome this, you can use a symlog scale, which uses a linear scale for values close to zero and a logarithmic scale for the remaining ones.

You can also configure the values at which the scale switches from linear to logarithmic with the `constant` property, which defaults to 1.

{{"demo": "SymlogScale.js"}}

## Composition

If you are using composition, you have to provide the axis settings in the `<ChartContainer />` by using `xAxis` and `yAxis` props.

It will provide all the scaling properties to its children, and lets you use `<XAxis/>` and `<YAxis/>` components as children.
Those components require an `axisId` prop to link them to an axis you defined in the `<ChartContainer />`.

You can choose their position with `position` prop which accepts `'top'`/`'bottom'` for `<XAxis />` and `'left'`/`'right'` for `<YAxis />`.
Other props are similar to the ones defined in the [previous section](/x/react-charts/axis/#rendering).

{{"demo": "AxisWithComposition.js"}}

### Reference line

The `<ChartsReferenceLine />` component add a reference line to the charts.
You can provide an `x` or `y` prop to get a vertical or horizontal line respectively at this value.

You can add a `label` to this reference line.
It can be placed with `labelAlign` prop which accepts `'start'`, `'middle'`, and `'end'` values.
Elements can be styled with `lineStyle` and `labelStyle` props.

{{"demo": "ReferenceLine.js"}}
