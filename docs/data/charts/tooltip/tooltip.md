---
title: Charts - Tooltip
productId: x-charts
components: ChartsTooltip, ChartsAxisTooltipContent, ChartsItemTooltipContent, ChartsTooltipContainer
---

# Charts - Tooltip

<p class="description">Use a tooltip to display additional data when users interact with chart items.</p>

In all chart components, you can access the tooltip via the `tooltip` slot.
If you're composing a custom component, use the `ChartsTooltip` component.

## Tooltip trigger

You can trigger the tooltip with two kinds of events:

- `'item'`: When you hover over an item on the chart, the tooltip displays data about that specific item
- `'axis'`: Your mouse position is associated with a value of the x-axis.
  The tooltip displays data about all series at that specific x value
- `'none'`: Disables the tooltip

To pass this trigger attribute to the tooltip, use `slotProps.tooltip.trigger`.

{{"demo": "Interaction.js"}}

## Formatting

You can modify the format of data rendered in the tooltip using the series `valueFormatter` property.
The same can be applied to axis values when a tooltip is triggered by `'axis'`.

The demo below shows:

- Time axis values formatted to show only the year
- Series values formatted in US dollars

{{"demo": "Formatting.js"}}

### Advanced formatting

The series `valueFormatter` function receives a context as its second argument containing a `dataIndex` property that you can use to calculate other data-related values.

The demo below uses `dataIndex` to add each team's rank in the tooltip.

{{"demo": "SeriesFormatter.js"}}

### Axis formatter

To modify how data is displayed in the axis, use the `valueFormatter` property.

Its second argument is a context that provides a `location` property with either `'tick'` or `'tooltip'`.

In this demo, you can see:

- The country axis displays only the country code
- The label displays annotated data: `Country: name (code)`

{{"demo": "AxisFormatter.js"}}

### Label formatting

You can also format the label text inside the tooltip conditionally by providing a function to the series `label` property.

The example below shows how to shorten the series label in the tooltip but not in the legend.

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

## Hiding values

### Axis

You can hide the axis value using `hideTooltip` in the axis props.
This removes the header showing the x-axis value from the tooltip.

```jsx
<LineChart
  // ...
  xAxis={[{ data: [ ... ], hideTooltip: true }]}
/>
```

### Series

To hide a series, set the formatted value to `null`.
To display the series with a blank space, return an empty string.

## Sorting values

Use the `sort` prop to modify the series order in the axis tooltip.
This prop accepts the following values:

- `'none'` (default): Shows series according to the order they are defined.
- `'asc'`: Sort series by ascending values.
- `'desc'`: Sort series by descending values.

Regardless of the `sort` prop being `'asc'` or `'desc'`, series whose value is `null` are always sorted last.

{{"demo": "SortDemo.js"}}

## Position

By default, the tooltip is placed relative to the pointer position.
If the pointer is not available, it's placed relative to the node instead (for example, the bar in a bar chart).

You can modify this behavior with the `anchor`, `position`, and `placement` props.

