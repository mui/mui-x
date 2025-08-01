---
title: Data Grid - Column pinning
---

# Data Grid - Column pinning [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

Implement pinning to keep columns in the Data Grid visible at all times.

Pinned columns (also known as sticky, frozen, and locked) are visible at all times while scrolling the Data Grid horizontally.
Users can access this feature through the column menu to pin and unpin columns to either the left or right side.
Pinned columns cannot be [reordered](/x/react-data-grid/column-ordering/), except by unpinning and repinning.

## Implementing column pinning

The Data Grid Pro provides column pinning to end users by default, and there are several different tools you can use to modify the experience to meet your needs:

- The `initialState` prop – for pinning during initialization
- The `pinnedColumns` and `onPinnedColumnsChange` props – for more control over pinning
- The imperative `apiRef` API – for fully custom solutions

### Column pinning on initialization

To set pinned columns when the Data Grid is initialized, pass a value to the `pinnedColumns` property of the `initialState` prop with the following shape:

```ts
interface GridPinnedColumnFields {
  left?: string[]; // Optional field names to pin to the left
  right?: string[]; // Optional field names to pin to the right
}
```

The demo below illustrates how this works:

```tsx
import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  DataGridPro,
  GridColDef,
  GridRowsProp,
  GridActionsCellItem,
} from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomTraderName,
  randomEmail,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

export default function BasicColumnPinning() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        initialState={{ pinnedColumns: { left: ['name'], right: ['actions'] } }}
      />
    </div>
  );
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 160, editable: true },
  { field: 'email', headerName: 'Email', width: 200, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', editable: true },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    width: 180,
    editable: true,
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    width: 220,
    editable: true,
  },
  {
    field: 'actions',
    type: 'actions',
    width: 100,
    getActions: () => [
      <GridActionsCellItem icon={<EditIcon />} label="Edit" />,
      <GridActionsCellItem icon={<DeleteIcon />} label="Delete" />,
    ],
  },
];

const rows: GridRowsProp = [
  {
    id: 1,
    name: randomTraderName(),
    email: randomEmail(),
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    email: randomEmail(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    email: randomEmail(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    email: randomEmail(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    email: randomEmail(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 6,
    name: randomTraderName(),
    email: randomEmail(),
    age: 27,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 7,
    name: randomTraderName(),
    email: randomEmail(),
    age: 18,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 8,
    name: randomTraderName(),
    email: randomEmail(),
    age: 31,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 9,
    name: randomTraderName(),
    email: randomEmail(),
    age: 24,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 10,
    name: randomTraderName(),
    email: randomEmail(),
    age: 35,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];

```

:::warning
You may encounter issues if the sum of the widths of the pinned columns is larger than the width of the Grid.
Make sure that the Data Grid can properly accommodate these columns at a minimum.
:::

### Controlled column pinning

