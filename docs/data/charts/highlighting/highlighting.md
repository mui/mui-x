---
productId: x-charts
components: ChartsAxisHighlight
---

# Charts - Highlighting

<p class="description">Highlighting data offers quick visual feedback for chart users.</p>

It can be used to emphasize a specific data point or series, or to fade out the rest of the chart.
And it can be controlled by the user or synchronized across multiple charts.

## Highlighting axis

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

## Highlighting series

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

## Controlled highlight

### Item

The item highlight can be controlled by using `highlightedItem` and `onHighlightChange`.

You can set the `highlightedItem` value based on inputs, and sync it when the user hover over an item themselves.

{{"demo": "ControlledHighlight.js"}}

### Axis

The highlight can be controlled by using `xAxisHighlight`/`yAxisHighlight` and the `onXAxisInteraction`/`onYAxisInteraction`.

The `xAxisHighlight`/`yAxisHighlight` are objects `{ axisId, dataIndex, value }`.
If the `dataIndex` is provided, the axis `value` is ignored an computed from the `dataIndex` and `axis.data`.

The `onXAxisInteraction`/`onYAxisInteraction` handler are trigger each time pointer moves from one axis value to another.
Its parameter is an array of objects `{ axisId, dataIndex, value }`.
One per axis.

:::warning
The handler get an array of axis value identifier.
Whereas the controlled value only accept on objects.

For now highlight components assume you use the first axis.
Being able to highlight any axis will arrive in further development.
:::

{{"demo": "ControlledAxisHighlight.js"}}

### Synchronizing highlights

Having a controlled highlight allows you to control it in multiple charts at the same time.
You need to ensure that the `series` has the same `ids` and the data is in the same order.

{{"demo": "SyncHighlight.js"}}
