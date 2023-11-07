---
title: React Data Grid - Server-side data
---

# Data Grid - Server-side data

<p class="description">The data grid server-side data</p>

## Overview

Managing server-side data efficiently in a React application can become complex as the dataset grows.

Without a dedicated module that abstracts its complexities, developers often face challenges related to manual data fetching, pagination, sorting, and filtering, and it often gets trickier to tackle performance issues, which can lead to a poor user experience.

Have a look at an example:

### Example scenario

Imagine having a data grid that displays a list of users. The data grid has pagination enabled and the user can sort the data by clicking on the column headers and also apply filters.

The data grid is configured to fetch data from the server whenever the user changes the page or updates filtering or sorting.

```tsx
const [rows, setRows] = React.useState([]);
const [paginationModel, setPaginationModel] = React.useState({
  page: 0,
  pageSize: 10,
});
const [filterModel, setFilterModel] = React.useState({
  items: [],
});
const [sortModel, setSortModel] = React.useState([]);

React.useEffect(() => {
  const fetcher = async () => {
    // fetch data from server
    const data = await fetch('https://my-api.com/data', {
      method: 'GET',
      body: JSON.stringify({
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
        sortModel,
        filterModel,
      }),
    });
    setRows(data.rows);
  };
  fetcher();
}, [paginationModel, sortModel, filterModel]);

<DataGridPro
  columns={columns}
  pagination
  sortingMode="server"
  filterMode="server"
  paginationMode="server"
  onPaginationModelChange={setPaginationModel}
  onSortModelChange={setSortModel}
  onFilterModelChange={setFilterModel}
/>;
```

This example only scratches the surface with a lot of problems still unsolved like:

- Performance optimization
- Caching data/deduping requests
- More complex use-cases on the server like grouping, tree data, etc.
- Server side row editing
- Lazy loading of data
- Handling updates to the data like row editing, row deletion, etc.
- Refetching data on-demand

Trying to solve these problems one after the other can make the code complex and hard to maintain.

## Data source

A very common pattern to solve these problems is to use a centralized data source. A data source is an abstraction layer that sits between the data grid and the server. It provides a simple interface to the data grid to fetch data and update it. It handles a lot of the complexities related to server-side data fetching. Let's delve a bit deeper into how it will look like.

:::warning

