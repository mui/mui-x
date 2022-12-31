# Data Grid - Pagination

<p class="description">Easily paginate your rows and only fetch what you need.</p>

:::warning
The default pagination behavior depends on your plan.

- On the `DataGrid`, pagination is enabled by default and can't be disabled
- On the `DataGridPro`, pagination is disabled by default, use the `pagination` prop to enable it

:::

## Size of the page

The MIT `DataGrid` is limited to pages of up to 100 rows.
If you want larger pages, you will need to upgrade to [Pro plan](/x/introduction/licensing/#pro-plan) or above.

By default, each page contains 100 rows. The user can change the size of the page through the selector in the footer.

### Page size options

You can configure the page size the user can choose from with the `rowsPerPageOptions` prop.

{{"demo": "PageSizeCustomOptions.js", "bg": "inline"}}

### Automatic page size

Use the `autoPageSize` prop to auto-scale the `pageSize` to match the container height and the max number of rows that can be displayed without a vertical scroll bar.

:::warning
You can't use both the `autoPageSize` and `autoHeight` props at the same time because `autoHeight` scales the height of the grid according to the `pageSize`.
:::

{{"demo": "PageSizeAuto.js", "bg": "inline"}}

### Initialize the pagination model

To initialize the pagination model without controlling it, provide the `paginationModel` to the `initialState` prop.

```tsx
<DataGrid
  initialState={{
    pagination: {
      paginationModel: { pageSize: 25, page: 0 },
    },
  }}
/>
```

{{"demo": "PageSizeInitialState.js", "bg": "inline"}}

### Controlled page size

Use the `paginationModel` prop to control the size of the pages.

You can use the `onPaginationModelChange` prop to listen to changes to the `paginationModel` and update the prop accordingly.

{{"demo": "PageSizeControlled.js", "bg": "inline"}}

## Current page

### Initialize the page

To initialize the page without controlling it, provide the it in `paginationModel` to the `initialState` prop.

```tsx
<DataGrid
  initialState={{
    pagination: {
      paginationModel: { page: 1, pageSize: 5 },
    },
  }}
/>
```

{{"demo": "PageInitialState.js", "bg": "inline"}}

### Controlled page

Use the `paginationModel` prop to control the size of the pages.

You can use the `onPaginationModelChange` prop to listen to changes to the `paginationModel` and update the prop accordingly.

{{"demo": "PageControlled.js", "bg": "inline"}}

## Server-side pagination

By default, the pagination is handled on the client.
This means you have to give the rows of all pages to the grid.
If your dataset is too big, and you only want to fetch the current page, you can use server-side pagination.

:::info
For more information regarding server-side pagination in combination with controlled selection check [here](/x/react-data-grid/row-selection/#usage-with-server-side-pagination)
:::

### Basic implementation

- Set the prop `paginationMode` to `server`
- Provide a `rowCount` prop to let the grid know how many pages there are
- Listen to `onPaginationModelChange` callback to load the rows when the page changes

Since `rowCount` prop is used to compute the number of available pages, switching it to `undefined` during loading reset page to zero.
To avoid this problem, you can keep the previous value of `rowCount` while loading as follow:

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

:::warning
Only use this API as the last option. Give preference to the props to control the grid.
:::

{{"demo": "PaginationApiNoSnap.js", "bg": "inline", "hideToolbar": true, "defaultCodeOpen": false }}

## Selectors

{{"component": "modules/components/SelectorsDocs.js", "category": "Pagination"}}

More information about the selectors and how to use them on the [dedicated page](/x/react-data-grid/state/#access-the-state)

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
