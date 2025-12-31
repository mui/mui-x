---
title: Charts - Tooltip
productId: x-charts
components: ChartsTooltip, ChartsAxisTooltipContent, ChartsItemTooltipContent, ChartsTooltipContainer
---

# Charts - Tooltip

<p class="description">Tooltip provides extra data on charts item.</p>

In all charts components, the tooltip is accessible via the slot `tooltip`.
If you are using composition, you can use the `<ChartsTooltip />` component.

## Tooltip trigger

The Tooltip can be triggered by two kinds of events:

- `'item'`—when the user's mouse hovers over an item on the chart, the tooltip displays data about this specific item.
- `'axis'`—the user's mouse position is associated with a value of the x-axis. The tooltip displays data about all series at this specific x value.
- `'none'`—disable the tooltip.

To pass this trigger attribute to the tooltip use `slotProps.tooltip.trigger`.

{{"demo": "Interaction.js"}}

## Formatting

The format of data rendered in the tooltip can be modified thanks to the series `valueFormatter` property.
The same can be applied to axes values when a tooltip is triggered by the `'axis'`.

Here is a demo with:

- The time axis values formatted to only show the year
- The series values are formatted in U.S. Dollars.

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

Here is an example of how to shorten series label in the tooltip but not the legend.

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

You can hide the axis value with `hideTooltip` in the axis props.
It removes the header showing the x-axis value from the tooltip.

```jsx
<LineChart
  // ...
  xAxis={[{ data: [ ... ], hideTooltip: true }]}
/>
```

### Series

To hide a series, the formatted value should be `null`.
To display the series with a blank space, return an empty string.

## Position

By default the tooltip is placed relative to the pointer position.
If the pointer is not available, it is placed relative to the node instead (for example, the bar in a bar chart).

This behavior can be modified with the `anchor`, `position`, and `placement` props.

- The `anchor: 'pointer' | 'node'` indicates if the tooltip should be placed relative to the pointer or the node.
- The `position: 'top' | 'right' | 'bottom' | 'left'` defines the anchor position compared to the node. This prop has no effect if the anchor is the pointer.
- The `placement` is the tooltip placement from [PopperJS](https://popper.js.org/docs/v2/constructors/#options). It specifies the tooltip position in relation to the anchor position. By default the same value as `position` if defined.

For example, setting `anchor: 'node'`, `position: 'bottom'` and `placement: 'top'` on a bar chart would render a tooltip above the bottom of a bar.

You can pass those props to the tooltip using `slotProps.tooltip`, or directly to either `<ChartsTooltip />` or `<ChartsTooltipContainer />` if you're using composition.

{{"demo": "TooltipPosition.js", "hideToolbar": true, "bg": "playground"}}

## Style modification

The tooltip can be styled using CSS classes, similar to other elements.
However, there is one caveat regarding using [portal](https://react.dev/reference/react-dom/createPortal).

The tooltip renders as a child of the document's body element.
From a DOM perspective, it's not inside the chart.
So using the chart's `sx` prop as follows does not work:

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

Another option is to disable the portal by setting `slotProps.tooltip.disablePortal` to `true`.
In that case, the tooltip renders as a child of the chart, and CSS rules apply as expected.

## Using a custom tooltip

For advanced use cases, it can be necessary to create your own tooltip.
You can replace the default tooltip in single component charts by using slots.

```jsx
<LineChart slots={{ tooltip: CustomItemTooltip }} />
```

With composition, you can use your component inside the `ChartDataProvider`.

```jsx
<ChartDataProvider>
  <ChartsSurface>{/* ... */}</ChartsSurface>
  <CustomItemTooltip />
</ChartDataProvider>
```

## Controlling item tooltip

You can control the item tooltip with `tooltipItem` and `onTooltipItemChange`.

When the item tooltip is controlled, the `anchor` is set to `'node'` if the pointer is outside of the chart.

:::warning
Make sure the tooltip `trigger` is set to `"item"`.
Otherwise no tooltip will be shown.
:::

{{"demo": "ControlledTooltip.js"}}

### Synchronizing item tooltip

The item tooltip control can be used to sync tooltip between multiple charts.

{{"demo": "SyncTooltip.js"}}

## Creating a tooltip

To create your custom tooltip, the library exports some helpers which are explained in the following sections:

- `<ChartsTooltipContainer />` a wrapper providing the open/close state and the position of the tooltip.
- `<ChartsItemTooltipContent />` renders the content of the default item tooltip.
- `<ChartsAxisTooltipContent />` renders the content of the default axis tooltip.
- `useItemTooltip()` provides all basic information associated to the current item tooltip.
- `useAxesTooltip()` provides all basic information associated to the current axes tooltip.

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

Then you can either render built-in content (with `<ChartsItemTooltipContent />` or `<ChartsAxisTooltipContent />`) or your own component.

```jsx
<CustomTooltipPopper>
  <ChartsItemTooltipContent />
</CustomTooltipPopper>
```

The following demo shows how to use additional hooks such as `useXAxis()` and `useDrawingArea()` to customize the tooltip position.

{{"demo": "CustomTooltipPosition.js"}}

#### Modifying the content

To keep the default placement, use the `<ChartsTooltipContainer />` wrapper.
It accepts a prop `trigger = 'item' | 'axis'` that defines when the Popper should open.

##### Item content

The `useItemTooltip()` hook provides the information about the current item the user is interacting with.
It contains:

- `identifier`: An object that identify the item. Which often contains its series type, series id, and data index.
- `color`: The color used to display the item. This includes the impact of [color map](/x/react-charts/styling/#values-color).
- `label`, `value`, `formattedValue`: Values computed to simplify the tooltip creation.

{{"demo": "CustomTooltipContent.js"}}

#### Axis content

The `useAxesTooltip()` hook returns the information about the current axes user is interacting with and the relevant series.
For each axis, it contains:

- `identifier`: An object that identify the axis. Which often contains its series type, series id, and data index.
- `color`: The color used to display the item. This includes the impact of [color map](/x/react-charts/styling/#values-color).
- `label`, `value`, `formattedValue`: Values computed to simplify the tooltip creation.

{{"demo": "CustomAxisTooltipContent.js"}}
