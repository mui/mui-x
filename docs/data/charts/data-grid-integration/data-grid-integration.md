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

Turning the chart's toolbar on, through the **Show toolbar** configuration option, adds two entries to its export menu, since the chart and the Data Grid hold different data:

- **Download as Excel** writes the chart's data, meaning the dimensions and values selected in the chart panel, one row per data point and a column per dimension. It is written from that selection rather than from the rendered chart, so the values stay as the Grid supplied them: the category axis joins several dimensions into a single label and numbers repeated categories, neither of which belongs in a spreadsheet.
- **Download Data Grid data as Excel** writes the Grid's own rows, with every column, by calling [the Data Grid's Excel export](/x/react-data-grid/export/#excel-export). The Grid publishes it to the chart, so no extra wiring is needed.

Each entry can be removed on its own through the toolbar's props:

```tsx
<ChartsRenderer
  {...props}
  onRender={(type, chartProps, Component) => (
    <Component
      {...chartProps}
      slotProps={{
        ...chartProps.slotProps,
        toolbar: {
          ...chartProps.slotProps.toolbar,
          excelExportOptions: { disableToolbarButton: true },
          dataGridExportOptions: { disableToolbarButton: true },
        },
      }}
    />
  )}
/>
```

The entry labels come from the `toolbarExportExcel` and `toolbarExportDataGridExcel` [localization keys](/x/react-charts/localization/).