This feature is still <b>under development</b> and the information shared on this page is subject to change. Feel free to subscribe or comment on the official GitHub [issue](https://github.com/mui/mui-x/issues/8179).

:::

### Overview

The Data Grid already supports manual server-side data fetching for features like sorting, filtering, etc. In order to make it more powerful and simple to use, the grid will support a data source interface that you can implement with your existing data fetching logic.

The datasource will work with all the major data grid features which require server-side data fetching such as sorting, filtering, pagination, grouping, etc.

### Usage

The data grid server-side data source has an initial set of required methods that you need to implement. The data grid will call these methods internally when the data is required for a specific page.

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
  updateRow?(updatedRow: GridRowModel): Promise<any>;
}
```

Here's how the code will look like for the above example when implemented with data source:

```tsx
const customDataSource: DataSource = {
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
  dataSource={customDataSource}
  pagination
/>
```

Not only the code has been reduced significantly, it has removed the hassle of managing controlled states and data fetching logic too.

On top of that, the data source will also handle a lot of other aspects like caching and deduping of requests.

#### Loading data

The method `dataSource.getRows` will be called with the `GetRowsParams` object whenever some data from the server is needed. This object contains all the information that you need to fetch the data from the server.

Since previously, the data grid did not support internal data fetching, the `rows` prop was the way to pass the data to the grid. However, with server-side data, the `rows` prop is no longer needed. Instead, the data grid will call the `getRows` method whenever it needs to fetch data.

Here's the `GetRowsParams` object for reference:

```tsx
interface GetRowsParams {
  sortModel: GridSortModel;
  filterModel: GridFilterModel;
  /**
   * Alternate to `start` and `end`, maps to `GridPaginationModel` interface
   */
  paginationModel: GridPaginationModel;
  /**
   * First row index to fetch (number) or cursor information (number | string)
   */
  start: number | string; // first row index to fetch or cursor information
  /**
   * Last row index to fetch
   */
  end: number; // last row index to fetch
  /**
   * Array of keys returned by `getGroupKey` of all the parent rows until the row for which the data is requested
   * `getGroupKey` prop must be implemented to use this
   * Useful for `treeData` and `rowGrouping` only
   */
  groupKeys: string[];
  /**
   * List of grouped columns (only applicable with `rowGrouping`)
   */
  groupFields: GridColDef['field'][]; // list of grouped columns (`rowGrouping`)
}
```

And here's the `GetRowsResponse` object for reference:

```tsx
interface GetRowsResponse {
  /**
   * Subset of the rows as per the passed `GetRowsParams`
   */
  rows: GridRowModel[];
  /**
   * To reflect updates in total `rowCount` (optional)
   * Useful when the `rowCount` is inaccurate (e.g. when filtering) or not available upfront
   */
  rowCount?: number;
  /**
   * Additional `pageInfo` to help the grid determine if there are more rows to fetch (corner-cases)
   * `hasNextPage`: When row count is unknown/inaccurate, if `truncated` is set or rowCount is not known, data will keep loading until `hasNextPage` is `false`
   * `truncated`: To reflect `rowCount` is inaccurate (will trigger `x-y of many` in pagination after the count of rows fetched is greater than provided `rowCount`)
   * It could be useful with:
   * 1. Cursor based pagination:
   *   When rowCount is not known, grid will check for `hasNextPage` to determine
   *   if there are more rows to fetch.
   * 2. Inaccurate `rowCount`:
   *   `truncated: true` will let the grid know that `rowCount` is estimated/truncated.
   *   Thus `hasNextPage` will come into play to check more rows are available to fetch after the number becomes >= provided `rowCount`
   */
  pageInfo?: {
    hasNextPage?: boolean;
    truncated?: number;
  };
}
```

#### Updating data

If provided, the method `dataSource.updateRow` will be called with the `GridRowModel` object whenever the user edits a row. This method is optional and you can skip it if you don't need to update the data on the server. It will work in a similar way as the `processRowUpdate` prop.

#### Data Grid props

These data grid props will work with the server-side data source:

- `dataSource: DataSource`: the data source object that you need to implement
- `rows`: will be ignored, could be skipped when `dataSource` is provided
- `rowCount`: will be used to identify the total number of rows in the grid, if not provided, the grid will check for the _GetRowsResponse.rowCount_ value, unless the feature being used is infinite loading where no `rowCount` is available at all.

Props related to grouped data (`treeData` and `rowGrouping`):

- `getGroupKey(row: GridRowModel): string`

  will be used by the grid to group rows by their parent group
  This effectively replaces `getTreeDataPath`.
  Consider this structure:

  ```js
  - (1) Sarah // groupKey 'Sarah'
    - (2) Thomas // groupKey 'Thomas'
  ```

  When (2) is expanded, the `getRows` function will be called with group keys `['Sarah', 'Thomas']`.

- `hasChildren?(row: GridRowModel): boolean`

  Will be used by the grid to determine if a row has children on server

- `getChildrenCount?: (row: GridRowModel) => number`

  Will be used by the grid to determine the number of children of a row on server

#### Existing server-side features

The server-side data source will change a bit the way existing server-side features like `filtering`, `sorting`, and `pagination` work.

**Without data source**:
When there's no data source, the features `filtering`, `sorting`, `pagination` will work on `client` by default. In order for them to work with server-side data, you need to set them to `server` explicitly and listen to the [`onFilterModelChange`](https://mui.com/x/react-data-grid/filtering/server-side/), [`onSortModelChange`](https://mui.com/x/react-data-grid/sorting/#server-side-sorting), [`onPaginationModelChange`](https://mui.com/x/react-data-grid/pagination/#server-side-pagination) events to fetch the data from the server based on the updated variables.

```tsx
<DataGrid
  columns={columns}
  rows={rows}
  pagination
  sortingMode="server"
  filterMode="server"
  paginationMode="server"
  onPaginationModelChange={(newPaginationModel) => {
    // fetch data from server
  }}
  onSortModelChange={(newSortModel) => {
    // fetch data from server
  }}
  onFilterModelChange={(newFilterModel) => {
    // fetch data from server
  }}
/>
```

**With data source**:
However, with a valid data source passed the features `filtering`, `sorting`, `pagination` will automatically be set to `server`.

You just need to implement the `getRows` method and the data grid will call the `getRows` method with the proper params whenever it needs data.

```tsx
<DataGridPro
  columns={columns}
  dataSource={customDataSource} // this automatically means `sortingMode="server"`, `filterMode="server"`, `paginationMode="server"`
/>
```

#### Caching

The data grid will cache the data it receives from the server. This means that if the user navigates to a page that has already been fetched, the grid will not call the `getRows` function again. This is to avoid unnecessary calls to the server.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
