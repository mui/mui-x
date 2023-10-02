# Data Grid - Server-side data source

<p class="description">The data grid server-side data interface.</p>

:::warning

This feature is still <b>under development</b> and the information shared on this page is subject to change. Feel free to subscribe or comment on the official GitHub issue.

:::

## Overview

The Data Grid already supports server-side data fetching. In order to make it more powerful and simple to use, we provide a data source interface that you can implement with your existing data fetching logic.

The datasource will work with all the major data grid features which require server-side data fetching out , such as sorting, filtering, pagination, and grouping.

## Working

The data grid server-side data source has an initial set of required methods that you need to implement. The data grid will call these methods when it needs to fetch data.

```tsx
interface DataSource {
  /**
    Fetcher Functions:
    - `getRows` is required
    - `updateRow` is optional
    
    `getRows` will be used by the grid to fetch data for the current page or children for the current parent group
    It may return a `rowCount` to update the total count of rows in the grid
  */
  getRows(params: GetRowsParams): Promise<GetRowsResponse>;
  // if passed, will be called like `processRowUpdate` on row edit
  updateRow?(updatedRow: GridRowModel): Promise<any>;
}
```

Here's how you can configure the data grid to use your data source with most basic configuration:

```tsx
const myCustomDataSource = {
  getRows: async (params: GetRowsParams): GetRowsResponse => {
    // fetch data from server
    const response = await fetch('https://my-api.com/data', {
      method: 'GET',
      body: JSON.stringify(params),
    });
    const data = await response.json();
    // return the data and the total number of rows
    return {
      rows: data.rows,
      rowCount: data.totalCount,
    };
  },
}

<DataGridPro
  columns={columns}
  dataSource={myCustomDataSource}
/>
```

### Loading data

The method `dataSource.getRows` will be called with the `GetRowsParams` object whenever some data from the server is needed. This object contains all the information that you need to fetch the data from the server.

Since previously, the data grid did not support internal data fetching, the `rows` prop was the way to pass the data to the grid. However, with server-side data, the `rows` prop is no longer needed. Instead, the data grid will call the `getRows` method whenever it needs to fetch data.

Here's the `GetRowsParams` object for reference:

```tsx
interface GetRowsParams {
  sortModel: GridSortModel;
  filterModel: GridFilterModel;
  groupKeys: string[]; // array of keys returned by `getGroupKey` of all the parent rows until the row for which the data is requested
  paginationModel: GridPaginationModel; // alternate to `start`, `end`
  start: number | string; // first row index to fetch or cursor information
  end: number; // last row index to fetch
  groupFields: GridColDef['field'][]; // list of grouped columns (`rowGrouping`)
}
```

And here's the `GetRowsResponse` object for reference:

```tsx
interface GetRowsResponse {
  rows: GridRowModel[];
  rowCount?: number; // optional: to reflect updates in total `rowCount`
  pageInfo?: {
    hasNextPage?: boolean; // optional: when row count is unknown/inaccurate, if `truncated` is set or rowCount is not known, data will keep loading until `hasNextPage` is `false`
    truncated?: number; // optional: to reflect rowCount is inaccurate (will trigger `x-y of many` in pagination)
  };
}
```

### Updating data

If provided, the method `dataSource.updateRow` will be called with the `GridRowModel` object whenever the user edits a row. This method is optional and you can skip it if you don't need to update the data on the server. It will work in a similar way as the `processRowUpdate` prop.

### Data grid props

These data grid props will work with the server-side data source:

- `dataSource: DataSource`: the data source object that you need to implement
- `queryClient: QueryClient`: optional: if not provided, a new instance of `QueryClient` will be created internally
- `rows`: will be ignored, could be skipped when `dataSource` is provided
- `rowCount`: will be used to identify the total number of rows in the grid, if not provided, the grid will use the _GetRowsResponse.rowCount_ value

Props related to grouped data (`treeData` and `rowGrouping`):

- `getGroupKey(row: GridRowModel): string`

  will be used by the grid to group rows by their parent group
  This effectively replaces `getTreeDataPath`.
  Consider this structure:

  ```
  - (1) Sarah // groupKey 'Sarah'
    - (2) Thomas // groupKey 'Thomas'
  ```

  When (2) is expanded, the `getRows` function will be called with group keys `['Sarah', 'Thomas']`.

- `hasChildren?(row: GridRowModel): boolean`

  Will be used by the grid to determine if a row has children on server

- `getChildrenCount?: (row: GridRowModel) => number`

  Will be used by the grid to determine the number of children of a row on server

### Existing server-side features

The server-side `dataSource` will change a bit the way existing server-side features work. Whenever a valid data source is passed the features `filtering`, `sorting`, `pagination` will automatically be set to `server`.

However, if for some reason, you want to explicitly work one or more of these features to work on `client`, you can do so by passing the `client` value to the feature. Here's an example:

```tsx
<DataGridPro
  columns={columns}
  dataSource={myCustomDataSource} // will set `filtering`, `sorting`, `pagination` to `server`
  filterMode="client" // will set `filtering` to `client` i.e. data won't be refetched on filter change
/>
```

### Caching

The data grid will cache the data it receives from the server. This means that if the user navigates to a page that has already been fetched, the grid will not call the `getRows` function again. This is to avoid unnecessary calls to the server.

By default, the data grid will use the tanstack react-query library to cache the data. A `QueryClient` is created internally and used with the data source. You can also pass your own instance of `QueryClient` in order to have access to the cached data outside the data grid. You can also use this client to invalidate the cache when you need to.

In order to access the current keys for the `QueryClient`, you can wrap the application into the `DataSourceProvider`.

```tsx
<DataSourceProvider>
  <DataGridPro
    columns={columns}
    dataSource={myCustomDataSource}
    queryClient={myCustomQueryClientInstance}
  />
  <AnotherSubApp
    queryClient={myCustomQueryClientInstance}
    // this app will have access to the same cache as the data grid
    // thanks to the `DataSourceProvider` which will share the on each cache update `queryKeys` using pub-sub pattern
  />
</DataSourceProvider>
```

Or you could use the `onCacheUpdate` event to listen whenever grid populates the cache with new data.

```tsx
<DataGridPro
  columns={columns}
  dataSource={myCustomDataSource}
  queryClient={myCustomQueryClientInstance}
  onCacheUpdate={(params) => {
    // params will contain the `QueryKey`
    // you can use this to access or invalidate the cache
    myCustomQueryClientInstance.getQueryData(params.queryKey);
  }}
/>
```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
