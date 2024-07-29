---
title: Charts - Tooltip
productId: x-charts
components: ChartsTooltip, DefaultChartsAxisTooltipContent, DefaultChartsItemTooltipContent, ChartsAxisHighlight
---

# Charts - Tooltip

<p class="description">Tooltip provides extra data on charts item.</p>

In all charts components, you can pass props to the tooltip by using `tooltip={{...}}`.
If you are using composition, you can add the `<ChartsTooltip />` component and pass props directly.

## Tooltip trigger

The tooltip can be triggered by two kinds of events:

- `'item'`—when the user's mouse hovers over an item on the chart, the tooltip will display data about this specific item.
- `'axis'`—the user's mouse position is associated with a value of the x-axis. The tooltip will display data about all series at this specific x value.
- `'none'`—disable the tooltip.

{{"demo": "Interaction.js"}}

## Highlights

### Highlighting axis

You can highlight data based on mouse position.
By default, those highlights are lines, but it can also be a vertical band if your x-axis use `scaleType: 'band'`.

On the chart, to customize this behavior, you can use:

```jsx
axisHighlight={{
  x: 'line', // Or 'none', or 'band'
  y: 'line', // Or 'none'
}}
```

{{"demo": "BandHighlight.js" }}

### Highlighting series

In parallel with the tooltip, you can highlight and fade elements.

This kind of interaction is controlled by series properties `highlightScope` which contains two options:

- `highlighted` Indicates which item to highlight. Its value can be
  - `'none'` Do nothing (default one).
  - `'item'` Only highlight the item itself.
  - `'series'` Highlight all items of the series.
- `faded` Indicates which item to fade (if they are not already highlighted). Its value can be
  - `'none'` Do nothing (default one).
  - `'series'` Fade all the items of the series.
  - `'global'` Fade all the items of the chart.

{{"demo": "ElementHighlights.js"}}

### Controlled Highlight

The highlight can be controlled by the user when they set `highlightedItem` and `onHighlightChange`.

You can set the `highlightedItem` value based on inputs, and sync it when the user hover over an item themselves.

{{"demo": "ControlledHighlight.js"}}

#### Synchronizing Highlights

Having a controlled highlight allows you to control it in multiple charts at the same time.
You just need to ensure that the `series` have the same `ids` and the data is in the same order.

{{"demo": "SyncHighlight.js"}}

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
It will remove the header showing the x-axis value from the tooltip.

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

If you're using composition, by default, the axis will be listening for mouse events to get its current x/y values.
If you don't need it, you can disable those listeners with the `disableAxisListener` prop.

You need those listeners if you are using [axes highlight](/x/react-charts/tooltip/#highlighting-axis) or you have a tooltip [triggered by axis](/x/react-charts/tooltip/#tooltip-trigger).

```jsx
<ChartContainer {...} disableAxisListener>
  {/* ... */}
</ChartContainer>
```
