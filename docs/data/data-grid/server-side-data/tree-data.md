---
title: React Server-side tree data
---

# Data Grid - Server-side tree data [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Tree data lazy-loading with server-side data source.</p>

To use the server-side tree data, pass the `unstable_dataSource` prop as explained in the [overview section](/x/react-data-grid/server-side-data/), in addition to that passing of some additional props is required for the server-side tree data to work properly.

- `getGroupKey(row: GridRowModel): string`

  Used by the grid to group rows by their parent group. Replaces `getTreeDataPath` used in client-side tree-data.
  For example, consider this tree structure for tree data.

  ```js
  - (1) Sarah // groupKey 'Sarah'
    - (2) Thomas // groupKey 'Thomas'
  ```

  When `(2) Thomas` is expanded, the `getRows` function will be called with group keys `['Sarah', 'Thomas']`.

- `hasChildren(row: GridRowModel): boolean`

  Used by the grid to check if a row has children on server

- `getChildrenCount?: (row: GridRowModel) => number`

  Used by the grid to determine the number of children of a row on server

Following is a demo of the server-side tree data with the server side data source which supports server side filtering, sorting, and pagination. It also uses supports the caching using the `unstable_dataSourceCache` prop based on the `QueryClient` exposed by `@tanstack/query-core`.

{{"demo": "ServerSideTreeData.js", "bg": "inline"}}

:::info
The demo above uses a utility `useDemoDataSource` which uses a data generator service to generate data for testing of the application. It exposes a function called `getRows` which could be used directly as `GridDataSource.getRows`.
:::
