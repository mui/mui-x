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
