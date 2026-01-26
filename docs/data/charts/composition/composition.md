---
title: React Chart composition
productId: x-charts
githubLabel: 'scope: charts'
components: ChartsContainer, ChartsContainerPro, ChartsGrid, ChartDataProvider, ChartDataProviderPro, ChartsSurface, ChartsLayerContainer
packageName: '@mui/x-charts'
---

# Charts - Composition

<p class="description">Learn how to use composition to build advanced custom Charts.</p>

The MUI X Charts components follow an architecture based on context providers: you can pass your series and axes definitions to specialized components that transform the data and make it available to its descendants.
These descendants can then be composed.

There are two main types of components used to create Charts: [structural](#structural-components) and [graphical](#graphical-components).

## Structural components

Structural components are used to define a chart's dimensions, surfaces, and data.

- Basics
  - `ChartDataProvider` provides data to descendants.
  - `ChartsSurface` renders the SVG element.
- Helpers
  - `ChartsContainer` combines the Data Provider and Surface components.
  - `ChartsWrapper` styled div that positions surface, tooltip, and legend on a grid.

:::info
Demos in this doc use the `ChartsContainer` component.
For demos using `ChartDataProvider` and `ChartsSurface`, see [HTML components](/x/react-charts/components/#html-components).
:::

### Chart Data Provider and Surface usage

Notice that the `width` and `height` props are passed to `ChartDataProvider` and not `ChartsSurface`.

`ChartsLegend` is placed inside `ChartDataProvider` to get access to the context, but outside `ChartsSurface` since it's not an SVG component.

```jsx
<ChartDataProvider
  // The configuration of the chart
  series={[{ type: 'bar', data: [100, 200] }]}
  xAxis={[{ scaleType: 'band', data: ['A', 'B'] }]}
  width={500}
  height={300}
>
  <ChartsLegend />
  <ChartsSurface
    // Ref needs to be directly on ChartsSurface
    ref={mySvgRef}
  >
    {children}
  </ChartsSurface>
</ChartDataProvider>
```

### Chart Container usage

`ChartsContainer` is the direct concatenation of `ChartDataProvider` and `ChartsSurface`.
It takes care of dispatching props between the two components.

Using `ChartsContainer` has one major drawback: all the children will be inside `ChartsSurface`.
You can't render HTML elements such as `ChartsLegend` as shown in the previous example.

```jsx
<ChartsContainer
  // The configuration of the chart
  series={[{ type: 'bar', data: [100, 200] }]}
  xAxis={[{ scaleType: 'band', data: ['A', 'B'] }]}
  width={500}
  height={300}
  // Ref is forwarded internally to ChartsSurface
  ref={mySvgRef}
>
  {children} // Only SVG component here
</ChartsContainer>
```

### Chart Wrapper usage

Charts are often constructed of a graphic with a legend.
`ChartsWrapper` helps position those elements in a grid structure.

The children should have a CSS `gridArea` property set to `'chart'`, `'legend'`, or `'toolbar'`.
This is done by default on built-in components.

The layout can be modified with the [wrapper props](/x/api/charts/charts-wrapper/).

```jsx
<ChartDataProvider height={300} series={ /* ... */ }>
  <ChartsWrapper legendDirection='horizontal' legendPosition={{ vertical: 'bottom' }}>
    <ChartsLegend direction='horizontal' />
    <ChartsSurface>
      {children}
    </ChartsSurface>
  </ChartsWrapper>
</ChartDataProvider>
```

## Graphical components

Graphical components are used to render the visual elements of a chart.
They are descendants of [`ChartDataProvider`](#structural-components) described above.
These are too numerous to list, but common examples include:

- `LinePlot`
- `BarPlot`
- `ChartsXAxis`
- `ChartsLegend`
- `ChartsTooltip`

You can also [create your own custom components](/x/react-charts/components/) for this purpose.

## Container options

### Responsive dimensions

`ChartsContainer` is responsive by default: it automatically adjusts its dimensions to fit the available space defined by the parent element.

Provide the `width` and `height` props to define the dimensions of a chart.

:::warning
For a chart to be responsive, its parent element must have intrinsic dimensions.
If the parent's dimensions rely on its content, the responsive chart will not render.
:::

The demo below lets you switch between a chart with discrete dimensions (`width={500} height={300}`) and one with no dimensions defined, so you see how they differ.

{{"demo": "BasicComposition.js" }}

### Properties

`ChartsContainer` takes all props that are not specific to a single graphical element.
This includes:

- The `xAxis` and `yAxis` props: see [Axis](/x/react-charts/axis/) for details
- The `colors` prop: see [Styling—Built-in color palettes](/x/react-charts/styling/#built-in-color-palettes) for details
- The `series` and `dataset` props

#### Series

The `series` prop is an array of series definitions.
See the following documents to learn more about each specific series type:

- [Line](/x/react-charts/lines/)
- [Bar](/x/react-charts/bars/)
- [Pie](/x/react-charts/pie/)
- [Scatter](/x/react-charts/scatter/)

When using a [self-contained Chart component](/x/react-charts/quickstart/#self-contained-charts), it's assumed that the series type corresponds to the Chart type.
For example, `BarChart` assumes that `series` is of type `'bar'`.

```jsx
<BarChart
  series={[
    {
      // No need to specify the series type
      data: [1, 2, 3],
    },
  ]}
/>
```

When composing a custom chart, `ChartsContainer` doesn't know the series type, so you must explicitly define it.
For example, the custom chart below uses both `BarPlot` and `LinePlot`, and each one requires a corresponding `type` for its `data`.

```jsx
<ChartsContainer
  series={[
    // This series is for the bar plot
    { data: [1, 2, 3], type: 'bar' },
    // This series is for the line plot
    { data: [3, 2, 1], type: 'line' },
  ]}
>
  <BarPlot /> {/* Only displays the series with type: 'bar' */}
  <LinePlot /> {/* Only displays series with type: 'line' */}
</ChartsContainer>
```

Those series can use the `dataset` prop the same way that a single-component chart does.
See [Bars—Using a dataset](/x/react-charts/bars/#using-a-dataset) for more details.

In the demo below, the chart is constructed by combining `BarPlot` and `LinePlot`.
You can modify the series `type` property to switch between rendering a line and a bar.

```jsx
<ChartsContainer
  series={[
    { type, data: [1, 2, 3, 2, 1] },
    { type, data: [4, 3, 1, 3, 4] },
  ]}
>
  <BarPlot />
  <LinePlot />
  <ChartsXAxis label="X axis" axisId="x-axis-id" />
</ChartsContainer>
```

{{"demo": "SwitchSeriesType.js" }}

## Subcomponents

:::info
The CSS `z-index` property does not exist on SVG elements, so the order of SVG elements in the composed component is the only way to define how they overlap.
Elements rendered later display above elements rendered earlier.
:::

### Plotting

To display data, you can use the components named `[Type]Plot` such as `LinePlot`, `AreaPlot`, `MarkPlot`, `BarPlot`, and more.

### Clipping

Use the `ChartsClipPath` component to ensure chart elements stay confined to the designated drawing area.
This component defines a rectangular clip path that acts as a boundary.

Here's how to apply it:

1. Define the clip path: Use `<ChartsClipPath id={clipPathId} />` to establish the clip path for the drawing area. `clipPathId` must be a unique identifier.
2. Wrap the Chart: Enclose the chart elements you want to clip within a `<g>` element. Set the `clipPath` attribute to `url(#${clipPathId})` to reference the previously defined clip path. Example: ``<g clipPath={`url(#${clipPathId})`}>``

```jsx
<ChartsContainer>
  <g clipPath={`url(#${clipPathId})`}>
    // The plotting to clip in the drawing area.
    <ScatterPlot />
    <LinePlot />
  </g>
  <ChartsClipPath id={clipPathId} /> // Defines the clip path of the drawing area.
</ChartsContainer>
```

The demo below lets you toggle clipping for scatter and line plots.
Observe how the line markers extend beyond the clip area, rendering on top of the axes.

{{"demo": "LimitOverflow.js" }}

:::warning
The demo above generates a unique ID with `useId()`.

```js
const id = useId();
const clipPathId = `${id}-clip-path`;
```

It's important to generate unique IDs for clip paths, especially when dealing with multiple charts on a page.
Assigning a static ID like `"my-id"` leads to conflicts.
:::

### Axis

To add axes, use `ChartsXAxis` and `ChartsYAxis` as described in [Axis—Composition](/x/react-charts/axis/#composition).
These components take an `axisId` prop that indicates which axis defined in the container should be rendered.
If `axisId` is not provided, the first axis is used by default.

### Grid

Use `ChartsGrid` to add a grid to the component.
See [Axis—Grid](/x/react-charts/axis/#grid) for more information.

### Legend

Use `ChartsLegend` to display a legend with information about the chart.

:::warning
`ChartsLegend` is an HTML element since v8.
It must be rendered inside `ChartDataProvider` to gain access to the data, but outside of `ChartsSurface` since it's not an SVG element.

This means you can't use it inside `ChartsContainer`.
You must use `ChartDataProvider` and `ChartsSurface` instead.

```jsx
// ✅ Correct
<ChartDataProvider>
  <ChartsLegend />
  <ChartsSurface>{/* SVG components */}</ChartsSurface>
</ChartDataProvider>

// ❌ Incorrect
<ChartsContainer>
  <ChartsLegend />
</ChartsContainer>
```

:::

See [HTML components](/x/react-charts/components/#html-components) for more information about custom legends.

### Interaction

You can add interactive elements such as `ChartsAxisHighlight` and `ChartsTooltip` as illustrated in the demo below.

{{"demo": "LegendTooltipComposition.js" }}

:::info
By default, `ChartsContainer` listens to mouse events to keep track of where the mouse is located on the chart.

If you're not using the axis highlight or the tooltip, consider disabling this feature with the `disableAxisListener` prop.

```jsx
<ChartsContainer {...} disableAxisListener>
```

:::

## Examples

### Bell curve

This example demonstrates how to combine scatter and line plots to overlay a normal distribution curve (known as a bell curve) over scattered data points.
The bell curve is calculated based on the mean and standard deviation of the data.

{{"demo": "BellCurveOverlay.js" }}
