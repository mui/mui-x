---
title: Data Grid - Server-side tree data
---

# Data Grid - Server-side tree data [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Implement lazy-loading server-side tree data in the Data Grid using the Data Source layer.</p>

Trees are hierarchical data structures that organize data into parent-child relationships.
The Data Grid Pro can handle server-side tree data to render grouped rows with nested children using the [Data Source layer](/x/react-data-grid/server-side-data/#the-solution-the-data-source-layer).

:::info
For tree data on the client side, see [Tree data (client side)](/x/react-data-grid/tree-data/).
:::

## Prerequisites

Server-side tree data functionality is an extension of its client-side counterpart, so we recommend reviewing [Tree data (client side)](/x/react-data-grid/tree-data/) to understand the underlying data structures and core implementation before proceeding.

To be able to dynamically load tree data from the server, including lazy-loading of children, you must create a Data Source and pass the `dataSource` prop to the Data Grid, as detailed in the [Server-side data overview](/x/react-data-grid/server-side-data/).

## Implementing server-side tree data

The Data Source requires the following props to handle tree data:

- `getGroupKey()`: Returns the group key for the row.
- `getChildrenCount()`: Returns the number of children for the row; returns `-1` if there are children present but the count is not available.

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
};
```

The `getRows()` callback receives a `groupKeys` parameter that corresponds to the keys provided for each nested level in `getGroupKey()`.
Use `groupKeys` on the server to extract the rows for a given nested level.

```tsx
const getRows: async (params) => {
  const urlParams = new URLSearchParams({
    // Example: JSON.stringify(['Billy Houston', 'Lora Dean'])
    groupKeys: JSON.stringify(params.groupKeys),
  });
  const getRowsResponse = await fetchRows(
    // Server should extract the rows for the nested level based on `groupKeys`
    `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
  );
  return {
    rows: getRowsResponse.rows,
    rowCount: getRowsResponse.rowCount,
  };
}
```

The following tree data example supports filtering, sorting, and pagination on the server.
It also caches the data by default.

{{"demo": "ServerSideTreeData.js", "bg": "inline"}}

:::info
The Data Source demos use a `useMockServer()` utility function to simulate server-side data fetching.
In a real-world scenario you would replace this with your own server-side data-fetching logic.

Open the Info section of your browser console to see the requests being made and the data being fetched in response.
:::

## Handle dynamic data updates

To keep retrieving new values for the dynamic server-side tree data, use the `dataSourceRevalidateMs` prop.
This starts a polling timer that revalidates the current server-side query in the background and updates the Data Grid with the latest data.

The demo below uses `dataSourceRevalidateMs={2_000}` and disables the cache to make periodic updates visible.
It also uses stable row IDs in a nested stock hierarchy so expanded rows stay expanded after updates.

{{"demo": "ServerSideTreeDataRevalidation.js", "bg": "inline"}}

## Row expansion state persistence

For complete details on row expansion state persistence, see [Server-side data row grouping—Row expansion state persistence](/x/react-data-grid/server-side-data/row-grouping/#row-expansion-state-persistence).
The implementation and behavior are the same when working with tree data.

Expand some rows in the following demo and use two different refetch action buttons to see the difference in the behavior.

{{"demo": "ServerSideTreeDataExpansionPersistence.js", "bg": "inline"}}

## Error handling

For each row group expansion, the Data Source is called to fetch the children.
If an error occurs during the fetch, the Data Grid displays an error message in the row group cell.
`onDataSourceError()` is also triggered with an error object containing the params described in [Server-side data overview—Error handling](/x/react-data-grid/server-side-data/#error-handling).

The demo below renders an error message and a notification at the row group level when the requests fail, which you can simulate using the checkbox and the **Refetch rows** button at the top.
Try expanding a row group with the checkbox enabled to see this behavior.
Caching has been disabled for simplicity.

{{"demo": "ServerSideTreeDataErrorHandling.js", "bg": "inline"}}

## Group expansion

Group expansion of server-side tree data works similarly to how it's described in the [client-side row grouping documentation](/x/react-data-grid/row-grouping/#group-expansion).
The difference is that the data is not initially available and is fetched automatically after the Data Grid is mounted based on the `defaultGroupingExpansionDepth` and `isGroupExpandedByDefault()` props in a waterfall manner.

The following demo uses `defaultGroupingExpansionDepth={-1}` to expand all levels of the tree by default.

{{"demo": "ServerSideTreeDataGroupExpansion.js", "bg": "inline"}}

## Custom cache

The Data Source uses its own built-in cache by default to store fetched data.
Use the `dataSourceCache` prop to provide a custom cache if necessary.
See [Server-side data overview—Data caching](/x/react-data-grid/server-side-data/#data-caching) for more info.

The following demo uses `QueryClient` from `@tanstack/react-core` as a Data Source cache.

{{"demo": "ServerSideTreeDataCustomCache.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
