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

## Style modification

The tooltip can be styled using CSS classes, similar to other elements.
However, there is one caveat regarding using [portal](https://react.dev/reference/react-dom/createPortal).

The tooltip renders as a child of the document's body element.
From a DOM perspective, it's not inside the chart.
So using the chart's `sx` prop as follow does not work.

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

With compositon, you can use your component inside the container.

```jsx
<ChartContainer>
  // ...
  <CustomItemTooltip />
</ChartContainer>
```

:::warning
If your custom tooltip is an HTML element and does not use portal, it cannot render inside the ChartContainer.
Otherwise it would render an HTML element inside an SVG.

The solution is to render your tooltip as a descendant the ChartDataProvider so it can access the chart data, but outside ChartSurface so it isn't rendered inside an SVG element.

```jsx
<ChartDataProvider>
  <ChartSurface>{/* ... */}</ChartSurface>
  <CustomItemTooltip disablePortal />
</ChartDataProvider>
```

:::

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

:::warning
Do not skip rendering the ChartsTooltipContainer.
For example the following code does not work.

```jsx
if (tooltipData === null) {
  return null;
}

return (
  <ChartsTooltipContainer trigger="item">
    {/** My content **/}
  </ChartsTooltipContainer>
);
```

:::

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
