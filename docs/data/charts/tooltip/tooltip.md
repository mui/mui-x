---
title: Charts - Tooltip
---

# Charts - Tooltip

<p class="description">Tooltip provides extra data on charts item.</p>

In all charts components, you can pass props to the tooltip by using `tooltip={{...}}`.
If you are using composition, you can add the `<Tooltip />` component and pass props directly.

## Interactions

The tooltip can be triggered by two kinds of events:

- `'item'`—when the user's mouse hovers over an item on the chart, the tooltip will display data about this specific item.
- `'axis'`—the user's mouse position is associated with a value of the x-axis. The tooltip will display data about all series at this specific x value.

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

In parallel with the tooltip, you can highlight/fade elements.

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

## Customization

### Formatting

The format of data rendered in the tooltip can be modified thanks to the series `valueFormatter` property.
The same can be applied to x values when a tooltip is triggered by the `'axis'`.

Here is a demo with:

- The time axis is formatted to only show the year
- The number values are formatted in U.S. Dollars.

{{"demo": "Formatting.js"}}

### Hiding values

You can hide the axis value with `hideTooltip` in the `xAxis` props.
It will remove the header showing the x-axis value from the tooltip.

```jsx
<LineChart
  // ...
  xAxis={[{ data: [ ... ], hideTooltip: true }]}
/>
```

## Composition

If you're using composition, by default the axis will be listening for mouse events to get its current x/y values.
If you don't need it, because you don't use highlights, and the tooltip is triggered by an item, you can disable those listeners with the `disableAxisListener` prop.

```jsx
<ChartContainer {...} disableAxisListener>
  {/* ... */}
</ChartContainer>
```
