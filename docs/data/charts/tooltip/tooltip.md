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
To display en empty space, return an empty string.

## Style modification

The tooltip can be styled using CSS classes, similar to other elements.
However, there is one caveat du to the usage of [Portal](https://react.dev/reference/react-dom/createPortal).

The tooltip renders as a children of the document's body element.
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

To apply the same style as we're trying to apply above, we need to use the `sx` property inside the tooltip itself thanks to `slotProps.tooltip`:

{{"demo": "TooltipStyle.js"}}

If necessary, you can also disable the portal by setting `slotProps.tooltip.disablePortal` to `true`.
In that case the tooltip will render as a child of the chart.

## Using a custom tooltip

For advanced use-case, it can be necessary to create your own tooltip.
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
If your custom tooltip does not use portal, it can not render inside the ChartContainer.
Overwise it would render an HTML element inside a SVG.

The solution is to put your tooltip inside the ChartDataProvider to get data, but outside ChartSurface to avoid being inside the SVG.

```jsx
<ChartDataProvider>
  <ChartSurface>{/* ... */}</ChartSurface>
  <CustomItemTooltip disablePortal />
</ChartDataProvider>
```

:::

## Creating a tooltip

To create your custom tooltip, we provide some helpers which are explained in following sections:

- `<ChartsTooltipContainer />` A wrapper providing the open/close state and the position of the tooltip.
- `<ChartsItemTooltipContent />` render the content of the default item tooltip.
- `<ChartsAxisTooltipContent />` render the content of the default axis tooltip.
- `useItemTooltip()` provides all basic information associated to the current item tooltip.
- `useAxesTooltip()` provides all basic information associated to the current axes tooltip.

### Modifying the position

To override the tooltip position, you can create a wrapper that will manage the position.

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

Then you will be able to either render a built-in content (`<ChartsItemTooltipContent />` or `<ChartsAxisTooltipContent />`) or your own component.

```jsx
<CustomTooltipPopper>
  <ChartsItemTooltipContent />
</CustomTooltipPopper>
```

The following demo shows example about how to use additional hooks such as `useXAxis()` or `useDrawingArea()` to customize the tooltip position.

{{"demo": "CustomTooltipPosition.js"}}

#### Modifying the content

To keep the default placement, use the `<ChartsTooltipContainer />` wrapper.
It accept a prop `trigger = 'item' | 'axis'` to know when the Popper should be open.

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
