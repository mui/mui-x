---
title: React Radar chart
productId: x-charts
components: RadarChart, RadarChartPro, RadarGrid, RadarSeriesArea, RadarSeriesMarks, RadarSeriesPlot, RadarMetricLabels, RadarAxisHighlight, RadarAxis, ChartsWrapper, FocusedRadarMark
---

# Charts - Radar

<p class="description">Radar lets you compare multivariate data in a 2D chart.</p>

## Basics

Radar charts series should contain a `data` property containing an array of values.

Radar charts also require a `radar` prop with a `metrics` property containing an array of string or objects.
Each item of this array define a metric of the radar.

{{"demo": "BasicRadar.js"}}

## Multi-series

You can plot multiple series on the same radar chart.

{{"demo": "MultiSeriesRadar.js"}}

## Series options

Radar series support `hideMark` and `fillArea` parameter to modify the rendering of the series.

{{"demo": "DemoRadarVisualisation.js"}}

## Metrics

The `metrics` property of `radar` takes an array with one item per corner of the radar.
This item can either be:

- A string used as the axis label. The other properties are populated from the data.
- An object with the following properties:
  - `name`: The label associated to the axis.
  - `min`: The minimum value along this direction (by default 0).
  - `max`: The maximum value along this direction (by default the maximum value along this direction).

{{"demo": "RadarAxis.js" }}

## Grid

The radar chart displays a grid behind the series that can be configured with:

- `startAngle` The rotation angle of the entire chart in degrees.
- `divisions` The number of divisions of the grid.
- `shape` The grid shape that can be `circular` or `sharp`.
- `stripeColor` The callback that defines stripe colors. Set it to `null` to remove stripes.

{{"demo": "DemoRadar.js" }}

## Axis values

You can add labels to metrics with the `<RadarAxis />`.
This component requires a `metric` prop and can be configured with:

- `angle` The angle used to display labels. By default it's the one associated to the given metric.
- `labelOrientation` The orientation strategy. Either horizontal labels with moving anchor point, or label rotating with the axis.
- `divisions` The number of labels to display.
- `textAnchor`/`dominantBaseline` The label placement. Can either be a string, or a function with the `angle` value (in degree) as an argument.

{{"demo": "DemoRadarAxis.js" }}

## Highlight

### Axis highlight

By default the radar highlight values of a same axis.
With composition you can add this behavior with the `<RadarAxisHighlight />` component.

{{"demo": "DemoRadarAxisHighlight.js" }}

### Series highlight

To set the highlight on series, use the `highlight` prop with `'series'` value.
This highlight can be controlled with `highlightedItem` value and `onHighlightChange` callback.

With composition you can pass those props to the `RadarDataProvider`.

This demo shows a controlled highlight.
Notice the impact of the series order in the highlight interaction.
The UK series is the last item of the `series` prop.
Such that its area renders on top of the others.
Otherwise, the other area would catch the pointer event, making it impossible to highlight it.

{{"demo": "DemoRadarSeriesHighlight.js" }}

### Disabling highlight

To remove highlight, set the `highlight` prop to `'none'`.

## Tooltip

Like other charts, the radar chart [tooltip](/x/react-charts/tooltip/) can be customized with slots.
The `trigger` prop of the `tooltip` slot accepts the following values:

- `'axis'`—the user's mouse position is associated with a metric. The tooltip displays data about all series along this specific metric.
- `'item'`—when the user's mouse hovers over a radar area, the tooltip displays data about this series.
- `'none'`—disable the tooltip.

{{"demo": "RadarTooltip.js" }}

## Click event

Radar charts provides multiple click handlers:

- `onAreaClick` for click on a specific area.
- `onMarkClick` for click on a specific mark.
- `onAxisClick` for a click anywhere in the chart

They all provide the following signature.

```js
const clickHandler = (
  event, // The mouse event.
  params, // An object that identifies the clicked elements.
) => {};
```

{{"demo": "RadarClick.js"}}

:::info
There is a slight difference between the `event` of `onAxisClick` and the others:

- For `onAxisClick` it's a native mouse event emitted by the svg component.
- For others, it's a React synthetic mouse event emitted by the area, line, or mark component.

:::

## Composition

Use the `<RadarDataProvider />` to provide `series` and `radar` props for composition.

In addition to the common chart components available for [composition](/x/react-charts/composition/), you can use the following components:

- For axes:
  - `<RadarGrid />` renders the grid and stripes.
  - `<RadarMetricLabels />` renders metric labels around the grid.
- For data:
  - `<RadarSeriesPlot />` renders series (the area and the marks) on top of each other.
  - `<RadarSeriesArea />` renders the series area.
  - `<RadarSeriesMarks />` renders series marks.
- For interaction:
  - `<RadarAxisHighlight />` renders line and marks along the highlighted axis.
  - `<FocusedRadarMark />` renders the focus visual element when using keyboard navigation.

:::info
The `<RadarSeriesPlot />` renders all series together, such that the area of the second series is on top of the marks of the first one.

The `<RadarSeriesArea />` and `<RadarSeriesMarks />` components make it possible to render all marks on top of all areas.
You can also use them to render components between the areas and the marks.
:::

{{"demo": "CompositionExample.js" }}

Here's how the Radar Chart is composed:

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
