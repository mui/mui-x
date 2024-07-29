---
title: React Chart composition
productId: x-charts
githubLabel: 'component: charts'
components: ChartContainer, ChartContainerPro, ResponsiveChartContainer, ResponsiveChartContainerPro, ChartsGrid
packageName: '@mui/x-charts'
---

# Chart composition

<p class="description">Creating advanced custom charts.</p>

## Overview

The `@mui/x-charts` follows an architecture based on context providers.
The overall idea is to pass your series and axes definitions to a single component: the `<ChartContainer />`.
This component transforms the data and makes it available to its children.

Based on the data provided by the container, you can render some graphical elements with provided subcomponents, such as `<LinePlot />` or `<ChartsYAxis />`.
Or you can [create your own components](/x/react-charts/components/).

## Container options

### Responsive

There are two types of Chart containers available: `<ChartContainer />` and `<ResponsiveChartContainer />`.
As the names suggest, the only difference between them is responsiveness.

The first container requires you to provide `width` and `height` props.
In contrast, `<ResponsiveChartContainer />` automatically adjusts its dimensions to fit the available space defined by the parent element.

:::warning
The parent element must have intrinsic dimensions.
If the parent's dimensions rely on its content, the responsive charts will not render.
:::

The following demo lets you switch between a chart using `<ChartContainer />` with `width` set to `500` and `height` set to `300`, and a chart using `<ResponsiveChartContainer />`, so you can see how they differ.

{{"demo": "BasicComposition.js" }}

### Properties

The chart container gets all props that are not specific to a single graphical element.
This includes:

- The `xAxis` and `yAxis` props—find more information in the [Axis doc](/x/react-charts/axis/)
- The `colors` prop as defined in the [color palette page](/x/react-charts/styling/#color-palette)
- The `series` and `dataset` props

#### Series

The `series` prop is an array of series definitions.
You can find an explanation about each specific series type in their respective docs page: [Line](/x/react-charts/lines/), [Bar](/x/react-charts/bars/), [Pie](/x/react-charts/pie/), and [Scatter](/x/react-charts/scatter/).

When using a single Charts component, the library can guess which kind of series you are defining.
For example, the Bar Chart component assumes that `series` will be of type `'bar'`.

With composition, the chart container isn't able to guess the series type, so you must explicitly define it.

```jsx
<BarChart series={[{
    data: [1, 2, 3] // No need to specify it is a bar series
}]} />

<ChartContainer
  series={[
    { data: [1, 2, 3], type: 'bar' }, // This series is for the bar chart
    { data: [3, 2, 1], type: 'line' } // This series is for the line chart
  ]}
>
  <BarPlot /> {/* Will only display series with type: 'bar' */}
  <LinePlot /> {/* Will only display series with type: 'line' */}
</ChartContainer>
```

Those series can use the `dataset` prop the same way that a single-component chart does—see [Using a dataset](/x/react-charts/bars/#using-a-dataset) in the Bar Chart documentation for more details.

In the next demo, the chart is made by composing the `<BarPlot />` and `<LinePlot />` components.
By modifying the series `type` property, you can switch between rendering a line and a bar.

```jsx
<ResponsiveChartContainer
  series={[
    { type, data: [1, 2, 3, 2, 1] },
    { type, data: [4, 3, 1, 3, 4] },
  ]}
>
  <BarPlot />
  <LinePlot />
  <ChartsXAxis label="X axis" position="bottom" axisId="x-axis-id" />
</ResponsiveChartContainer>
```

{{"demo": "SwitchSeriesType.js" }}

## Subcomponents

:::info
The CSS `z-index` property does not exist on SVG elements.
Elements rendered after overlap on top of elements rendered before.
The order of elements in composition is the only way to define how they overlap.
:::

### Plotting

To display data, you have components named `<XxxPlot />` such as `<LinePlot />`, `<AreaPlot />`, `<MarkPlot />`, `<BarPlot />`, etc.

### Clipping

To ensure chart elements stay confined to the designated drawing area, use the `ChartsClipPath` component.
This component defines a rectangular clip path that acts as a boundary.

1. **Define the Clip Path**: Use `<ChartsClipPath id={clipPathId} />` to establish the clip path for the drawing area. `clipPathId` must be a unique identifier.
2. **Wrap the Chart**: Enclose the chart elements you want to clip within a `<g>` element. Set the `clipPath` attribute to `url(#${clipPathId})` to reference the previously defined clip path. Example: ``<g clipPath={`url(#${clipPathId})`}>``

```jsx
<ChartContainer>
  <g clipPath={`url(#${clipPathId})`}>
    // The plotting to clip in the drawing area.
    <ScatterPlot />
    <LinePlot />
  </g>
  <ChartsClipPath id={clipPathId} /> // Defines the clip path of the drawing area.
</ChartContainer>
```

The following demo allows you to toggle clipping for scatter and line plots.
Observe how line markers extend beyond the clip area, rendering on top of the axes.

{{"demo": "LimitOverflow.js" }}

:::warning
The provided demo is generating a unique ID with `useId()`.

```js
const id = useId();
const clipPathId = `${id}-clip-path`;
```

It's important to generate unique IDs for clip paths, especially when dealing with multiple charts on a page. Assigning a static ID like `"my-id"` would lead to conflicts.
:::

### Axis

To add axes, you can use `<ChartsXAxis />` and `<ChartsYAxis />` as defined in the [axis page](/x/react-charts/axis/#composition).

It takes an `axisId` prop that indicates which axis, defined in the container, should be rendered.
If `axisId` is not provided it will pick the first one.

### Grid

To add a grid, you can use the `<ChartsGrid />` component.

See [Axis—Grid](/x/react-charts/axis/#grid) documentation for more information.

### Additional information

To add a legend to your chart, you can use `<ChartsLegend />`.

Most of the props are explained in the [legend page](/x/react-charts/legend/).
The demos use the `slotProps.legend` object, but with composition, you can pass props directly to `<ChartsLegend />`.

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
  <ChartsLegend direction="row" />
</ChartContainer>
```

### Interaction

You can also add interactive elements such as `<ChartsAxisHighlight />` and `<ChartsTooltip />`.

:::info
By default, the container listens to mouse events to keep track of where the mouse is located on the chart.

If you are not using the axis highlight or the tooltip, consider disabling this feature with the `disableAxisListener` prop.

```jsx
<ChartContainer {...} disableAxisListener>
```

:::
