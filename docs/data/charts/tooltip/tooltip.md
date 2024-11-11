---
title: Charts - Tooltip
productId: x-charts
components: ChartsTooltip, DefaultChartsAxisTooltipContent, DefaultChartsItemTooltipContent
---

# Charts - Tooltip

<p class="description">Tooltip provides extra data on charts item.</p>

In all charts components, you can pass props to the tooltip by using `tooltip={{...}}`.
If you are using composition, you can add the `<ChartsTooltip />` component and pass props directly.

## Tooltip trigger

The tooltip can be triggered by two kinds of events:

- `'item'`—when the user's mouse hovers over an item on the chart, the tooltip displays data about this specific item.
- `'axis'`—the user's mouse position is associated with a value of the x-axis. The tooltip displays data about all series at this specific x value.
- `'none'`—disable the tooltip.

{{"demo": "Interaction.js"}}

## Customization

### Formatting

The format of data rendered in the tooltip can be modified thanks to the series `valueFormatter` property.
The same can be applied to x values when a tooltip is triggered by the `'axis'`.

Here is a demo with:

- The time axis is formatted to only show the year
- The number values are formatted in U.S. Dollars.

{{"demo": "Formatting.js"}}

### Advanced formatting

The series `valueFormatter` provides a context as its second argument containing a `dataIndex` property which you can use to calculate other data-related values.

In the demo below you can notice we use `dataIndex` to add each team's rank in the tooltip.

{{"demo": "SeriesFormatter.js"}}

### Axis formatter

To modify how data is displayed in the axis use the `valueFormatter` property.

Its second argument is a context that provides a `location` property with either `'tick'` or `'tooltip'`.

In this demo, you can see:

- The country axis displays only the country code
- The label displays annotated data `Country: name (code)`

{{"demo": "AxisFormatter.js"}}

### Label formatting

The label text inside the tooltip can also be formatted conditionally by providing a function to the series `label` property.

```jsx
<LineChart
  // ...
  series={[
    {
      data: [ ... ],
      label: (location) => location === 'tooltip' ? 'BR' : 'Brazil'
    }
  ]}
/>
```

:::info
See [Label—Conditional formatting](/x/react-charts/label/#conditional-formatting) for more details.
:::

### Hiding values

You can hide the axis value with `hideTooltip` in the `xAxis` props.
It removes the header showing the x-axis value from the tooltip.

```jsx
<LineChart
  // ...
  xAxis={[{ data: [ ... ], hideTooltip: true }]}
/>
```

### Overriding content

To modify the tooltip content, use `slots.itemContent` or `slots.axisContent`.
The first one is rendered when tooltip trigger is set to `"item"`.
The second one when trigger is set to `"axis"`.

```jsx
// With single component
<LineChart
  slots={{
    itemContent: CustomItemTooltip
  }}
/>

// With composition
<ChartContainer>
  // ...
  <Tooltip
    trigger='item'
    slots={{
      itemContent: CustomItemTooltip
    }}
  />
</ChartContainer>
```

## Composition

If you're using composition, by default, the axis listens for mouse events to get its current x/y values.
If you don't need it, you can disable those listeners with the `disableAxisListener` prop.

You need those listeners if you are using [axes highlight](/x/react-charts/highlighting/#highlighting-axis) or you have a tooltip [triggered by axis](/x/react-charts/tooltip/#tooltip-trigger).

```jsx
<ChartContainer {...} disableAxisListener>
  {/* ... */}
</ChartContainer>
```

### Overriding content

#### Item Tooltip

You can create your own tooltip by using `useItemTooltip()`.
This hook returns the information about the current item user is interacting with.
It contains:

- `identifier`: An object that identify the item. Which often contains its series type, series id, and data index.
- `color`: The color used to display the item. This includes the impact of [color map](/x/react-charts/styling/#values-color).
- `label`, `value`, `formattedValue`: Values computed to simplify the tooltip creation.

To follow the mouse position, you can track pointer events on the SVG thanks to `useSvgRef`.

{{"demo": "CustomTooltipContent.js"}}

#### Axis Tooltip

Like in previous section, you can create your own tooltip by using `useAxisTooltip()`.
This hook returns the information about the current axis user is interacting with and the relevant series.
It contains:

- `identifier`: An object that identify the axis. Which often contains its series type, series id, and data index.
- `color`: The color used to display the item. This includes the impact of [color map](/x/react-charts/styling/#values-color).
- `label`, `value`, `formattedValue`: Values computed to simplify the tooltip creation.

To follow the mouse position, you can track pointer events on the SVG thanks to `useSvgRef`.

{{"demo": "CustomAxisTooltipContent.js"}}

### Tooltip position

This demo show example about how to use additional hooks such as `useXAxis()` or `useDrawingArea()` to customize the tooltip position.

{{"demo": "CustomTooltipPosition.js"}}
