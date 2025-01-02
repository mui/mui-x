---
title: React Data Grid - Server-side tree data
---

# Data Grid - Server-side tree data [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')🧪

<p class="description">Tree data lazy-loading with server-side data source.</p>

To dynamically load tree data from the server, including lazy-loading of children, you must create a data source and pass the `unstable_dataSource` prop to the Data Grid, as detailed in the [overview section](/x/react-data-grid/server-side-data/).

:::info
If you are looking for tree data on the client-side, see [client-side tree data](/x/react-data-grid/tree-data/).
:::

The data source also requires some additional props to handle tree data:

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

Like the other parameters such as `filterModel`, `sortModel`, and `paginationModel`, the `getRows()` callback receives a `groupKeys` parameter that corresponds to the keys provided for each nested level in `getGroupKey()`.
Use `groupKeys` on the server to extract the rows for a given nested level.

```tsx
const getRows: async (params) => {
  const urlParams = new URLSearchParams({
    // Example: JSON.stringify(['Billy Houston', 'Lora Dean']).
    groupKeys: JSON.stringify(params.groupKeys),
  });
  const getRowsResponse = await fetchRows(
    // Server should extract the rows for the nested level based on `groupKeys`.
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
The data source demos use a `useMockServer` utility function to simulate server-side data fetching.
In a real-world scenario you would replace this with your own server-side data-fetching logic.

Open the Info section of your browser console to see the requests being made and the data being fetched in response.
:::

## Error handling

For each row group expansion, the data source is called to fetch the children. If an error occurs during the fetch, the grid will display an error message in the row group cell. `unstable_onDataSourceError` is also triggered with the error and the fetch params.

The demo below shows a toast apart from the default error message in the grouping cell. Cache has been disabled in this demo for simplicity.

{{"demo": "ServerSideTreeDataErrorHandling.js", "bg": "inline"}}

## Group expansion

The idea behind the group expansion is the same as explained in the [Row grouping](/x/react-data-grid/row-grouping/#group-expansion) section.
The difference is that the data is not initially available and is fetched automatically after the Data Grid is mounted based on the props `defaultGroupingExpansionDepth` and `isGroupExpandedByDefault` in a waterfall manner.

The following demo uses `defaultGroupingExpansionDepth={-1}` to expand all levels of the tree by default.

{{"demo": "ServerSideTreeDataGroupExpansion.js", "bg": "inline"}}

## Custom cache

The data source uses a cache by default to store the fetched data.
Use the `unstable_dataSourceCache` prop to provide a custom cache if necessary.
See [Data caching](/x/react-data-grid/server-side-data/#data-caching) for more info.

The following demo uses `QueryClient` from `@tanstack/react-core` as a data source cache.

{{"demo": "ServerSideTreeDataCustomCache.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
