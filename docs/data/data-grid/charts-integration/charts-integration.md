---
title: Data Grid & Charts Integration
---

# Data Grid & Charts Integration [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Visualize the grid data.</p>

This page demonstrates how to integrate the Data Grid with MUI X Charts using the `GridChartsIntegrationContextProvider` and the `ChartRenderer` component from `@mui/x-charts-pro`.

By combining these components, you can visualize grid data as charts and enable dynamic chart updates based on grid state or user interaction.

## Basic Integration Example

The following example shows how to wrap a Data Grid and a chart in the same context provider. The grid provides categories and series to the chart, which renders a bar chart.

{{"demo": "GridChartsIntegrationExample.js", "bg": "inline"}}
