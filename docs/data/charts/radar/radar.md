---
title: React Radar chart
productId: x-charts
components: RadarChart, RadarChartPro, RadarGrid, RadarSeriesArea, RadarSeriesMarks, RadarSeriesPlot, RadarMetricLabels, RadarAxisHighlight, RadarAxis, ChartsWrapper, FocusedRadarMark
---

# Charts - Radar

<p class="description">Compare multiple variables as points on axes arranged in a circle.</p>

## Overview

A radar chart plots multivariate data on axes that radiate from a center, so you can compare values across metrics.

## Basics

A radar chart series must include a `data` property with an array of values.

Add a `radar` prop with a `metrics` property: an array of strings or objects.
Each item in the array defines one metric (one axis) of the chart.

{{"demo": "BasicRadar.js"}}

## Multi-series

You can plot multiple series on the same radar.

{{"demo": "MultiSeriesRadar.js"}}

## Series options

Set `hideMark` and `fillArea` on a radar series to change how it renders.

{{"demo": "DemoRadarVisualisation.js"}}

## Metrics

The `metrics` property of `radar` takes an array with one item per axis (corner) of the chart.
Each item can be:

- A string (used as the axis label). Other properties come from the data.
- An object with:
  - `name`: the axis label
  - `min`: minimum value for this axis (default 0)
  - `max`: maximum value for this axis (default is the max value in the data)

{{"demo": "RadarAxis.js" }}

## Grid

The radar draws a grid behind the series.
Configure it with:

- `startAngle`: rotation of the entire chart in degrees
- `divisions`: number of grid divisions
- `shape`: `circular` or `sharp`
- `stripeColor`: callback that returns stripe colors. Set to `null` to remove stripes.

{{"demo": "DemoRadar.js" }}

## Axis values

Add labels to metrics with `RadarAxis`.
It needs a `metric` prop and can be configured with:

- `angle`: angle for the label (default is the metric's angle)
- `labelOrientation`: horizontal with moving anchor, or rotating with the axis
- `divisions`: number of labels
- `textAnchor` / `dominantBaseline`: label placement (string or function that receives the angle in degrees)

{{"demo": "DemoRadarAxis.js" }}

## Highlight

### Axis highlight

By default the radar highlights all values on the same axis.
When composing a custom chart, add `RadarAxisHighlight` to get this behavior.

{{"demo": "DemoRadarAxisHighlight.js" }}

### Series highlight

Set the `highlight` prop to `'series'` to highlight by series.
Control it with `highlightedItem` and `onHighlightChange`.

When composing a custom chart, pass these props to `RadarDataProvider`.

The demo below shows controlled highlight.
Series order affects which area receives pointer events: the last series in the `series` prop is drawn on top, so it catches the pointer.
If the UK series were not last, its area would be underneath and could not be highlighted.

{{"demo": "DemoRadarSeriesHighlight.js" }}

### Disabling highlight

Set the `highlight` prop to `'none'` to turn off highlighting.

## Tooltip

Like other charts, the radar [tooltip](/x/react-charts/tooltip/) can be customized with slots.
The `trigger` prop of the tooltip slot accepts:

- `'axis'`: mouse position maps to a metric. The tooltip shows data for all series on that metric.
- `'item'`: when the pointer is over a radar area, the tooltip shows data for that series.
- `'none'`: tooltip is off.

{{"demo": "RadarTooltip.js" }}

## Click events

Radar charts provide several click handlers:

- `onAreaClick` when a specific area is clicked
- `onMarkClick` when a specific mark is clicked
- `onAxisClick` when anywhere in the chart is clicked

Each handler uses this signature:

```js
const clickHandler = (
  event, // The mouse event.
  params, // An object that identifies the clicked elements.
) => {};
```

{{"demo": "RadarClick.js"}}

:::info
The `event` passed to `onAxisClick` differs from the others.
`onAxisClick` receives the native mouse event from the SVG element.
The other handlers receive a React synthetic mouse event from the area, mark, or line component.
:::

## Composition

Use `RadarDataProvider` to supply `series` and `radar` when composing a custom chart.

In addition to the shared components available for [composition](/x/react-charts/composition/), you can use:

- For axes:
  - `RadarGrid`: grid and stripes
  - `RadarMetricLabels`: metric labels around the grid
- For data:
  - `RadarSeriesPlot`: area and marks stacked
  - `RadarSeriesArea`: area only
  - `RadarSeriesMarks`: marks only
- For interaction:
  - `RadarAxisHighlight`: line and marks along the highlighted axis
  - `FocusedRadarMark`: keyboard focus indicator

:::info
`RadarSeriesPlot` draws all series together, so the second series area is on top of the first series marks.

`RadarSeriesArea` and `RadarSeriesMarks` let you draw all marks above all areas, or insert components between areas and marks.
:::

{{"demo": "CompositionExample.js" }}

The following code shows how the radar chart is built:

```jsx
<RadarDataProvider>
  <ChartsWrapper>
    <ChartsLegend />
    <ChartsSurface>
      {/* The background of the chart */}
      <RadarGrid />
      <RadarMetricLabels />
      {/* The data with axis highlight on top of area and below marks */}
      <RadarSeriesArea />
      <RadarAxisHighlight />
      <RadarSeriesMarks />
      <FocusedRadarMark />
      {/* Other components */}
      <ChartsOverlay />
    </ChartsSurface>
    <ChartsTooltip />
  </ChartsWrapper>
</RadarDataProvider>
```
