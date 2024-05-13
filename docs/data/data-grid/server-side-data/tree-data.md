---
title: React Server-side tree data
---

# Data Grid - Server-side tree data [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Tree data lazy-loading with server-side data source.</p>

To dynamically load tree data from the server, including lazy-loading of children, you must create a data source and pass the `unstable_dataSource` prop to the Data Grid, as detailed in the [overview section](/x/react-data-grid/server-side-data/).

Additionally, you must supply the following required props, listed and explained below.

```tsx
<DataGridPro
  {...data}
  unstable_dataSource={dataSource}
  getGroupKey={getGroupKey}
  hasChildren={hasChildren}
  getChildrenCount={getChildrenCount}
/>
```

- `getGroupKey(row: GridRowModel): string`

  Used to group rows by their parent group. Replaces `getTreeDataPath` used in client-side tree-data.
  For example, consider this tree structure for tree data.

  ```js
  - (1) Sarah // groupKey 'Sarah'
    - (2) Thomas // groupKey 'Thomas'
  ```

  When **(2) Thomas** is expanded, the `getRows` function will be called with group keys `['Sarah', 'Thomas']`.

- `hasChildren(row: GridRowModel): boolean`

  Used by the grid to check if a row has children on server

- `getChildrenCount?: (row: GridRowModel) => number`

  Used by the grid to determine the number of children of a row on server

## Demo

Following is a demo of the server-side tree data with the data source which supports filtering, sorting, and pagination on the server. It also caches the data by default.

{{"demo": "ServerSideTreeData.js", "bg": "inline"}}

:::info
The demo above uses a utility `useDemoDataSource` which uses a data generator service to generate data for testing of the application. Apart from providing the additional props, it exposes a function called `getRows` which could be used directly as `GridDataSource.getRows`.
:::

## Error handling

For each row group expansion, the data source is called to fetch the children. If an error occurs during the fetch, the grid will display an error message in the row group cell. `unstable_onServerSideError` is also triggered with the error and the fetch params.

The demo below shows a toast apart from the default error message in the grouping cell. Cache has been disabled in this demo for simplicity.

{{"demo": "ServerSideTreeDataErrorHandling.js", "bg": "inline"}}

## Group expansion

The idea behind the group expansion is the same as explained in the [Row grouping](/x/react-data-grid/row-grouping/#group-expansion) section. The difference is that the data is not readily available and is fetched automatically on Data Grid mount based on the props `defaultGroupingExpansionDepth` and `isGroupExpandedByDefault` in a waterfall manner.

The following demo uses `defaultGroupingExpansionDepth='-1'` to expand all the level of the tree by default.

{{"demo": "ServerSideTreeDataGroupExpansion.js", "bg": "inline"}}

## Custom cache

The data source uses a cache by default to store the fetched data. Use `unstable_serverSideCache` to provide a custom cache to the data source to manage the cache as per your requirements. See more about caching in the [overview section](/x/react-data-grid/server-side-data/#data-caching).

The following demo uses `QueryClient` from `@tanstack/react-core` to provide a custom cache to the Grid which could be manipulated on the userland.

{{"demo": "ServerSideTreeDataCustomCache.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
