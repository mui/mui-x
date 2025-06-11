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

## Controlled item highlight

The item highlight can be controlled by using `highlightedItem` and `onHighlightChange`.

You can set the `highlightedItem` value based on inputs, and sync it when the user hover over an item themselves.

{{"demo": "ControlledHighlight.js"}}

## Controlled axis highlight

The highlight can be controlled by using `highlightedAxis` prop.
Its value can be `null` to remove axis highlight, or an object `{ direction: 'x' | 'y', axisId: string, dataIndex: number }`.

The `onAxisInteraction` handler is trigger each time the pointer crosses the boundaries between two axis values.
Its parameter is an array of objects `{ direction, axisId, dataIndex }`.
One per axis.
Axes without data are ignored by the handler.

The handler gets an array of objects.
Whereas the controlled value only accept one object.

:::warning
The `onAxisInteraction` can be triggered at a high frequency when user move their pointer on the chart.

To avoid performance issues, avoid defining object in the props which creates a new reference at each render.
Either define them outside the component, or memoize them.

Especially for axes and series which when updated impact a lot of computation.

```jsx
// ❌ The chart gets a new axis at each render. Leading to useless computation.
const Component = () => <BarChart xAxis={[{ data: [1, 2, 3]}]}>

// ✅ For static settings, define them outside the component.
const quarterAxis = [{ data: ['Q1', 'Q2', 'Q3', 'Q4'] }];
const Component = () => <BarChart xAxis={quarterAxis}>

// ✅ For dynamic settings, memoize them.
const Component = ({ data }) => {
  const axis = React.useMemo(() => [{ data }], [data]);
  return <BarChart xAxis={quarterAxis}>
}
```

:::

{{"demo": "ControlledAxisHighlight.js"}}

## Synchronizing highlights

Having a controlled highlight allows you to control it in multiple charts at the same time.
You need to ensure that the `series` has the same `ids` and the data is in the same order.

{{"demo": "SyncHighlight.js"}}
