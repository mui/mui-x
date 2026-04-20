---
title: React Scatter chart
productId: x-charts
components: ScatterChart, ScatterChartPro, ScatterPlot, ChartsGrid, ChartsWrapper
---

# Charts - Scatter

<p class="description">Use scatter charts to plot two variables as points and reveal relationships, correlations, and outliers.</p>

## Overview

A scatter chart plots two variables as points on a surface, so you can see how one variable changes with another and spot clusters, trends, and outliers.
Each point is one observation, placed by its values on the two axes.
Scatter charts are often used for statistical analysis, scientific data, and performance metrics.

{{"demo": "ScatterOverview.js", "disableAd": true, "defaultCodeOpen": false}}

## Basics

A scatter series usually defines points with a `data` property: an array of objects, each with `x` and `y` for its position.

You can also use the `dataset` prop together with `datasetKeys` instead of putting coordinates on the series directly—see [Using a dataset](#using-a-dataset).

Add an optional `id` on each point so it keeps a stable identity when the data changes.
If you animate the series, `id` lets added or removed points transition predictably; without it, updates follow each point's index in the array and existing markers can be repurposed in ways that look wrong.

{{"demo": "BasicScatter.js"}}

### Using a dataset

If your data is stored in an array of objects, you can use the `dataset` helper prop.
It accepts an array of objects such as `dataset={[{a: 1, b: 32, c: 873}, {a: 2, b: 41, c: 182}, ...]}`.

Scatter series use a different pattern than other charts: use the `datasetKeys` property with an object that has required `x` and `y` keys.
You can also include optional `id` and `z` keys.

See the [Dataset](/x/react-charts/dataset/) page to learn more.

{{"demo": "ScatterDataset.js"}}

## Interaction

Scatter points can be small, so the chart does not require the pointer to be exactly over a point.
When the pointer is in the drawing area, the closest point is used for the tooltip and highlights.

Use the `hitAreaRadius` prop with a number to limit how far the pointer can be from a point for selection.
If the pointer is farther than that from any point, no item is selected.
Use `hitAreaRadius` with `"item"` to trigger interactions only when the pointer is directly over a marker, instead of selecting whichever point is closest to the pointer in the drawing area.

{{"demo": "ClosestPointInteraction.js"}}

## Click event

The scatter chart provides an `onItemClick` handler for clicks on a specific point.
It uses the following signature:

```js
const onItemClick = (
  event, // The mouse event.
  params, // An object that identifies the clicked elements.
) => {};
```

{{"demo": "ScatterClick.js"}}

When `hitAreaRadius` is `"item"`, the user must click directly on the point, and the mouse event comes from that element.

Otherwise, click behavior matches the [interaction section](#interaction), and the mouse event comes from the SVG container.

## Styling

### Color scale

As with other charts, you can modify the [series colors](/x/react-charts/styling/#colors) either directly, or with the color palette.

You can also modify the color by using the axes' `colorMap`, which maps values to colors.
Scatter charts use the following, in order of priority:

1. The z-axis color
2. The y-axis color
3. The x-axis color
4. The series color

:::info
The z-axis is a third axis that lets you style scatter points by a value other than position.
Pass it with the `zAxis` prop.

The mapped value can come from the `z` property on each series data point, or from the z-axis data.
You can set the z value in three ways:

```jsx
<ScatterChart
  // First option
  series={[{ data: [{ id: 0, x: 1, y: 1, z: 5 }] }]}
  // Second option
  zAxis={[{ data: [5] }]}
  // Third option
  dataset={[{ price: 5 }]}
  zAxis={[{ dataKey: 'price' }]}
/>
```

:::

See [Styling—Value-based colors](/x/react-charts/styling/#value-based-colors) for the `colorMap` properties.

{{"demo": "ColorScale.js"}}

### Grid

You can add a grid in the background of the chart with the `grid` prop.

See [Axis—Grid](/x/react-charts/axis-ticks/#grid) for details.

{{"demo": "GridDemo.js"}}

### CSS

You can customize the scatter chart elements using CSS selectors:

- `[data-series='<series ID>']`: the group of markers for the series with that ID
- `[data-highlighted=true]`: markers in the highlighted state
- `[data-faded=true]`: markers in the faded state

Use the `scatterClasses.root` class to select all marker groups.

The example below customizes the highlighted style by series.

{{"demo": "ScatterCSSSelectors.js"}}

### Shape

Pass a component to the `marker` slot to customize the shape of scatter points.

To keep the legend and tooltip in sync with the custom shape, set the `labelMarkType` property on each series, as shown in the example below.

{{"demo": "ScatterCustomShape.js"}}

### Size

Use the `markerSize` prop on each series to set the size of scatter points.
For circles, `markerSize` is the radius in pixels.

{{"demo": "ScatterCustomSize.js"}}

## Plot customization

To customize how data is plotted, pass custom components as children of `ScatterChart`.

Use the `useScatterSeries()` hook to read a scatter chart's series from your custom component.
It returns the series order and details for each series (data points, color, and so on).

See [Custom components](/x/react-charts/components/) for more ways to customize charts.

{{"demo": "CustomScatter.js"}}

## Performance

Scatter charts can have many points, which can slow down rendering.
By default, points are drawn with SVG `circle` elements, which may be slow for large datasets.

Set the `renderer` prop to `"svg-batch"` to draw circles in a more efficient way.
This has some trade-offs:

- You cannot style individual circles with CSS
- The `marker` slot cannot be overridden
- Transparent highlight: the highlighted state draws a circle on top of the original. Transparency on the highlight can make the original circle show through

Behavior also differs in a few ways:

- Rendering order may change, so overlapping circles can appear at different depths than with the default renderer
- When `disableHitArea` is `true`, `onItemClick` does not run, because it depends on the hit area logic

The example below uses the `renderer` prop to render 16,000 points with better performance.

{{"demo": "ScatterBatchRenderer.js"}}

## Composition

Use `ChartsDataProvider` to supply `series`, `xAxis`, and `yAxis` when composing a custom chart.

In addition to the shared components described in [Composition](/x/react-charts/composition/), you can use `ScatterPlot` to draw the scatter points.

Here's how the scatter chart is composed:

```jsx
<ChartsDataProvider>
  <ChartsWrapper>
    <ChartsLegend />
    <ChartsSurface>
      <ChartsAxis />
      <ChartsGrid />
      <g data-drawing-container>
        {/* Elements able to overflow the drawing area. */}
        <ScatterPlot />
      </g>
      <FocusedScatterMark />
      <ChartsOverlay />
      <ChartsAxisHighlight />
    </ChartsSurface>
    <ChartsTooltip trigger="item" />
  </ChartsWrapper>
</ChartsDataProvider>
```

:::info
The `data-drawing-container` attribute marks children as part of the drawing area even when they overflow.

See [Composition—clipping](/x/react-charts/composition/#clipping) for details.
:::

### Regression line

Add a regression line to a scatter plot by composing a custom chart and drawing the line yourself.

{{"demo": "ScatterRegressionLine.js"}}
