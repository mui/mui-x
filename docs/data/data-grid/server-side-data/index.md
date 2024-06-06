---
title: React Data Grid - Server-side data
---

# Data Grid - Server-side data [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">The data grid server-side data.</p>

## Introduction

Server-side data management in React can become complex with growing datasets. Challenges include manual data fetching, pagination, sorting, filtering, and performance optimization. A dedicated module can help abstract these complexities, improving user experience.

Consider a data grid displaying a list of users. It supports pagination, sorting by column headers, and filtering. The grid fetches data from the server when the user changes the page or updates filtering or sorting.

```tsx
const [rows, setRows] = React.useState([]);
const [paginationModel, setPaginationModel] = React.useState({
  page: 0,
  pageSize: 10,
});
const [filterModel, setFilterModel] = React.useState({ items: [] });
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
- Server-side row editing
- Lazy loading of data
- Handling updates to the data like row editing, row deletion, etc.
- Refetching data on-demand

Trying to solve these problems one after the other can make the code complex and hard to maintain.

## Data source

The idea for a centralized data source is to simplify server-side data fetching. It's an abstraction layer between the data grid and the server, providing a simple interface for interacting with server. Think of it like a middle-man handling the communication between the Data Grid (client) and the actual data source (server).

:::warning

This feature is under development and is marked as **unstable**. The information shared on this page could change in future. Feel free to subscribe or comment on the official GitHub [umbrella issue](https://github.com/mui/mui-x/issues/8179).

:::

It has an initial set of required methods that you need to implement. The data grid will use these methods internally to fetch a sub-set of data when needed.

Let's take a look at the `GridDataSource` interface.

```tsx
interface GridDataSource {
  /**
   * This method will be called when the grid needs to fetch some rows
   * @param {GridGetRowsParams} params The parameters required to fetch the rows
   * @returns {Promise<GridGetRowsResponse>} A promise that resolves to the data of type [GridGetRowsResponse]
   */
  getRows(params: GridGetRowsParams): Promise<GridGetRowsResponse>;
  /**
   * This method will be called when the user updates a row [Not yet implemented]
   * @param {GridRowModel} updatedRow The updated row
   * @returns {Promise<any>} If resolved (synced on the backend), the grid will update the row and mutate the cache
   */
  updateRow?(updatedRow: GridRowModel): Promise<any>;
}
```

Here's how the above mentioned example would look like when implemented with the data source:

```tsx
const customDataSource: GridDataSource = {
  getRows: async (params: GridGetRowsParams): GetRowsResponse => {
    const response = await fetch('https://my-api.com/data', {
      method: 'GET',
      body: JSON.stringify(params),
    });
    const data = await response.json();

    return {
      rows: data.rows,
      rowCount: data.totalCount,
    };
  },
}

<DataGridPro
  columns={columns}
  unstable_dataSource={customDataSource}
  pagination
/>
```

The code has been significantly reduced, the need for managing the controlled states is removed, and data fetching logic is centralized.

## Server-side filtering, sorting, and pagination

The data source changes how the existing server-side features like `filtering`, `sorting`, and `pagination` work.

**Without data source**

When there's no data source, the features `filtering`, `sorting`, `pagination` work on `client` by default. In order for them to work with server-side data, you need to set them to `server` explicitly and provide the [`onFilterModelChange`](https://mui.com/x/react-data-grid/filtering/server-side/), [`onSortModelChange`](https://mui.com/x/react-data-grid/sorting/#server-side-sorting), [`onPaginationModelChange`](https://mui.com/x/react-data-grid/pagination/#server-side-pagination) event handlers to fetch the data from the server based on the updated variables.

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

**With data source**

With the data source, the features `filtering`, `sorting`, `pagination` are automatically set to `server`.

When the corresponding models update, the data grid calls the `getRows` method with the updated values of type `GridGetRowsParams` to get updated data.

```tsx
<DataGridPro
  columns={columns}
  unstable_dataSource={customDataSource} // this automatically means `sortingMode="server"`, `filterMode="server"`, `paginationMode="server"`
/>
```

The following demo showcases this behavior.

{{"demo": "ServerSideDataGrid.js", "bg": "inline"}}

:::info
The data source demos use a utility function `useMockServer` to simulate the server-side data fetching. In a real-world scenario, you should replace this with your own server-side data fetching logic.

Open info section of the browser console to see the requests being made and the data being fetched in response.
:::

## Data caching

The Data source supports caching the data it receives from the server by default. This means that if the user navigates to a page or expands a node that has already been fetched, the grid will not call the `getRows` function again to avoid unnecessary calls to the server.

The `SimpleServerSideCache` is the cache used by default which is a simple in-memory cache that stores the data in a plain object. It could be seen in action in the demo below.

{{"demo": "ServerSideDataGrid.js", "bg": "inline"}}

### Customize the cache lifetime

The `SimpleServerSideCache` has a default Time To Live (`ttl`) of 5 minutes. You can customize this by passing the `ttl` option in milliseconds to the `SimpleServerSideCache` constructor, and then passing it to the `unstable_dataSourceCache` prop.

```tsx
import { SimpleServerSideCache } from '@mui/x-data-grid-pro';

const lowTTLCache = new SimpleServerSideCache({ ttl: 1000 * 10 }); // 10 seconds

<DataGridPro
  columns={columns}
  unstable_dataSource={customDataSource}
  unstable_dataSourceCache={lowTTLCache}
/>;
```

{{"demo": "ServerSideDataGridTTL.js", "bg": "inline"}}

### Custom cache

To provide a custom cache, use `unstable_dataSourceCache` prop, which could be either written from scratch or based out of another cache library. This prop accepts a generic interface of type `GridDataSourceCache`.

```tsx
export interface GridDataSourceCache {
  getKey: (params: GridGetRowsParams) => any;
  set: (key: any, value: GridGetRowsResponse) => void;
  get: (key: any) => GridGetRowsResponse | undefined;
  clear: () => void;
```

The following demo uses cache used by a popular library [`swr`](https://github.com/vercel/swr) to cache the server-side data.

{{"demo": "ServerSideDataGridWithSWR.js", "bg": "inline"}}

### Disable cache

To disable the caching on the server-side data, pass `null` to the `unstable_dataSourceCache` prop.

```tsx
<DataGridPro
  columns={columns}
  unstable_dataSource={customDataSource}
  unstable_dataSourceCache={null}
/>
```

{{"demo": "ServerSideDataGridNoCache.js", "bg": "inline"}}

## Error handling

You could handle the errors with the data source by providing an error handler function using the `unstable_onDataSourceError`. It will be called whenever there's an error in fetching the data.

The first argument of this function is the error object, and the second argument is the fetch parameters of type `GridGetRowsParams`.

```tsx
<DataGridPro
  columns={columns}
  unstable_dataSource={customDataSource}
  unstable_onDataSourceError={(error, params) => {
    console.error(error);
  }}
/>
```

{{"demo": "ServerSideErrorHandling.js", "bg": "inline"}}

## Updating data 🚧

This feature is yet to be implemented, when completed, the method `dataSource.updateRow` will be called with the `GridRowModel` whenever the user edits a row. It will work in a similar way as the `processRowUpdate` prop.

Feel free to upvote the related GitHub [issue](https://github.com/mui/mui-x/issues/13261) to see this feature land faster.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
