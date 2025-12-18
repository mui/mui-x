# Data Grid - API object

<p class="description">Interact with the Data Grid using its API.</p>

The API object is an interface containing the state and all the methods available to programmatically interact with the Data Grid.

You can find the list of all the API methods on the [`GridApi` page](/x/api/data-grid/grid-api/).

:::warning
New and experimental features are prefixed with `unstable_` and may be removed, renamed, or reworked at any time.
:::

## How to use the API object

The API object is accessible through the `apiRef` variable.
To access this variable, use `useGridApiContext` (inside `DataGrid`) or `useGridApiRef` (outside `DataGrid`).

### Inside the Data Grid

To access the API object inside component slots or inside renders (for instance, `renderCell` or `renderHeader`), use the `useGridApiContext` hook.
The snippet below renders `Button` inside the Grid's `GridToolbarContainer`:

```tsx
function CustomToolbar() {
  const apiRef = useGridApiContext();

  return (
    <GridToolbarContainer>
      <Button onClick={() => apiRef.current.setPage(1)}>Go to page 1</Button>
    </GridToolbarContainer>
  );
}
```

:::info
You don't need to initialize the API object using `useGridApiRef` to be able to use it inside Data Grid components.
:::

{{"demo": "UseGridApiContext.js", "bg": "inline", "defaultCodeOpen": false}}

### Outside the Data Grid

When using the API object outside Data Grid components, you must initialize it using the `useGridApiRef` hook.
You can then pass it to the `apiRef` prop on the `DataGrid`:

```tsx
function CustomDataGrid(props) {
  const apiRef = useGridApiRef();

  return (
    <div>
      <Button onClick={() => apiRef.current.setPage(1)}>Go to page 1</Button>
      <DataGrid apiRef={apiRef} {...other} />
    </div>
  );
}
```

:::warning
The API object is populated by the `DataGrid`'s various plugins during the first render of the component.
If you try to use it in the first render of the component, it will crash because not all methods are registered yet.
:::

{{"demo": "UseGridApiRef.js", "bg": "inline", "defaultCodeOpen": false}}

## Common use cases

### Access the disabled column features

You can control the disabled features of a column (for example hiding, sorting, filtering, pinning, grouping, etc) programmatically using `initialState`, controlled models, or the API object.

In the example below, the API object is used to build a custom sorting for the `firstName` column which is not sortable by the default grid UI (using the `colDef.sortable` property set to `false`).

```tsx
const columns = [{ field: 'rating', sortable: false }, ...otherColumns];

function CustomDataGrid(props) {
  const apiRef = useGridApiRef();

  return (
    <div>
      <Button onClick={() => apiRef.current.sortColumn('firstName', 'asc')}>
        Sort by ASC
      </Button>
      <Button onClick={() => apiRef.current.sortColumn('firstName', 'desc')}>
        Sort by DESC
      </Button>
      <Button onClick={() => apiRef.current.sortColumn('firstName', null)}>
        Clear sort
      </Button>
      <DataGrid columns={columns} apiRef={apiRef} {...other} />
    </div>
  );
}
```

{{"demo": "AccessDisabledColumnFeatures.js", "bg": "inline", "defaultCodeOpen": false}}

### Retrieve data from the state

See [State—Access the state](/x/react-data-grid/state/#access-the-state) for a detailed example.

### Listen to grid events

See [Events—Subscribing to events](/x/react-data-grid/events/#subscribing-to-events) for a detailed example.

## API

- [`GridApi`](/x/api/data-grid/grid-api/)
- [`DataGrid`](/x/api/data-grid/data-grid/)
- [`DataGridPro`](/x/api/data-grid/data-grid-pro/)
- [`DataGridPremium`](/x/api/data-grid/data-grid-premium/)
