---
product: charts
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

{{"demo": "Interaction.js", "bg": "inline"}}

## Highlights

### Highlighting axis

You can highlight data based on mouse position.
By default, those highlights are lines, but it can also be a vertical band if your x-axis use `scaleType: 'band'`.

On the chart, to customize this behavior, you can use:

```jsx
highlight={{
  x: 'line', // Or 'none', or 'band'
  y: 'line', // Or 'none'
}}
```

{{"demo": "BandHighlight.js",  "bg": "inline"}}

### Highlighting series 🚧

When the tooltip is highlighting elements, their style can be modified, and the style of other elements can be fade-out.

This is under construction, and requires some management to avoid ending up with a blinking Christmas tree.

Here is a demo of what it could be but needing much more work.

{{"demo": "Highlights.js", "bg": "inline"}}

## Customization

The format of data rendered in the tooltip can be modified thanks to the series `valueFormatter` property.
The same can be applied to x values when a tooltip is triggered by the `'axis'`.

Here is a demo with:

- Time axis formatted to only show the year
- Number values formatted in U.S. Dollar.

{{"demo": "Formatting.js", "bg": "inline"}}

## Composition

If you're using composition, by default the axis will be listening for mouse events to get its current x/y values.
If you don't need it, because you don't use highlights, and the tooltip is triggered by an item, you can disable those listeners with the `disableAxisListener` prop.

```jsx
<ChartContainer {...} disableAxisListener>
  {/* ... */}
</ChartContainer>
```
