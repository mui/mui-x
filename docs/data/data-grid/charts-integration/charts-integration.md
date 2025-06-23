---
title: Data Grid & Charts Integration
---

# Data Grid & Charts Integration [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Visualize the grid data.</p>

This page demonstrates how to integrate the Data Grid with MUI X Charts using the `GridChartsIntegrationContextProvider` and the `ChartsRenderer` component from `@mui/x-charts-premium`.

By combining these components, you can visualize grid data as charts and enable dynamic chart updates based on grid state or user interaction.

## Basic Integration Example

The following example shows how to wrap a Data Grid and a chart in the same context provider. The grid provides categories and series to the chart, which renders the chosen chart type.

{{"demo": "GridChartsIntegrationBasic.js", "bg": "inline"}}

## With Row Grouping

The following example shows chart integration with grouped and aggregated data

{{"demo": "GridChartsIntegrationRowGrouping.js", "bg": "inline"}}

## With Pivoting

Pivoting creates columns dynamically, based on the pivoting model.
Names of those columns are determined by the values used to generate them, which makes it impossible to initialize `series` with those values.
The demo below shows how to use column grouping state selector to get the dynamic names and select few of those columns on initial render.

{{"demo": "GridChartsIntegrationPivoting.js", "bg": "inline"}}

## Customization

Use `initialState` to set different chart configuration defaults.
Combine this with the configuration options override to force certain configuration values.

Use `onRender()` prop of the `GridChartsRendererProxy` component to customize the way the charts are rendered.
With this callback you can add support for the options that are not available in our default `configurationOptions`.

In the demo below, `initialState` is used to set different default color scheme and the configuration options are updated to prevent color scheme change.
Additionally, `onRender()` is used to add a grid to the line chart.

{{"demo": "GridChartsIntegrationCustomization.js", "bg": "inline"}}
