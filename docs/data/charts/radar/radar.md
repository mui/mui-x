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

A radar chart is defined by two main props:

- The `series` prop which provides the values to display thanks to the `data` property.
- The `radar` prop which defines the radar axes.

{{"demo": "BasicRadar.js"}}

## Multi-series

You can plot multiple series on the same radar chart.

{{"demo": "MultiSeriesRadar.js"}}

## Series options

Radar series support `hideMark` and `fillArea` parameter to modify the rendering of the series.

{{"demo": "DemoRadarVisualisation.js"}}

## Axis

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

## Interaction 🚧

### Axis click 🚧

### Item click 🚧

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

Like other chart, the radar chart [tooltip](/x/react-charts/tooltip/) can be customized with slots.
The `slots.tooltip.trigger` allows to switch between:

- `'item'`—when the user's mouse hovers over a radar area, the tooltip displays data about this series.
- `'axis'`—the user's mouse position is associated with a metric. The tooltip displays data about all series along this specific metric.
- `'none'`—disable the tooltip.

{{"demo": "RadarTooltip.js" }}

## Composition 🚧

For composition, use the `RadarDataProvider` to provide `series` and `radar` props.

Providing components for radar composition is still a work in progress.
If you miss some element or explanation, please open an issue describing what you want to achieve, and what is missing.

In this example, we uses `RadarSeriesArea` and `RadarSeriesMarks` to modify the order of the elements:
all the marks are on top of all the path.
Additionally, we apply different properties based on the series id.

{{"demo": "CompositionExample.js" }}
