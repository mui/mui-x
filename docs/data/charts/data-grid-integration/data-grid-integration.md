---
title: Charts and Data Grid integration
---

# Charts - Data Grid integration [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Learn how to integrate the MUI X Charts and Data Grid for better data visualization.</p>

MUI X Charts seamlessly integrate with the [Data Grid](/x/react-data-grid/) for data visualization with dynamic Chart updates based on the Data Grid state changes (whether through the Data Grid API or user interactions).

This integration is possible via the `<GridChartsIntegrationContextProvider />` and `<GridChartsRendererProxy />` components from the `@mui/x-data-grid-premium` package, and the `<ChartRenderer />` component from the `@mui/x-charts-premium` package.

Check [Data Grid - Charts integration](/x/react-data-grid/charts-integration/) for more information and examples.

The demo below shows how to implement all of the elements mentioned above:

{{"demo": "../../data-grid/charts-integration/GridChartsIntegrationBasic.js", "bg": "inline"}}

## Excel export

Turning the chart's toolbar on, through the **Show toolbar** configuration option, adds a **Download as Excel** entry to its export menu.

The file holds the dimensions and values selected in the chart panel, one row per data point, with a column per dimension. It is written from that selection rather than from the rendered chart, so the values stay as the grid supplied them: the chart's category axis joins several dimensions into a single label and numbers repeated categories, neither of which belongs in a spreadsheet.

To export the grid's rows instead of the chart's selection, use [the Data Grid's own Excel export](/x/react-data-grid/export/#excel-export).
