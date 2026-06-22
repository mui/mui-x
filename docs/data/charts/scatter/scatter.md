---
title: React Scatter chart
productId: x-charts
components: ScatterChart, ScatterChartPro, ScatterChartPremium, ScatterPlot, ScatterPlotPremium, HighlightedScatterMark, ChartsGrid, ChartsWrapper
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
You can also include optional `id`, `colorValue`, and `sizeValue` keys.

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

When `hitAreaRadius` is `"item"`, the user must click directly on the point, and the mouse event comes from that element.

Otherwise, click behavior matches the [interaction section](#interaction), and the mouse event comes from the SVG container.

{{"demo": "ScatterClick.js"}}

## Bubble chart

Scatter chart supports size and color scales to represent two additional values per mark.

Those are configured with

- `sizeValue`/`colorValue` provide the marks data (either directly in the `data` or with the `datasetKeys`)
- `sizeAxisId`/`colorAxisId` series property indicate the `zAxis` scale to be used.

See the [Bubble chart](/x/react-charts/bubble/) page for demos and details.

{{"demo": "../bubble/BubbleChartCO2Emissions.js"}}

## Styling

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

See the [Bubble chart page](/x/react-charts/bubble/) to modify mark size based on their value.

{{"demo": "ScatterCustomSize.js"}}

## Plot customization

To customize how data is plotted, pass custom components as children of `ScatterChart`.

Use the `useScatterSeries()` hook to read a scatter chart's series from your custom component.
It returns the series order and details for each series (data points, color, and so on).

See [Custom components](/x/react-charts/components/) for more ways to customize charts.

{{"demo": "CustomScatter.js"}}

## Performance

### SVG batch rendering

Scatter charts can have many points, which can slow down rendering.
By default, points are drawn with SVG `circle` elements, which can be slow for large datasets.

The `renderer` prop selects how points are drawn.
The `renderer` prop selects how points are drawn.
The default value is set to `'svg-single'`.

Set `experimentalFeatures.progressiveRendering` to `true` to get the renderer chosen automatically based on the number of points: `'svg-progressive'` is used when above 2.000 points, `'svg-single'` otherwise.

### Choosing a renderer

| `renderer`                                                                                           | Element drawn  | CSS | Interactions | Blocking                 | Best for                           |
| :--------------------------------------------------------------------------------------------------- | :------------- | :-- | :----------- | :----------------------- | :--------------------------------- |
| `svg-single`                                                                                         | `circle`       | Yes | Yes          | Blocks until fully drawn | Small datasets                     |
| `svg-progressive`                                                                                    | `circle`       | Yes | Yes          | Stays responsive         | Large datasets that still need CSS |
| `svg-batch`                                                                                          | grouped `path` | No  | Limited      | Blocks until fully drawn | Very large datasets                |
| `webgl` [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') | WebGL canvas   | No  | No           | Blocks until fully drawn | Massive datasets                   |

**CSS**: whether you can style individual points with CSS selectors.

**Interactions**: whether per-point interactions such as `onItemClick` work.

**Blocking**: whether the main thread is blocked until every point is drawn.

### Single renderer

`renderer="svg-single"` draws one `circle` element per point in a single synchronous pass.
CSS styling, the `marker` slot, and per-item interactions all work, but the main thread is blocked until every point is drawn, so it is only suited to small datasets.

### Progressive renderer

`renderer="svg-progressive"` also draws one `circle` element per point, keeping CSS styling, the `marker` slot, and per-item interactions.
The difference is that the series and axes are processed off the render path, and the points are split into batches whose groups mount immediately and paint progressively over several animation frames.
The main thread stays responsive while a large dataset is being drawn.

The example below renders 20,000 points.
Use the buttons to compare the single and progressive renderers: the spinner keeps animating and "first paint" stays low with the progressive renderer, while the single renderer blocks the main thread until every point is drawn.
Zoom and pan the chart to see the progressive renderer keep only the first level painted while you interact, then fill in the rest once the interaction settles.
The first level is the first N points of each series, so it is representative only when the data is unordered; data sorted along an axis may show a partial cloud until the interaction settles.

{{"demo": "ScatterAsyncRenderer.js"}}

### Batch renderer

`renderer="svg-batch"` draws circles grouped into `path` elements, which is more efficient for very large datasets.
This has some trade-offs:

- You cannot style individual circles with CSS
- The `marker` slot cannot be overridden
- Transparent highlight: the highlighted state draws a circle on top of the original. Transparency on the highlight can make the original circle show through

Behavior also differs in a few ways:

- Rendering order can change, so overlapping circles can appear at different depths than with the other renderers
- When `disableHitArea` is `true`, `onItemClick` does not run, because it depends on the hit area logic

The example below uses the `renderer` prop to render 16,000 points with better performance.

{{"demo": "ScatterBatchRenderer.js"}}

### WebGL renderer [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

For very large datasets, `ScatterChartPremium` supports a `webgl` renderer that draws points into a dedicated WebGL canvas layered behind the SVG.
This bypasses per-point SVG entirely and trades item-level interactivity for throughput.

The example below renders 200,000 points.

{{"demo": "ScatterWebGLRenderer.js"}}

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
