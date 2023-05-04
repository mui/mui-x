---
product: charts
title: Charts - Tooltip
---

# Charts - Tooltip

<p class="description">Tooltip provides extra data on charts item.</p>

In all charts components, you can pass props to the tooltip by using `tooltip={{...}}`.
If you are using composition, you can add the `<Tooltip />` component and pass props directly.

## Interactions

The tooltip can be triggered by two kind of events:

- `'item'` which means user mouse is hover an item of the chart. The tooltip will display data about this specific items.
- `'axis'` which means user mouse position is associated to a value of the x-axis. The tooltip will display data about all series at this specific x value.

{{"demo": "Interaction.js", "bg": "inline"}}

## Highlights

## Highlighting axis

You can hightligh data based on mouse position.
By default those highlights are lines, but is can also be a vertical band if your x-axis use `scaleType: 'band`.

On chart, to customize this behavior,you can use

```jsx
highlight={{
    x: 'line', // Or 'none', or 'band'
    y: 'line', // Or 'none'
    }}
```

{{"demo": "BandHighlight.js",  "bg": "inline"}}

## Highlighting series 🚧

When the tooltip is highlighting elements, their style can be modified, and the style of other elements can be fade-out.

This is under construction, and require some management to avoid ending up with a blinking christmas tree.

Here is a demo of what it could be but needing much more work.

{{"demo": "Highlights.js", "bg": "inline"}}

## Customization

The format of data rendered in the tooltip can be modified thanks to series' `valueFormatter` property.
Same applied for x values when tooltip is triggered by `'axis'`.

Here is a demo with:

- Time axis formatted to only show the year
- Number values formatted in U.S. Dollar.

{{"demo": "Formatting.js", "bg": "inline"}}

## Composition

If you're using composition, by default the mouse event will not be listen.
If you need it (for example to support highlight or tooltip with `trigger='axis'`) you should add `<AxisInteractionListener />`.

```jsx
<ChartContainer {...}>
  <AxisInteractionListener listen/>
  {/* ... */}
</ChartContainer>
```
