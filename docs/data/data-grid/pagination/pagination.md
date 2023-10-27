# Data Grid - Pagination

<p class="description">Easily paginate your rows and only fetch what you need.</p>

## Size of the page

The `DataGrid` (MIT license) is limited to pages of up to 100 rows.
If you want larger pages, you will need to upgrade to [Pro plan](/x/introduction/licensing/#pro-plan) or above.

By default, each page contains 100 rows. The user can change the size of the page through the selector in the footer.

### Page size options

You can configure the page size the user can choose from with the `pageSizeOptions` prop.

It's possible to customize the options shown in the "Rows per page" select using the `pageSizeOptions` prop.
You should either provide an array of:

- **numbers**, each number will be used for the option's label and value.

- **objects**, the `value` and `label` keys will be used respectively for the value and label of the option (useful for language strings such as 'All').

{{"demo": "PageSizeCustomOptions.js", "bg": "inline"}}

### Automatic page size

Use the `autoPageSize` prop to auto-scale the `pageSize` to match the container height and the max number of rows that can be displayed without a vertical scroll bar.

:::warning
You can't use both the `autoPageSize` and `autoHeight` props at the same time because `autoHeight` scales the height of the data grid according to the `pageSize`.
:::

{{"demo": "PageSizeAuto.js", "bg": "inline"}}

## Pagination on Pro and Premium

The default pagination behavior depends on your plan.

- On the `DataGrid`, pagination is enabled by default and can't be disabled.
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

:::info
For more information regarding server-side pagination in combination with controlled selection check [here](/x/react-data-grid/row-selection/#usage-with-server-side-pagination)
:::

### Basic implementation

- Set the prop `paginationMode` to `server`
- Provide a `rowCount` prop to let the data grid know how many pages there are
- Use the `onPaginationModelChange` prop callback to load the rows when the page changes

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

### Cursor implementation

You can also handle servers with cursor-based pagination.
To do so, you just have to keep track of the next cursor associated with each page you fetched.

{{"demo": "CursorPaginationGrid.js", "bg": "inline", "defaultCodeOpen": false }}

## Custom pagination UI

You can customize the rendering of the pagination in the footer following [the component section](/x/react-data-grid/components/#pagination) of the documentation.

## apiRef

The grid exposes a set of methods that enables all of these features using the imperative `apiRef`. To know more about how to use it, check the [API Object](/x/react-data-grid/api-object/) section.

:::warning
Only use this API as the last option. Give preference to the props to control the data grid.
:::

{{"demo": "PaginationApiNoSnap.js", "bg": "inline", "hideToolbar": true, "defaultCodeOpen": false }}

## Selectors

{{"component": "modules/components/SelectorsDocs.js", "category": "Pagination"}}

More information about the selectors and how to use them on the [dedicated page](/x/react-data-grid/state/#access-the-state)

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