The `pinnedColumns` prop gives you more granular control over how the user can interact with the pinning feature.
To implement this prop, pass an object to it with the same shape as that outlined in [the `initialState` section above](#column-pinning-on-initialization).
Use it together with `onPinnedColumnsChange` to track when columns are pinned and unpinned, as shown in the demo below:

```tsx
import * as React from 'react';
import {
  DataGridPro,
  GridColDef,
  GridPinnedColumnFields,
  GridRowsProp,
} from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomTraderName,
  randomEmail,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

export default function ControlPinnedColumns() {
  const [pinnedColumns, setPinnedColumns] = React.useState<GridPinnedColumnFields>({
    left: ['name'],
  });

  const handlePinnedColumnsChange = React.useCallback(
    (updatedPinnedColumns: GridPinnedColumnFields) => {
      setPinnedColumns(updatedPinnedColumns);
    },
    [],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Alert severity="info">
        <code>pinnedColumns: {JSON.stringify(pinnedColumns)}</code>
      </Alert>
      <Box sx={{ height: 400, mt: 1 }}>
        <DataGridPro
          rows={rows}
          columns={columns}
          pinnedColumns={pinnedColumns}
          onPinnedColumnsChange={handlePinnedColumnsChange}
        />
      </Box>
    </Box>
  );
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  { field: 'email', headerName: 'Email', width: 200, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', editable: true },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    width: 180,
    editable: true,
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    width: 220,
    editable: true,
  },
];

const rows: GridRowsProp = [
  {
    id: 1,
    name: randomTraderName(),
    email: randomEmail(),
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    email: randomEmail(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    email: randomEmail(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    email: randomEmail(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    email: randomEmail(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];

```

## Disabling column pinning

Column pinning is enabled by default on the Data Grid Pro, but you can disable it for some or all columns.

### For all columns

To disable pinning for all columns, set the `disableColumnPinning` prop to `true`:

```tsx
<DataGridPro disableColumnPinning />
```

### For specific columns

To disable pinning for a specific column, set the `pinnable` property to `false` in the column's `GridColDef`, as shown below:

```tsx
<DataGridPro columns={[{ field: 'id', pinnable: false }]} /> // Default is `true`
```

### Remove pinning from the column menu

An alternative option for disabling pinning actions is to remove them from the user interface, which can be done in one of two ways:

1. Use the column menu API to hide the pinning actions. See [Column menu—Hiding a menu item](/x/react-data-grid/column-menu/#hiding-a-menu-item) for details.
2. Use the [`disableColumnMenu` prop](/x/react-data-grid/column-menu/#disable-column-menu) to completely remove the column menu altogether.

## Pinning non-pinnable columns programmatically

When [pinning is disabled](#disabling-column-pinning) in the UI for some or all columns (via `disableColumnPinning` or `colDef.pinnable`), it's still possible to implement it programmatically.
You can do this in one of three ways:

1. Initialized pinning with `initialState`
2. Controlled pinning with `pinnedColumns`
3. Using the [`setPinnedColumns()` method](#apiref)

The code snippets below illustrate these three approaches:

```tsx
// 1. Initialized pinning
<DataGridPro
  disableColumnPinning
  initialState={{ pinnedColumns: { left: ['name'] } }}
/>

// 2. Controlled pinning
<DataGridPro
  disableColumnPinning
  pinnedColumns={{ left: ['name'] }}
/>

// 3. Using the `setPinnedColumns()` method
<React.Fragment>
  <DataGridPro disableColumnPinning />
  <Button onClick={() => apiRef.current.setPinnedColumns({ left: ['name'] })}>
    Pin name column
  </Button>
</React.Fragment>
```

In the following demo, pinning is disabled but the Grid is initialized with the **Name** column pinned to the left:

```tsx
import * as React from 'react';
import { DataGridPro, GridColDef, GridRowsProp } from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomTraderName,
  randomEmail,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

export default function DisableColumnPinningButtons() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        initialState={{ pinnedColumns: { left: ['name'] } }}
        disableColumnPinning
      />
    </div>
  );
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 160, editable: true },
  { field: 'email', headerName: 'Email', width: 200, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', editable: true },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    width: 180,
    editable: true,
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    width: 220,
    editable: true,
  },
];

const rows: GridRowsProp = [
  {
    id: 1,
    name: randomTraderName(),
    email: randomEmail(),
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    email: randomEmail(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    email: randomEmail(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    email: randomEmail(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    email: randomEmail(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];

```

## Pinning autogenerated columns

Certain features (such as [checkbox selection](/x/react-data-grid/row-selection/#checkbox-selection) and [row reordering](/x/react-data-grid/row-ordering/)) add autogenerated columns in the Data Grid.
You can pin these by adding `GRID_CHECKBOX_SELECTION_COL_DEF.field` and `GRID_REORDER_COL_DEF.field`, respectively, to the list of pinned columns, as shown in the demo below:

```tsx
import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  DataGridPro,
  GridColDef,
  GridRowsProp,
  GridActionsCellItem,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GRID_REORDER_COL_DEF,
} from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomTraderName,
  randomEmail,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

export default function ColumnPinningAutogeneratedColumns() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        checkboxSelection
        rowReordering
        initialState={{
          pinnedColumns: {
            left: [
              GRID_REORDER_COL_DEF.field,
              GRID_CHECKBOX_SELECTION_COL_DEF.field,
            ],
            right: ['actions'],
          },
        }}
      />
    </div>
  );
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 160, editable: true },
  { field: 'email', headerName: 'Email', width: 200, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', editable: true },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    width: 180,
    editable: true,
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    width: 220,
    editable: true,
  },
  {
    field: 'actions',
    type: 'actions',
    width: 100,
    getActions: () => [
      <GridActionsCellItem icon={<EditIcon />} label="Edit" />,
      <GridActionsCellItem icon={<DeleteIcon />} label="Delete" />,
    ],
  },
];

const rows: GridRowsProp = [
  {
    id: 1,
    name: randomTraderName(),
    email: randomEmail(),
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    email: randomEmail(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    email: randomEmail(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    email: randomEmail(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    email: randomEmail(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];

```

## Pinning columns with dynamic row height

The Data Grid supports use cases involving both column pinning and [dynamic row height](/x/react-data-grid/row-height/#dynamic-row-height).
However, if row contents change after the initial calculation, you may need to trigger a manual recalculation to avoid incorrect measurements.
You can do this by calling `apiRef.current.resetRowHeights()` whenever the content changes.

The demo below contains an example of both features enabled:

```tsx
import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {
  DataGridPro,
  GridColDef,
  GridRowsProp,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomTraderName,
  randomEmail,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

export default function ColumnPinningDynamicRowHeight() {
  const apiRef = useGridApiRef();
  const [showEditDelete, setShowEditDelete] = React.useState(true);

  const columns: GridColDef[] = React.useMemo(
    () => [
      { field: 'name', headerName: 'Name', width: 160, editable: true },
      { field: 'email', headerName: 'Email', width: 200, editable: true },
      { field: 'age', headerName: 'Age', type: 'number', editable: true },
      {
        field: 'dateCreated',
        headerName: 'Date Created',
        type: 'date',
        width: 180,
        editable: true,
      },
      {
        field: 'lastLogin',
        headerName: 'Last Login',
        type: 'dateTime',
        width: 220,
        editable: true,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 100,
        renderCell: () => (
          <Stack spacing={1} sx={{ width: 1, py: 1 }}>
            {showEditDelete && (
              <React.Fragment>
                <Button variant="outlined" size="small" startIcon={<EditIcon />}>
                  Edit
                </Button>
                <Button variant="outlined" size="small" startIcon={<DeleteIcon />}>
                  Delete
                </Button>
              </React.Fragment>
            )}
            <Button variant="outlined" size="small" startIcon={<PrintIcon />}>
              Print
            </Button>
          </Stack>
        ),
      },
    ],
    [showEditDelete],
  );

  const handleToggleClick = React.useCallback(() => {
    setShowEditDelete((prevShowEditDelete) => !prevShowEditDelete);
  }, []);

  React.useLayoutEffect(() => {
    apiRef.current?.resetRowHeights();
  }, [apiRef, showEditDelete]);

  return (
    <div style={{ width: '100%' }}>
      <Button sx={{ mb: 1 }} onClick={handleToggleClick}>
        Toggle edit & delete
      </Button>
      <div style={{ height: 400 }}>
        <DataGridPro
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          getRowHeight={() => 'auto'}
          initialState={{ pinnedColumns: { left: ['name'], right: ['actions'] } }}
        />
      </div>
    </div>
  );
}

const rows: GridRowsProp = [
  {
    id: 1,
    name: randomTraderName(),
    email: randomEmail(),
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    email: randomEmail(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    email: randomEmail(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    email: randomEmail(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    email: randomEmail(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 6,
    name: randomTraderName(),
    email: randomEmail(),
    age: 27,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 7,
    name: randomTraderName(),
    email: randomEmail(),
    age: 18,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 8,
    name: randomTraderName(),
    email: randomEmail(),
    age: 31,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 9,
    name: randomTraderName(),
    email: randomEmail(),
    age: 24,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 10,
    name: randomTraderName(),
    email: randomEmail(),
    age: 35,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];

```

## apiRef

The Data Grid exposes a set of methods via the `apiRef` object that are used internally in the implementation of the column pinning feature.
The reference below describes the relevant functions.
See [API object](/x/react-data-grid/api-object/) for more details.

:::warning
This API should only be used as a last resort when the Data Grid's built-in props aren't sufficient for your specific use case.
:::

```jsx
import * as React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/x/api/data-grid/grid-column-pinning-api.json';

export default function ColumnPinningApiNoSnap() {
  return <ApiDocs proApi={api} />;
}

```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
