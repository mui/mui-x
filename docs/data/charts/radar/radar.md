---
title: React Radar chart
productId: x-charts
components: RadarChart, RadarGrid, RadarSeriesArea, RadarSeriesMarks, RadarSeriesPlot, RadarDataProvider
---

# Charts - Radar 🚧

<p class="description">Radar allows to compare multivariate data in a 2D chart.</p>

:::warning
🚧 This component is under development 🚧

Not all the feature are implemented and its API might change in the future if needed to integrate the upcoming features.
:::

## Basics

A radar chart is defined by two main props.

- The `series` prop which provides the values to display thanks to the `data` property.
- The `radar` prop which defines the radar axes.

{{"demo": "BasicRadar.js"}}

## Multi-series

You can plot multiple series on the same radar chart.

{{"demo": "MultiSeriesRadar.js"}}

## Axis

The `metrics` property of `radar` takes an array with one item per corner of the radar.
This item can either be:

- A string used as the axis label. The other properties are populated from the data.
- An object with the following properties:
  - `name`: The label associated to the axis.
  - `min`: The minimal value along this direction (by default 0).
  - `max`: The maximal value along this direction (by default the maximal value along this direction).

{{"demo": "RadarAxis.js" }}

## Grid

The radar chart displays a grid behind the series that can be configured with

- `startAngle` The rotation angle of the entire chart in degree
- `divisions` The number of division of the grid

{{"demo": "DemoRadar.js" }}

## Interaction 🚧

### Axis click 🚧

### Item click 🚧

## Highlight 🚧

## Tooltip 🚧

## Composition 🚧

For composition, use the `RadarDataProvider` to provide `series` and `radar` props.

Providing components for radar composition is still a work in progress.
If you miss some element or explanation, please open an issue describing what you want to achieve, and what is missing.

In this example, we uses `RadarSeriesArea` and `RadarSeriesMarks` to modify the order of the elements:
all the marks are on top of all the path.
And we apply different properties based on the series id.

{{"demo": "CompositionExample.js" }}
