---
title: React Radar chart
productId: x-charts
components: RadarChart, RadarGrid, RadarTooltip, RadarLabels, RadarPlot, RadarSeriesPlot
---

# Charts - Radar 🚧

<p class="description">Radar allows to compare multivariate data in a 2D chart.</p>

## Basics

A radar chart is defined by two main props.

- The `series` prop which provides the values to display thanks to the `data` property.
- The `radar` prop which defines the radar axes.

{{"demo": "BasicRadar.js"}}

## Axis

The `metrics` property of `radar` takes an array with one item per corner of the radar.
This item can either be:

- A string which is used as the axis label. The other properties will be defaultized.
- An object with the following properties:
  - `name`: The label associated to the axis.
  - `min`: The minimal value along this direction (by default 0).
  - `max`: The maximal value along this direction (by default the maximal value along this direction).

{{"demo": "RadarAxis.js" }}

## Grid

The radar chart displays a grid behind the series that can be configured with

- `startAngle` The rotation angle of the entire chart
- `divisionNumber` The nb of division of the grid
<!-- - `colors` An array with the colors to fill the grid areas -->

{{"demo": "DemoRadarNoSnap.js" }}

## Composition

The radar chart is not composable like line chart or bar chart, because it uses polar coordinate.
To compose your own radar charts you will have to use the `RadarChartContainer`.

Providing components for radar composition is still a work in progress.
If you miss some element or explanation, please open an issue describing what you want to achieve, and what is missing.
