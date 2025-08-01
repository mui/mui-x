# Data Grid - API object

Interact with the Data Grid using its API.

The API object is an interface containing the state and all the methods available to programmatically interact with the Data Grid.

You can find the list of all the API methods on the [GridApi page](/x/api/data-grid/grid-api/).

:::warning
All methods prefixed by `unstable_` are related to experimental features and may be removed, renamed, or reworked at any time.
:::

## How to use the API object

The API object is accessible through the `apiRef` variable.
To access this variable, use `useGridApiContext` (inside the Data Grid) or `useGridApiRef` (outside the Data Grid).

### Inside the Data Grid

To access the API object inside component slots or inside renders (for instance, `renderCell` or `renderHeader`), use the `useGridApiContext` hook:

```tsx
function CustomFooter() {
  const apiRef = useGridApiContext();

  return <Button onClick={() => apiRef.current.setPage(1)}>Go to page 1</Button>;
}
```

:::info
You don't need to initialize the API object using `useGridApiRef` to be able to use it inside the Data Grid components.
:::

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid, GridToolbarContainer, useGridApiContext } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function CustomToolbar() {
  const apiRef = useGridApiContext();

  const handleGoToPage1 = () => apiRef.current.setPage(1);

  return (
    <GridToolbarContainer>
      <Button onClick={handleGoToPage1}>Go to page 1</Button>
    </GridToolbarContainer>
  );
}

export default function UseGridApiContext() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        slots={{
          toolbar: CustomToolbar,
        }}
        initialState={{
          ...data.initialState,
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        showToolbar
      />
    </Box>
  );
}

```

### Outside the Data Grid

When using the API object outside the Data Grid components, you need to initialize it using the `useGridApiRef` hook.
You can then pass it to the Data Grid's `apiRef` prop:

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
The API object is populated by the Data Grid's various plugins during the first render of the component.
If you try to use it in the first render of the component, it will crash because not all methods are registered yet.
:::

```tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function UseGridApiRef() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  const apiRef = useGridApiRef();

  const handleGoToPage1 = () => apiRef.current?.setPage(1);

  return (
    <Stack spacing={1} sx={{ width: '100%' }} alignItems="flex-start">
      <Button onClick={handleGoToPage1}>Go to page 1</Button>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          {...data}
          loading={loading}
          apiRef={apiRef}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </Box>
    </Stack>
  );
}

```

## Common use cases

### Access the disabled column features

You can control the disabled features of a column (for example hiding, sorting, filtering, pinning, grouping, etc) programmatically using `initialState`, controlled models, or the API object.

In the example below, API object is used to build a custom sorting for the _firstName_ column which is not sortable by the default grid UI (using the `colDef.sortable` property set to `false`).

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

```tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid, useGridApiRef, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
    filterable: false,
    sortable: false,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon' },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei' },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime' },
  { id: 4, lastName: 'Stark', firstName: 'Arya' },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 6, lastName: 'Melisandre', firstName: null },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara' },
  { id: 8, lastName: 'Frances', firstName: 'Rossini' },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey' },
];

export default function AccessDisabledColumnFeatures() {
  const apiRef = useGridApiRef();

  return (
    <div style={{ width: '100%' }}>
      <Button onClick={() => apiRef.current?.sortColumn('firstName', 'asc')}>
        Sort by ASC
      </Button>
      <Button onClick={() => apiRef.current?.sortColumn('firstName', 'desc')}>
        Sort by DESC
      </Button>
      <Button onClick={() => apiRef.current?.sortColumn('firstName', null)}>
        Remove sort
      </Button>
      <Box sx={{ height: 400 }}>
        <DataGrid columns={columns} rows={rows} apiRef={apiRef} />
      </Box>
    </div>
  );
}

```

### Retrieve data from the state

You can find a detailed example on the [State page](/x/react-data-grid/state/#access-the-state).

### Listen to grid events

You can find a detailed example on the [Events page](/x/react-data-grid/events/#subscribing-to-events).

## API

- [GridApi](/x/api/data-grid/grid-api/)
- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
