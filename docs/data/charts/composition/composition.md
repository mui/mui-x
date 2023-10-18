---
title: React Chart composition
githubLabel: 'component: charts'
packageName: '@mui/x-charts'
---

# Chart composition

<p class="description">How to create advanced custom charts.</p>

## Overview

The `@mui/x-charts` follows an architecture based on context providers.
The overall idea is to pass your series and axes definitions to a single component, the `<ChartContainer />`.
This component will transform those data to simplify the rendering, and provide them to its children.

Based on the data provided by the container, you can render some graphical element with our subcomponents.
Such as `<LinePlot />`, `<ChartsYAxis />`. Or you can create your [own subcomponents](/x/react-charts/components/)

## Container

### Responsive

You have access to two containers.
The `<ChartContainer />` and `<ResponsiveChartContainer />`.
As you can guess the only difference is the responsiveness.

The first one requires to provide `width` and `height` props.
Whereas the second one will compute undefined dimension based on the size of its parent element.

### Properties

This component takes all properties that are not specific to a single grphical element.
This includes:

- The `xAxis` and `yAxis` props. More information in the [axis page](/x/react-charts/axis/).
- The `colors` prop as defined in the [color palette page](/x/react-charts/styling/#color-palette).
- The `series` and `dataset`.

The `series` prop is an array of series definitions.
You can find explanation about each specific time of series in their respective docs page: [line](/x/react-charts/lines/), [bar](/x/react-charts/bars/), [pie](/x/react-charts/pie/).

When using composition, you must add an additional property `type`.
It indicates the type of charts you are defining.

When using a single components chart, the library can guess which kind of series your defining.
For example if you use

```jsx
<BarChart series={[{
    data: [1, 2, 3] // No need to specify it's a bar series
}]} />

<ChartContainer 
  series={[
    { data: [1, 2, 3], type: 'bar' }, // We need to specify this is for bar chart
    { data: [3, 2, 1], type: 'line' } // We need to specify this is for line chart
  ]}
>
  <BarPlot /> {/* Will only display series with type: 'bar'*/}
  <LinePlot /> {/* Will only display series with type: 'line'*/}
</ChartContainer>
```

Those series can use the `dataset` props [the same way](/x/react-charts/bars/#using-a-dataset) single component chart does

## Subcomponents

### Plotting

To display data, you have components named `<XxxPlot />` such as `<LinePlot />`, `<AreaPlot />`, `<BarPlot />`, ...

### Axis

To add axis, you can use `<ChartsXAxis />` and `<ChartsYAxis />` as defined in the [axis page](/x/react-charts/axis/#composition).

It takes a `axisId` to know which one of the axes defined in the container you want to render. If not provided it will pick the first one.

### Additional Information

To add a legend to your chart, you can use `<ChartsLegend />`.

Most of the props are explained in the [legend page](/x/react-charts/legend/).
Instead of using `slotProps` you can directly pass props to it.

```jsx
// With single component chart
<BarChart 
  slotProps={{
    legend: {
      direction: 'row',
    }
  }}
/>

// With composition
<ChartContainer>
  <ChartsLegend directio='row' />
</ChartContainer>
```

### Interaction

You can also add interaction elements with `<ChartsAxisHighlight />` and `<ChartsTooltip />`.

:::info
By default the container is listening to mouse event to keep track of where the mouse is in the chart.

If you don't use theaxis highlight or the tooltip, consider disabling this feature with `disableAxisListener` prop.

```jsx
<ChartContainer {...} disableAxisListener>
```
:::
