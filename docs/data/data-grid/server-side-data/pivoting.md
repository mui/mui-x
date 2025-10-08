---
title: Data Grid - Server-side pivoting
---

# Data Grid - Server-side pivoting [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Implement pivoting with server-side data in the Data Grid using the Data Source layer.</p>

The Data Grid Premium's pivoting feature lets users transform data by reorganizing rows and columns, creating dynamic cross-tabulations of data.
The Grid can render pivoted data from server-side sources using the [Data Source layer](/x/react-data-grid/server-side-data/#the-solution-the-data-source-layer).

If you're new to the concept of pivoting, check out the [Understanding pivoting](/x/react-data-grid/pivoting-explained/) page to learn how it works through interactive examples.

:::warning
Pivoting performs certain computations and uses them to override corresponding props.
When pivot mode is active, the following props are ignored: `columns`, `rowGroupingModel`, `aggregationModel`, `getAggregationPosition`, `columnVisibilityModel`, `columnGroupingModel`, `groupingColDef`, `headerFilters`, `disableRowGrouping`, and `disableAggregation`.
:::

:::info
This document covers server-side pivoting.
For pivoting on the client side, see [Pivoting](/x/react-data-grid/pivoting/).
:::

## Prerequisites

Server-side pivoting is an extension of its client-side counterpart.
It is recommended to review [the client-side pivoting doc](/x/react-data-grid/pivoting/) to understand the underlying data structures and core implementation before proceeding.

To dynamically load pivoted data from the server, create a Data Source and pass it in the `dataSource` prop, as detailed in the [Server-side data overview](/x/react-data-grid/server-side-data/).

## Implementing server-side pivoting

To implement server-side pivoting, add the [Server-side row grouping](/x/react-data-grid/server-side-data/row-grouping/#implementating-server-side-row-grouping) and [Server-side aggregation](/x/react-data-grid/server-side-data/aggregation/#implementing-server-side-aggregation) properties to the Data Source.

```tsx
const customDataSource: GridDataSource = {
  getRows: async (params) => {
    // Fetch the data from the server
  },
  getGroupKey: (row) => {
    // Return the group key for the row, e.g. `name`
    return row.name;
  },
  getChildrenCount: (row) => {
    // Return the number of children for the row
    return row.childrenCount;
  },
  getAggregatedValue: (row, field) => {
    return row[`${field}Aggregate`];
  },
};
```

Additionally, use [pivotingColDef()](/x/api/data-grid/data-grid-premium/#data-grid-premium-prop-pivotingColDef) as a callback to customize the column definition for pivot columns based on the pivot value and column group path.
You must at least override the field name to target the row property holding the pivoted data.

```tsx
const pivotingColDef: DataGridPremiumProps['pivotingColDef'] = (
  originalColumnField,
  columnGroupPath,
) => ({
  field: columnGroupPath.concat(originalColumnField).join('>->'),
});
```

In addition to the standard parameters, the `getRows()` callback receives the [`pivotModel`](/x/react-data-grid/pivoting/#pivot-model) parameter when pivoting is active.
This corresponds to the current pivot configuration and contains the visible rows, columns, and values from the pivot model.
Use `pivotModel` on the server to pivot the data for each `getRows()` call.

The server should return both the pivoted `rows` and the [`pivotColumns` structure](#pivot-columns-structure) that defines how the pivot columns should be organized.

```tsx
const getRows = async (params) => {
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
    // Defined structure of pivot columns, see `Pivot columns structure` section below
    pivotColumns: getRowsResponse.pivotColumns,
  };
};
```

With the required props and parameters in place, server-side pivoting should now be implemented in your Data Grid, as shown in the demo below:

{{"demo": "ServerSidePivotingDataGrid.js", "bg": "inline"}}

:::info
The Data Source demos use a `useMockServer` utility function to simulate server-side data fetching.
In a real-world scenario, you would replace this with your own server-side data-fetching logic.

Open the Info section of your browser console to see the requests being made and the data being fetched in response.
:::

### Pivot columns structure

The `pivotColumns` response defines the structure of pivot columns to be created for the pivoted data.
Each node in the tree must have a `group` property that's either a string (for formatting on the server) or a part of a row model (for formatting on the client using [`valueGetter()`](/x/react-data-grid/column-definition/#value-getter) and [`valueFormatter()`](/x/react-data-grid/column-definition/#value-formatter) from the column definition).
`children` is a list of the next-level nodes.

```tsx
interface GridGetRowsResponsePivotColumn {
  group: string | GridRowModel;
  children?: GridGetRowsResponsePivotColumn[];
}
```

#### Structure examples

- `[{key: "Y", group: "Yes"}, {key: "N", group: "No"}]` - Creates column groups with values "Yes" and "No"
- `[{key: "2025", group: "2025", children: [{key: ""2025-01-01"", group: {quarter: "2025-01-01"}}, {key: "2025-04-01", group: {quarter: "2025-04-01"}}]}]`, along with the snippet below, creates a column group with the value "2025" that has column groups "Q1" and "Q2":

  ```tsx
  const columns = [
    {
      field: 'quarter',
      valueGetter: (value) => `Q${Math.floor(new Date(value).getMonth() / 3) + 1}`,
      // ...other properties
    },
    // ...other column definitions
  ];

  const pivotModel = {
    columns: [{ field: 'year' }, { field: 'quarter' }],
    // ...rest of the pivot model
  };
  ```

- `[{key: "25", group: {date: "2025-01-01"}, children: [{key: "01", group: {date: "2025-01-01"}}]}]`, along with the snippet below, creates a column group with the value "2025" that has column group "Q1":

  ```tsx
  const columns = [
    {
      field: 'year',
      valueGetter: (value, row) => new Date(row.date).getFullYear(),
      // ...other properties
    },
    {
      field: 'quarter',
      valueGetter: (value, row) =>
        `Q${Math.floor(new Date(row.date).getMonth() / 3) + 1}`,
      // ...other properties
    },
    // ...other column definitions
  ];

  const pivotModel = {
    columns: [{ field: 'year' }, { field: 'quarter' }],
    // ...rest of the pivot model
  };
  ```

  Even though the same values are used for the different group levels, the output value for the column headers can be different if the value formatters are different for the two pivot columns used to create the pivot data.

Each node in the last level of the pivot column structure gets all pivot value columns to complete the Data Grid's column structure.

The demo below returns a static response to demonstrate how the column structure is created from the `pivotColumns` response and how the pivot column field can be defined with `pivotingColDef()`.

In this case, all groups are strings formatted on the server.
Pivot data is retrieved from fields whose names are constructed by combining the group keys and pivot value field name.

{{"demo": "ServerSidePivotingColumnStructureSimple.js", "bg": "inline"}}

The following demo formats year column groups on the client side.

In this case, the `pivotColumns` response returns an object for each year that needs to be created.
Each object contains a `date` property because `year` is a derived column that gets its value via `valueGetter()` using that `date` property.

The Data Grid runs `valueGetter()` on the `year` field and uses the result as a label for the second level column group.
Since the formatted value is not known on the server, rows contain pivot data in fields whose names are created using the column group keys.

{{"demo": "ServerSidePivotingColumnStructureComplex.js", "bg": "inline"}}

### Column sorting

The pivot column sort parameter is processed differently for different column group types.

Column groups returned as strings are considered formatted and sorted on the server, and the Data Grid does not sort these values on the client-side.

Column groups returned as part of the row model are formatted on the client.
The result of `valueGetter()` is used to get the group value that is used for sorting.

## Derived columns in pivot mode

In pivot mode, it's often useful to group data by year or quarter.
For server-side pivoting, the Data Grid does not add any derived columns automatically, unlike [client-side pivoting](/x/react-data-grid/pivoting/#derived-columns-in-pivot-mode), because it is not known which aggregation capabilities are available on your server.

Use the `getPivotDerivedColumn()` prop to add supported derived columns.
This prop is called for each original column and returns an array of derived columns, or `undefined` if no derived columns are needed.

:::success
To sort the derived columns by a value different from the column header name—for instance, to display months of the year—use `valueGetter()` to return the month number for sorting and use `valueFormatter()` for the column header name.
:::

{{"demo": "ServerSidePivotingDerivedColumns.js", "bg": "inline"}}

## Error handling

If an error occurs during a `getRows()` call, the Data Grid displays an error indicator in the row group cell.
`onDataSourceError()` is also triggered with an error containing the params described in [Server-side data overview—Error handling](/x/react-data-grid/server-side-data/#error-handling).

The demo below renders a custom Snackbar component to display an error message when requests fail, which you can simulate using the checkbox and the **Refetch rows** button at the top.

{{"demo": "ServerSidePivotingErrorHandling.js", "bg": "inline"}}

## Group expansion

Group expansion with server-side pivoting works similarly to how it's described in the [client-side row grouping documentation](/x/react-data-grid/row-grouping/#group-expansion).
The difference is that the data is not initially available and is fetched automatically after the Data Grid is mounted, based on the `defaultGroupingExpansionDepth` and `isGroupExpandedByDefault()` props, in a waterfall manner.

The following demo uses `defaultGroupingExpansionDepth={-1}` to expand all groups by default.

{{"demo": "ServerSidePivotingGroupExpansion.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
