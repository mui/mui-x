---
title: Charts and Data Grid integration
---

# Charts - Data Grid integration [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🧪

<p class="description">Learn how to integrate the MUI X Charts and Data Grid for better data visualization.</p>

MUI X Charts seamlessly integrate with the [Data Grid](/x/react-data-grid/) for data visualization with dynamic Chart updates based on the Data Grid state changes (whether through the Data Grid API or user interactions).

:::warning
This feature is in preview. It is ready for production use, but its API, visuals and behavior may change in future minor or patch releases.
:::

This integration is possible via the `<GridChartsIntegrationContextProvider />` and `<GridChartsRendererProxy />` components from the `@mui/x-data-grid-premium` package, and the `<ChartRenderer />` component from the `@mui/x-charts-premium` package.

Check [Data Grid - Charts integration](/x/react-data-grid/charts-integration/) for more information and examples.

The demo below shows how to implement all of the elements mentioned above:

{{"demo": "../../data-grid/charts-integration/GridChartsIntegrationBasic.js", "bg": "inline"}}
