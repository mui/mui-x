# Data Grid - Pagination

<p class="description">Easily paginate your rows and only fetch what you need.</p>

## Size of the page

The `DataGrid` (MIT license) is limited to pages of up to 100 rows.
If you want larger pages, you will need to upgrade to [Pro plan](/x/introduction/licensing/#pro-plan) or above.

By default, each page contains 100 rows. The user can change the size of the page through the selector in the footer.

### Page size options

You can customize the options shown in the "Rows per page" select using the `pageSizeOptions` prop.
You should provide an array of items, each item should be one of these types:

- **number**, each number will be used for the option's label and value.

  ```jsx
  <DataGrid pageSizeOptions={[5, 10, 25]}>
  ```

- **object**, the `value` and `label` keys will be used respectively for the value and label of the option.

  ```jsx
  <DataGrid pageSizeOptions={[10, 100, { value: 1000, label: '1,000' }]}>
  ```

{{"demo": "PageSizeCustomOptions.js", "bg": "inline"}}

### Automatic page size

Use the `autoPageSize` prop to auto-scale the `pageSize` to match the container height and the max number of rows that can be displayed without a vertical scroll bar.

:::warning
You cannot use both the `autoPageSize` and `autoHeight` props at the same time because `autoHeight` scales the height of the Data Grid according to the `pageSize`.
:::

{{"demo": "PageSizeAuto.js", "bg": "inline"}}

## Pagination on Pro and Premium [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')[<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

The default pagination behavior depends on your plan.

- On the `DataGrid`, pagination is enabled by default and cannot be disabled.
- On the `DataGridPro` and `DataGridPremium`, pagination is disabled by default; use the `pagination` prop to enable it.

The following example activates pagination on a `DataGridPremium` component.

:::info
On a side note, exported CSV and Excel files will contain the full data and disregard the pagination by default. To apply pagination on exported files, please check the available [row selectors](/x/react-data-grid/export/#exported-rows).
:::
{{"demo": "PageSizeAutoPremium.js", "bg": "inline"}}

## Pagination model

The pagination model is an object containing the current page and the size of the page. The default value is `{ page: 0, pageSize: 100 }`. To change the default value, make it controlled by `paginationModel` prop or initialize a custom value using `initialState.pagination.paginationModel`.

### Initializing the pagination model

To initialize the pagination model without controlling it, provide the `paginationModel` to the `initialState` prop. If you don't provide a value for one of the properties, the default value will be used.

```tsx
<DataGrid
  initialState={{
    pagination: {
      paginationModel: { pageSize: 25, page: 0 },
    },
  }}
/>
```

{{"demo": "PaginationModelInitialState.js", "bg": "inline"}}

### Controlled pagination model

Pass the `paginationModel` prop to control the size and current page of the grid. You can use the `onPaginationModelChange` prop to listen to changes to the `paginationModel` and update the prop accordingly.

```tsx
const [paginationModel, setPaginationModel] = React.useState({
  pageSize: 25,
  page: 0,
});

<DataGrid
  paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
/>;
```

{{"demo": "PaginationModelControlled.js", "bg": "inline"}}

## Server-side pagination

By default, the pagination is handled on the client.
This means you have to give the rows of all pages to the data grid.
If your dataset is too big, and you only want to fetch the current page, you can use server-side pagination.

Grid supports two types of server-side pagination based on the supported API from the server:

- Index-based pagination
- Cursor-based pagination

:::info
Check out [Selection—Usage with server-side pagination](/x/react-data-grid/row-selection/#usage-with-server-side-pagination) for more details.
:::

### Index-based pagination

The index-based pagination is the most common type of pagination. It follows the same pattern as the client-side pagination (page, pageSize), but the data is fetched from the server.

It can be further categorized into sub-types based on the availability of the total number of rows or `rowCount`.

You can provide the `rowCount` using one of the following ways:

- Initialize - use `initialState.pagination.rowCount` prop to initialize the `rowCount`
- Control - use the `rowCount` prop along with `onRowCountChange` to control the `rowCount` and reflect the change it when the row count is updated
- Set using the `apiRef` - use the `apiRef.current.setRowCount` method to set the `rowCount` after the Grid is initialized

There can be three different possibilities regarding the availability of the `rowCount` on the server-side:

1. Row count is available
2. Row count is not available
3. Row count is available but is not accurate and may update later on

The following sections will guide you through the implementation of each of these possibilities.

#### 1. Row count is available

When the row count is available, you can use the following steps to enable server-side pagination:

- Set the prop `paginationMode` to `server`
- Provide the `rowCount` value using one of the above mentioned ways
- Use the `onPaginationModelChange` prop to load the rows when the page changes

Since the `rowCount` prop is used to compute the number of available pages, switching it to `undefined` during loading resets the page to zero.
To avoid this problem, you can keep the previous value of `rowCount` while loading as follows:

```jsx
const [rowCountState, setRowCountState] = React.useState(rowCount);
React.useEffect(() => {
  setRowCountState((prevRowCountState) =>
    rowCount !== undefined ? rowCount : prevRowCountState,
  );
}, [rowCount, setRowCountState]);

<DataGrid rowCount={rowCountState} />;
```

{{"demo": "ServerPaginationGrid.js", "bg": "inline"}}

#### 2. Row count is not available

When the row count is not available, you can use the following steps to enable server-side pagination:

- Set the prop `paginationMode` to `server`
- Use the `onPaginationModelChange` prop to load the rows when the page changes
- Set the `rowCount` as `-1` using one of the above mentioned ways to let the Grid know that the row count is not available
- Since the `rowCount` is unknown, the Grid needs to know whether more records are available on the server. Pass the `paginationMeta.hasNextPage` boolean property to indicate whether more records are available.

The `hasNextPage` must not be set to `false` until there are _actually_ no records left to fetch, because when `hasNextPage` becomes `false`, the Grid considers this as the last page and tries to set the `rowCount` to the currently fetched rows. This can lead to the Grid showing the wrong number of pages and rows or cause a flickering. (Alternatively, you can set the `rowCount` to the actual number of rows fetched from the server as soon as the information is available.)

The value of the `hasNextPage` variable might become `undefined` during loading if it's handled by some external fetching hook, one possible solution could be to memoize the `paginationMeta` value to avoid unnecessary flickering of the pagination UI:

```tsx
const paginationMetaRef = React.useRef<GridPaginationMeta>();

const paginationMeta = React.useMemo(() => {
  if (
    hasNextPage !== undefined &&
    paginationMetaRef.current?.hasNextPage !== hasNextPage
  ) {
    paginationMetaRef.current = { hasNextPage };
  }
  return paginationMetaRef.current;
}, [hasNextPage]);
```

{{"demo": "ServerPaginationGridNoRowCount.js", "bg": "inline"}}

#### 3. Row count is available but is not accurate

There could be possibilities when the accurate row count is not initially available for many reasons such as:

1. For some databases, computing `rowCount` upfront is a costly operationdue to scale of data or how the data is structured
2. Some data structures don't have rowCount information until the very last page is fetched.

In such cases, the backend could send an estimated row count which could be initially used to calculate the number of pages. In some cases, this estimate value could also be more than the actual row count. So the Grid uses it only to show the user an estimated number of rows, but relies on the `hasNextPage` prop to check whether more records are available on the server.

Here are the steps to achieve it:

- Set the prop `paginationMode` to `server`
- Use the `onPaginationModelChange` prop callback to load the rows when the page changes
- Pass the estimated row count using the `estimatedRowCount` prop and set the `rowCount` to `-1` to indicate that the actual row count is not (yet) available.
- Pass the `paginationMeta.hasNextPage` to let the Grid check on-demand whether more records are available on the server, the Grid will keep fetching the next page until `hasNextPage` is `false`

There could be two further possibilities:

1. The actual row count is fetched from the server lazily and provided to the Grid using the `rowCount` prop. The `estimatedRowCount` prop will be ignored once the `rowCount` prop is set to a value >= 0.
2. The user has already reached the estimated last page and the actual row count is still not available, in that case, the Grid could take the help of the `hasNextPage=false` to know that the last page is fetched.

The following example demonstrates the use of the `estimatedRowCount` and `hasNextPage` props to handle the case when the actual row count is not initially available. The actual row count is `1000` but the Grid is initially provided with an estimated row count of `100`. The Grid keeps fetching the next page until `hasNextPage` is `false` or the actual row count is provided to the Grid lazily, you can do that by clicking the "Set Row Count" button.

{{"demo": "ServerPaginationGridTruncated.js", "bg": "inline"}}

### Cursor implementation

You can also handle servers with cursor-based pagination.
To do so, you just have to keep track of the next cursor associated with each page you fetched.

{{"demo": "CursorPaginationGrid.js", "bg": "inline", "defaultCodeOpen": false }}

## Custom pagination UI

You can customize the rendering of the pagination in the footer following [the component section](/x/react-data-grid/components/#pagination) of the documentation.

## apiRef

The Data Grid exposes a set of methods that enables all of these features using the imperative `apiRef`. To know more about how to use it, check the [API Object](/x/react-data-grid/api-object/) section.

:::warning
Only use this API as the last option. Give preference to the props to control the Data Grid.
:::

{{"demo": "PaginationApiNoSnap.js", "bg": "inline", "hideToolbar": true, "defaultCodeOpen": false }}

## Selectors

{{"component": "modules/components/SelectorsDocs.js", "category": "Pagination"}}

More information about the selectors and how to use them on the [dedicated page](/x/react-data-grid/state/#access-the-state)

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
