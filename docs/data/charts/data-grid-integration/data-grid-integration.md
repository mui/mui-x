---
title: Charts & Data Grid integration
---

# Data Grid integration [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Use charts to visualize grid data.</p>

Charts integrate seamlessly with MUI X Data Grid, allowing for data visualization and enabling dynamic chart updates based on Grid state changes, either through the Grid API or user interaction.

This integration is possible via the `<GridChartsIntegrationContextProvider />` and `<GridChartsRendererProxy />` components from the `@mui/x-data-grid-premium` package, and the `<ChartRenderer />` component from the `@mui/x-charts-premium` package.

Check [Data Grid - Charts integration](/x/react-data-grid/charts-integration/) for more information and examples.

## Basic integration

The demo below shows all the elements needed to have the grid and charts integration working.

{{"demo": "../../data-grid/charts-integration/GridChartsIntegrationRowGrouping.js", "bg": "inline"}}
