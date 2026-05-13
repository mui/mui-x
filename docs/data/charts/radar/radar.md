---
title: React Radar chart
productId: x-charts
components: RadarChart, RadarChartPro, RadarGrid, RadarSeriesArea, RadarSeriesMarks, RadarSeriesPlot, RadarMetricLabels, RadarAxisHighlight, RadarAxis, ChartsWrapper, FocusedRadarMark
---

# Charts - Radar

<p class="description">Use radar charts to compare multiple variables on axes arranged in a circle.</p>

## Overview

A radar chart plots data across multiple axes that radiate from a center, so you can compare values across metrics.
Use it to compare profiles or scores across several dimensions (for example, product attributes or skills).

The demo below shows a basic radar chart with one series.

{{"demo": "BasicRadar.js"}}

## Basics

A radar chart series must include a `data` property with an array of values.

The series must also include a `radar` object with a `metrics` array.
Each entry in `metrics` is a string or an object that defines one axis of the chart.

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

{{"demo": "RadarAxis.js"}}

## Grid

The radar chart draws a grid behind the series.
Configure it with:

- `startAngle`: rotation of the entire chart in degrees
- `divisions`: number of grid divisions
- `shape`: `circular` or `sharp`
- `stripeColor`: callback that returns stripe colors. Set to `null` to remove stripes.

{{"demo": "DemoRadar.js"}}

## Axis values

Add labels to metrics with `RadarAxis`.
It needs a `metric` prop and can be configured with:

- `angle`: angle for the label (default is the metric's angle)
- `labelOrientation`: horizontal with moving anchor, or rotating with the axis
- `divisions`: number of labels
- `textAnchor` / `dominantBaseline`: label placement (string or function that receives the angle in degrees)

{{"demo": "DemoRadarAxis.js"}}

## Highlight

### Axis highlight

By default, the radar chart highlights all values on the same axis.
If you're composing a custom component, add `RadarAxisHighlight` to get this behavior.

{{"demo": "DemoRadarAxisHighlight.js"}}

### Series highlight

Set the `highlight` prop to `'series'` to highlight by series.
Control it with `highlightedItem` and `onHighlightChange`.

If you're composing a custom component, pass these props to `RadarDataProvider`.

The demo below shows controlled highlight with several overlapping country series.
Place the series you want to be most interactive last in the `series` array, since later series render on top and receive pointer events first in overlapping regions.

{{"demo": "DemoRadarSeriesHighlight.js"}}

### Disabling highlight

Set the `highlight` prop to `'none'` to turn off highlighting.

## Tooltip

You can customize the radar tooltip with slots.
See [Tooltip](/x/react-charts/tooltip/) for details.

The `trigger` prop of the tooltip slot accepts:

- `'axis'`: mouse position maps to a metric. The tooltip shows data for all series on that metric.
- `'item'`: when the pointer is over a radar area, the tooltip shows data for that series.
- `'none'`: tooltip is off.

{{"demo": "RadarTooltip.js"}}

## Click events

Radar charts provide several click handlers:

- `onAreaClick` for clicks on a specific area
- `onMarkClick` for clicks on a specific mark
- `onAxisClick` for clicks anywhere in the chart

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

Use `RadarDataProvider` to provide the `series` and `radar` props for composition.

In addition to the shared chart components available for [composition](/x/react-charts/composition/), you can use:

- For axes:
  - `RadarGrid`: grid and stripes
  - `RadarMetricLabels`: metric labels around the grid
- For data:
  - `RadarSeriesPlot`: area and marks stacked
  - `RadarSeriesArea`: area only
  - `RadarSeriesMarks`: marks only
- For interaction:
  - `RadarAxisHighlight`: line and marks along the highlighted axis
  - `FocusedRadarMark`: focus indicator for keyboard navigation

:::info
`RadarSeriesPlot` draws all series together, so the second series area is on top of the first series marks.

`RadarSeriesArea` and `RadarSeriesMarks` let you draw all marks above all areas, or insert components between areas and marks.
:::

{{"demo": "CompositionExample.js"}}

Here's how the radar chart is composed:

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
