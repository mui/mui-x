---
title: React Radar chart
productId: x-charts
components: RadarChart, RadarGrid, RadarSeriesArea, RadarSeriesMarks, RadarSeriesPlot, RadarMetricLabels, RadarAxisHighlight, RadarDataProvider
---

# Charts - Radar 🧪

<p class="description">Radar allows to compare multivariate data in a 2D chart.</p>

:::warning
🚧 This component is under development 🚧

Not all the feature are implemented and its API might change in the future if needed to integrate the upcoming features.
:::

## Basics

Radar charts series should contain a `data` property containing an array of values.

Radar charts also require a `radar` prop with `metrics` property containing an array of string or objects.
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

## Composition

For composition, use the `RadarDataProvider` to provide `series` and `radar` props.

The `RadarGrid` and `RadarMetricLabels` components render the grid and the labels.

The `RadarSeriesPlot` renders series (the area and the marks) on top of each other.
The `RadarSeriesArea` and `RadarSeriesMarks` provide an alternative by rendering all series areas in the first component and all the marks in the second.
The second approach allows rendering some elements on top of areas and below marks.

The `RadarAxisHighlight` component displays the axis highlight.

{{"demo": "CompositionExample.js" }}

For info here is the composition of the `RadarChart` component.

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
      {/* Other components */}
      <ChartsOverlay />
      <Tooltip />
    </ChartsSurface>
  </ChartsWrapper>
</RadarDataProvider>
```
