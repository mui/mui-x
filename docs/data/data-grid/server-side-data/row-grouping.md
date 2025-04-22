---
title: React Data Grid - Server-side row grouping
---

# Data Grid - Server-side row grouping [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Learn how to implement lazy-loading row grouping with a server-side data source.</p>

To dynamically load row grouping data from the server, including lazy-loading of children, create a Data Source and pass the `dataSource` prop to the Data Grid, as mentioned in the [overview](/x/react-data-grid/server-side-data/) section.

:::info
For row grouping on the client side, see [client-side row grouping](/x/react-data-grid/row-grouping/).
:::

Similar to the [tree data](/x/react-data-grid/server-side-data/tree-data/), you need to pass some additional properties to enable the data source row grouping feature:

- `getGroupKey()`: Returns the group key for the row.
- `getChildrenCount()`: Returns the number of children for the row. If the children count is not available for some reason, but there are some children, returns `-1`.

```tsx
const customDataSource: GridDataSource = {
  getRows: async (params) => {
    // Fetch the data from the server.
  },
  getGroupKey: (row) => {
    // Return the group key for the row, e.g. `name`.
    return row.name;
  },
  getChildrenCount: (row) => {
    // Return the number of children for the row.
    return row.childrenCount;
  },
};
```

In addition to `groupKeys`, the `getRows()` callback receives a `groupFields` parameter. This corresponds to the current `rowGroupingModel`. Use `groupFields` on the server to group the data for each `getRows()` call.

```tsx
const getRows: async (params) => {
  const urlParams = new URLSearchParams({
    // Example: JSON.stringify(['20th Century Fox', 'James Cameron'])
    groupKeys: JSON.stringify(params.groupKeys),
    // Example: JSON.stringify(['company', 'director'])
    groupFields: JSON.stringify(params.groupFields),
  });
  const getRowsResponse = await fetchRows(
    // Server should group the data based on `groupFields` and
    // extract the rows for the nested level based on `groupKeys`.
    `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
  );
  return {
    rows: getRowsResponse.rows,
    rowCount: getRowsResponse.rowCount,
  };
}
```

{{"demo": "ServerSideRowGroupingDataGrid.js", "bg": "inline"}}

:::warning
The method [`colDef.groupingValueGetter()`](/x/react-data-grid/row-grouping/#using-groupingvaluegetter-for-complex-grouping-value) is not supported in the server-side row grouping.
Use `dataSource.getGroupKey()` to compute the group key for the row instead.
:::

## Error handling

If an error occurs during a `getRows()` call, the Data Grid displays an error message in the row group cell. `onDataSourceError()` is also triggered with the error containing the params as mentioned in the [Server-side data—Error handling](/x/react-data-grid/server-side-data/#error-handling) section.

This example shows error handling with toast notifications and default error messages in grouping cells. Caching is disabled for simplicity.

{{"demo": "ServerSideRowGroupingErrorHandling.js", "bg": "inline"}}

## Group expansion

The group expansion works similar to the [data source tree data](/x/react-data-grid/server-side-data/tree-data/#group-expansion).
The following demo uses `defaultGroupingExpansionDepth={-1}` to expand all the groups.

{{"demo": "ServerSideRowGroupingGroupExpansion.js", "bg": "inline"}}

## Demo

In the following demo, use the auto generated data based on the `Commodities` dataset to simulate the server-side row grouping.

{{"demo": "ServerSideRowGroupingFullDataGrid.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
