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
If your dataset is too big, and you want to fetch the pages on demand, you can use server-side pagination.

In general, the server-side pagination could be categorized into two types:

- Index-based pagination
- Cursor-based pagination

:::info
Check out [Selection—Usage with server-side pagination](/x/react-data-grid/row-selection/#usage-with-server-side-pagination) for more details.
:::

### Index-based pagination

The index-based pagination is the most common type of pagination. It follows the same pattern as the client-side pagination (page, pageSize), but the data is fetched from the server.

To enable server-side pagination, you need to:

- Set the `paginationMode` prop to `server`
- Use the `onPaginationModelChange` prop to react to the page changes and load the data from the server

The server-side pagination can be further categorized into sub-types based on the availability of the total number of rows or `rowCount`.

The Grid uses the `rowCount` to calculate the number of pages and to show the information about the current state of the pagination in the footer.
You can provide the `rowCount` in one of the following ways:

- Initialize - use `initialState.pagination.rowCount` prop to initialize the `rowCount`
- Control - use the `rowCount` prop along with `onRowCountChange` to control the `rowCount` and reflect the changes when the row count is updated
- Set using the `apiRef` - use the `apiRef.current.setRowCount` method to set the `rowCount` after the Grid is initialized

There can be three different possibilities regarding the availability of the `rowCount` on the server-side:

1. Row count is available (known)
2. Row count is not available (unknown)
3. Row count is available but is not accurate and may update later on (estimated)

:::warning
The `rowCount` prop is used in server-side pagination mode to inform the DataGrid about the total number of rows in your dataset.
This prop is ignored when the `paginationMode` is set to `client`, i.e. when the pagination is handled on the client-side.
:::

You can achieve each of these use-cases by setting the values of `rowCount`, `paginationMeta.hasNextPage`, and `estimatedRowCount` props. The following table summarizes the use of these props in each of these scenarios.

|                              | Known row count | Unknown row count | Estimated row count |
| :--------------------------- | :-------------- | :---------------- | :------------------ |
| `rowCount`                   | `number`        | `-1`              | `-1`                |
| `paginationMeta.hasNextPage` | —               | `boolean`         | `boolean`           |
| `estimatedRowCount`          | —               | —                 | `number`            |

The following examples demonstrate each of these scenarios:

#### Known row count

The value of the `rowCount` might become `undefined` during loading if it's handled by some external fetching hook resulting in reseting the page to zero.

In such situations, memoizing the `rowCount` value could overcome this issue.

```jsx
const rowCountRef = React.useRef(pageInfo?.totalRowCount || 0);

const rowCount = React.useMemo(() => {
  if (pageInfo?.totalRowCount !== undefined) {
    rowCountRef.current = pageInfo.totalRowCount;
  }
  return rowCountRef.current;
}, [pageInfo?.totalRowCount]);

<DataGrid rowCount={rowCount} />;
```

{{"demo": "ServerPaginationGrid.js", "bg": "inline"}}

#### Unknown row count

Pass the props to the Grid as explained in the table above to handle the case when the actual row count is not initially available.

:::warning
The `hasNextPage` must not be set to `false` until there are _actually_ no records left to fetch, because when `hasNextPage` becomes `false`, the Grid considers this as the last page and tries to set the `rowCount` value to a finite value.
:::

The value of the `hasNextPage` variable might become `undefined` during loading if it's handled by some external fetching hook resulting in unwanted computations, one possible solution could be to memoize the `paginationMeta`:

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

#### Estimated row count

There could be possibilities when the accurate row count is not initially available for many reasons such as:

1. For some databases, computing `rowCount` upfront is a costly operation due to the scale of data or how the data is structured.
2. Some data structures don't have the `rowCount` information until the very last page.

In such scenarios, some backends provide an estimated row count initially which could be used to estimate the number of pages until the actual row count is available. In some cases, this estimate value could also be more than the actual row count. Therefore, the Grid uses it only to show the user an estimated number of rows, and uses `paginationMeta.hasNextPage` as a single source of truth to check whether more records are available on the server.

There could be two possibilities after providing the initial props (as mentioned in the table above):

1. The actual row count is fetched from the server lazily and provided to the Grid using the `rowCount` prop. The `estimatedRowCount` prop will be ignored once the `rowCount` prop is set to a positive value.
2. The user has already reached the estimated last page and the actual row count is still not available, in that case, the Grid could take the help of the `hasNextPage='false'` to know that the last page is fetched and try to set a value like in the unknown row count use case.

The following example demonstrates the use of the `estimatedRowCount` and `hasNextPage` props to handle the case when the actual row count is not initially available. The actual row count is `1000` but the Grid is initially provided with an estimated row count of `100`. The Grid keeps fetching the next page until `hasNextPage` is `false` or the actual row count is provided to the Grid lazily, you can do that by clicking the "Set Row Count" button.

{{"demo": "ServerPaginationGridEstimated.js", "bg": "inline"}}

:::

🌍 **Localization of the estimated row count**

The Data Grid uses the [Table Pagination](/material-ui/api/table-pagination/) component from the Material UI library which doesn't support `estimated` row count. Until this is supported natively by the Table Pagination component, a workaround to make the localization work is to provide the `labelDisplayedRows` function to the `localeText.MuiTablePagination` property as per the locale you are interested in.

The Grid injects an additional variable `estimated` to the `labelDisplayedRows` function which you can use to accomodate the estimated row count.
The following example demonstrates how to show the estimated row count in the pagination footer in the Croatian (hr-HR) language.

```jsx
const labelDisplayedRows = ({ from, to, count, estimated }) => {
  if (!estimated) {
    return `${from}–${to} od ${count !== -1 ? count : `više nego ${to}`}`,
  }
  return `${from}–${to} od ${count !== -1 ? count : `više nego ${estimated > to ? estimated : to}`}`;
}

<DataGrid
  {...data}
  localeText={{
    MuiTablePagination: {
      labelDisplayedRows,
    },
  }}
/>
```

For more information, see [Translation keys](/x/react-data-grid/localization/#translation-keys) section of the localization documentation.

:::

### Cursor-based pagination

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
