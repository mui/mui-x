---
productId: x-charts
title: Charts - Highlighting
components: ChartsAxisHighlight
---

# Charts - Highlighting

<p class="description">Highlight data points and series to provide quick visual feedback.</p>

Highlighting can emphasize specific data points or series, or fade out the rest of the chart.
Control it programmatically or synchronize it across multiple charts.

## Highlighting axis

Highlight data based on mouse position.
By default, highlights appear as lines, but you can also display them as a vertical band if your x-axis uses `scaleType: 'band'`.

To customize this behavior, use the `axisHighlight` prop:

```jsx
axisHighlight={{
  x: 'line', // Or 'none', or 'band'
  y: 'line', // Or 'none'
}}
```

{{"demo": "BandHighlight.js" }}

## Highlighting series

When hovering over elements, a tooltip is shown by default.
You can also configure highlighting and fading independently of the tooltip.

This interaction is controlled by the `highlightScope` property on `series`, which contains two options:

- `highlighted`: Indicates which item to highlight. Its value can be:
  - `'none'`: Do nothing (default)
  - `'item'`: Only highlight the item itself
  - `'series'`: Highlight all items in the series
- `faded`: Indicates which item to fade (if they're not already highlighted). Its value can be:
  - `'none'`: Do nothing (default)
  - `'series'`: Fade all items in the series
  - `'global'`: Fade all items in the chart

:::info
For Line charts, you can increase the interaction area by using slots.
See [Line demos—Larger interaction area](/x/react-charts/line-demo/#larger-interaction-area) for an example of this.
:::

{{"demo": "ElementHighlights.js"}}

## Controlled item highlight

You can control the highlighted item using the `highlightedItem` and `onHighlightChange` props.
You can set the `highlightedItem` value based on inputs, and sync it when the user hovers over an item.

{{"demo": "ControlledHighlight.js"}}

## Controlled axis highlight

Control the highlighted axis item using the `highlightedAxis` prop.
Its value is an array of `{ axisId: string, dataIndex: number }` objects.
When the array is empty, nothing is highlighted.

The `onHighlightedAxisChange` handler triggers each time the pointer crosses the boundaries between two axis values.
It receives an array of one `{ axisId, dataIndex }` object per axis containing at least one data point.

:::warning
The `onHighlightedAxisChange` handler can trigger at a high frequency when the user moves their pointer over the chart.

To avoid performance issues, avoid recreating objects that are passed to props on every render.
Instead, define them outside the component, or memoize them.
This is especially important for axes and series, which, when updated, trigger significant computation.

```jsx
// ❌ The chart gets a new axis on each render, leading to redundant computation.
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

With controlled highlights, you can synchronize them across multiple charts.
Ensure that the `series` have the same IDs and that the data is in the same order.

{{"demo": "SyncHighlight.js"}}
