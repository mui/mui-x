---
title: Data Grid - Server-side pivoting
---

# Data Grid - Server-side pivoting [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Implement pivoting with server-side data in the Data Grid using the Data Source layer.</p>

The Data Grid Premium's pivoting feature lets users transform data by reorganizing rows and columns, creating dynamic cross-tabulations of data.
The Grid can render pivoted data from server-side sources using the [Data Source layer](/x/react-data-grid/server-side-data/#the-solution-the-data-source-layer).

:::info
For pivoting on the client side, see [Pivoting](/x/react-data-grid/pivoting/).
:::

:::success
If you're new to pivoting, check out the [Understanding pivoting](/x/react-data-grid/pivoting-explained/) page to learn how it works through interactive examples.
:::

:::warning
Pivoting performs certain computations and uses them to override corresponding props.
When pivot mode is active, the following props are ignored: `columns`, `rowGroupingModel`, `aggregationModel`, `getAggregationPosition`, `columnVisibilityModel`, `columnGroupingModel`, `groupingColDef`, `headerFilters`, `disableRowGrouping`, and `disableAggregation`.
:::

## Prerequisites

Server-side pivoting is an extension of its client-side counterpart, so we recommend reviewing [Pivoting](/x/react-data-grid/pivoting/) to understand the underlying data structures and core implementation before proceeding.

To be able to dynamically load pivoted data from the server, you must create a Data Source and pass the `dataSource` prop to the Data Grid, as detailed in the [Server-side data overview](/x/react-data-grid/server-side-data/).

## Implementing server-side pivoting

The Data Source requires the following props to implement pivoting:

- `getPivotColumnDef()`: Customizes the column definition for pivot columns based on the pivot value and column group path.
  This method must at least override the field name to target the row property holding the pivoted data.

```tsx
const customDataSource: GridDataSource = {
  getRows: async (params) => {
    // Fetch the data from the server
  },
  getPivotColumnDef: (field, columnGroupPath) => {
    // Customize the column definition for pivot columns
    return {
      field: columnGroupPath
        .map((path) =>
          typeof path.value === 'string' ? path.value : path.value[path.field],
        )
        .concat(field)
        .join('>->'),
      // Add other column customizations as needed
    };
  },
};
```

In addition to the standard `getRows()` parameters, the `getRows()` callback receives a `pivotModel` parameter when pivoting is active.
This corresponds to the current pivot configuration and contains the visible rows, columns, and values from the pivot model.
Use `pivotModel` on the server to pivot the data for each `getRows()` call.

The server should return both the pivoted `rows` and the `pivotColumns` structure that defines how the pivot columns should be organized.

```tsx
const getRows: async (params) => {
  const urlParams = new URLSearchParams({
    // Example: JSON.stringify({
    //   rows: [{ field: 'company' }],
    //   columns: [{ field: 'year', sort: 'asc' }],
    //   values: [{ field: 'revenue', aggFunc: 'sum' }]
    // })
    pivotModel: JSON.stringify(params.pivotModel),
    // ...other params
  });
  const getRowsResponse = await fetchRows(
    // Server should pivot the data based on `pivotModel` and return both rows and pivotColumns
    `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
  );
  return {
    rows: getRowsResponse.rows,
    rowCount: getRowsResponse.rowCount,
    aggregateRow: getRowsResponse.aggregateRow,
    // Defined structure of pivot columns
    pivotColumns: getRowsResponse.pivotColumns,
  };
}
```

### Pivot columns structure

The `pivotColumns` response defines the structure of pivot columns to be created from the pivoted data.
Each node in the tree must have a `group` property that is either a string or a part of a row model needed to get the formatted value of the original column.
`children` is a list of the next level nodes.

```tsx
interface GridGetRowsResponsePivotColumn {
  group: string | GridRowModel;
  children?: GridGetRowsResponsePivotColumn[];
}
```

**Structure examples:**

- `[{group: "Yes"}, {group: "No"}]` - Creates column groups with values "Yes" and "No"
- `[{group: "2025", children: [{group: "January"}, {group: "February"}]}]` - Creates a column group with value "2025" that has column groups "January" and "February"
- `[{group: {date: "2025-01-01"}, children: [{group: {date: "2025-01-01"}}]}]` - Creates column groups with values returned from the value formatters of the columns used for pivoting.
  Even though, the same values are used for the different group levels, the output value for the column headers can be different if the value formatters are different for the two pivot columns used to create pivot data.

With the required props and parameters in place, server-side pivoting should now be implemented in your Data Grid, as shown in the demo below:

{{"demo": "ServerSidePivotingDataGrid.js", "bg": "inline"}}

:::info
The Data Source demos use a `useMockServer` utility function to simulate server-side data fetching.
In a real-world scenario you would replace this with your own server-side data-fetching logic.

Open the Info section of your browser console to see the requests being made and the data being fetched in response.
:::

## Error handling

If an error occurs during a `getRows()` call, the Data Grid displays an error message in the pivot cell.
`onDataSourceError()` is also triggered with an error containing the params described in [Server-side data overview—Error handling](/x/react-data-grid/server-side-data/#error-handling).

The demo below renders a custom Snackbar component to display an error message when the requests fail, which you can simulate using the checkbox and the **Refetch rows** button at the top.

{{"demo": "ServerSidePivotingErrorHandling.js", "bg": "inline"}}

## Group expansion

Group expansion with server-side pivoting works similarly to how it's described in the [client-side row grouping documentation](/x/react-data-grid/row-grouping/#group-expansion).
The difference is that the data is not initially available and is fetched automatically after the Data Grid is mounted based on the `defaultGroupingExpansionDepth` and `isGroupExpandedByDefault()` props in a waterfall manner.

The following demo uses `defaultGroupingExpansionDepth={-1}` to expand all groups by default.

{{"demo": "ServerSidePivotingGroupExpansion.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