- `anchor: 'pointer' | 'node'`: Indicates whether the tooltip should be placed relative to the pointer or the node
- `position: 'top' | 'right' | 'bottom' | 'left'`: Defines the anchor position compared to the node. This prop has no effect if the anchor is the pointer
- `placement`: The tooltip placement from [PopperJS](https://popper.js.org/docs/v2/constructors/#options). It specifies the tooltip position in relation to the anchor position. By default, it uses the same value as `position` if defined

For example, setting `anchor: 'node'`, `position: 'bottom'`, and `placement: 'top'` on a bar chart renders a tooltip above the bottom of a bar.

You can pass these props to the tooltip using `slotProps.tooltip`, or directly to either `ChartsTooltip` or `ChartsTooltipContainer` if you're composing a custom component.

{{"demo": "TooltipPosition.js", "hideToolbar": true, "bg": "playground"}}

## Style modification

Similar to other chart elements, you can style the tooltip using CSS classes.
However, there is one caveat regarding the use of [portals](https://react.dev/reference/react-dom/createPortal):
The tooltip renders as a child of the document's body element.This means that from a DOM perspective, it's not inside the chart, so using the chart's `sx` prop as follows does not work:

```tsx
import { chartsTooltipClasses } from '@mui/x-charts';

<LineChart
  sx={{
    [`& .${chartsTooltipClasses.root} .${chartsTooltipClasses.valueCell}`]: {
      color: 'red',
    },
  }}
/>;
```

To apply the same style as above, use the `sx` prop of the tooltip itself, which should be set in `slotProps.tooltip`.

{{"demo": "TooltipStyle.js"}}

You can also disable the portal by setting `slotProps.tooltip.disablePortal` to `true`.
In that case, the tooltip renders as a child of the chart, and CSS rules are applied as expected.

## Using a custom tooltip

You can create your own fully custom tooltip for advanced use cases.
Use `slots` to replace the default tooltip in single-component charts:

```jsx
<LineChart slots={{ tooltip: CustomItemTooltip }} />
```

When composing a custom component, use your component inside `ChartDataProvider`:

```jsx
<ChartDataProvider>
  <ChartsSurface>{/* ... */}</ChartsSurface>
  <CustomItemTooltip />
</ChartDataProvider>
```

## Controlling the item tooltip

You can control the item tooltip with `tooltipItem` and `onTooltipItemChange`.

When the item tooltip is controlled, the `anchor` is set to `'node'` if the pointer is outside of the chart.

:::warning
Make sure the tooltip `trigger` is set to `"item"`.
Otherwise no tooltip will be shown.
:::

{{"demo": "ControlledTooltip.js"}}

### Synchronizing item tooltip

The item tooltip control can be used to sync tooltips between multiple charts.

{{"demo": "SyncTooltip.js"}}

## Creating a tooltip

To aid in creating a custom tooltip, the library exports helpers which are explained in the sections that follow:

- `ChartsTooltipContainer`: A wrapper providing the open/close state and the position of the tooltip
- `ChartsItemTooltipContent`: Renders the content of the default item tooltip
- `ChartsAxisTooltipContent`: Renders the content of the default axis tooltip
- `useItemTooltip()`: Provides all basic information associated with the current item tooltip
- `useAxesTooltip()`: Provides all basic information associated with the current axes tooltip

### Modifying the position

To override the tooltip position, you can create a wrapper that manages the position.

```jsx
function CustomTooltipPopper(props){
  // ... (event management) ...

  return <NoSsr>
      <Popper {/* position */}>
        {props.children}
      </Popper>
    </NoSsr>
}
```

Then you can either render built-in content (with `ChartsItemTooltipContent` or `ChartsAxisTooltipContent`) or your own component.

```jsx
<CustomTooltipPopper>
  <ChartsItemTooltipContent />
</CustomTooltipPopper>
```

The demo below shows how to use additional hooks such as `useXAxis()` and `useDrawingArea()` to customize the tooltip position.

{{"demo": "CustomTooltipPosition.js"}}

#### Modifying the content

To keep the default placement, use the `ChartsTooltipContainer` wrapper.
It accepts a prop `trigger = 'item' | 'axis'` that defines when the Popper should open.

##### Item content

The `useItemTooltip()` hook provides information about the current item the user is interacting with.
It contains:

- `identifier`: An object that identifies the item, which often contains its series type, series ID, and data index.
- `color`: The color used to display the item, which includes the impact of [`colorMap`](/x/react-charts/styling/#value-based-colors)
- `label`, `value`, `formattedValue`: Values computed to simplify tooltip creation

{{"demo": "CustomTooltipContent.js"}}

#### Axis content

The `useAxesTooltip()` hook returns information about the current axes the user is interacting with and the relevant series.
For each axis, it contains:

- `identifier`: An object that identifies the axis, which often contains its series type, series ID, and data index.
- `color`: The color used to display the item, which includes the impact of [`colorMap`](/x/react-charts/styling/#value-based-colors)
- `label`, `value`, `formattedValue`: Values computed to simplify tooltip creation

{{"demo": "CustomAxisTooltipContent.js"}}
