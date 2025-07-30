# Data Grid - Column visibility

Define which columns are visible.

By default, all the columns are visible.
The column's visibility can be switched through the user interface in two ways:

- By opening the column menu and clicking the _Hide_ menu item.
- By clicking the _Columns_ menu and toggling the columns to show or hide.

You can prevent the user from hiding a column through the user interface by setting the `hideable` in `GridColDef` to `false`.

In the following demo, the "username" column cannot be hidden.

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const rows = [
  {
    id: 1,
    username: '@MUI',
    age: 38,
    desk: 'D-546',
  },
  {
    id: 2,
    username: '@MUI-X',
    age: 25,
    desk: 'D-042',
  },
];

export default function VisibleColumnsBasicExample() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[
          { field: 'username', hideable: false },
          { field: 'age' },
          { field: 'desk' },
        ]}
        rows={rows}
        showToolbar
      />
    </div>
  );
}

```

## Initialize the visible columns

To initialize the visible columns without controlling them, provide the model to the `initialState` prop.

:::info

Passing the visible columns to the `initialState` prop will only have an impact when the Data Grid is rendered for the first time. In order to update the visible columns after the first render, you need to use the [`columnVisibilityModel`](#controlled-visible-columns) prop.

:::

```tsx
<DataGrid
  initialState={{
    columns: {
      columnVisibilityModel: {
        // Hide columns status and traderName, the other columns will remain visible
        status: false,
        traderName: false,
      },
    },
  }}
/>
```

```tsx
import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid } from '@mui/x-data-grid';

export default function VisibleColumnsModelInitialState() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 20,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        initialState={{
          ...data.initialState,
          columns: {
            ...data.initialState?.columns,
            columnVisibilityModel: {
              id: false,
              brokerId: false,
              status: false,
            },
          },
        }}
      />
    </div>
  );
}

```

## Controlled visible columns

Use the `columnVisibilityModel` prop to control the visible columns.
You can use the `onColumnVisibilityModelChange` prop to listen to the changes to the visible columns and update the prop accordingly.

```tsx
<DataGrid
  columnVisibilityModel={{
    // Hide columns status and traderName, the other columns will remain visible
    status: false,
    traderName: false,
  }}
/>
```

```tsx
import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid, GridColumnVisibilityModel } from '@mui/x-data-grid';

export default function VisibleColumnsModelControlled() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 20,
  });

  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>({
      id: false,
      brokerId: false,
      status: false,
    });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={(newModel) =>
          setColumnVisibilityModel(newModel)
        }
      />
    </div>
  );
}

```

## Column visibility panel

The column visibility panel allows the user to control which columns are visible in the Data Grid.

The panel can be opened by:

- Clicking the _Columns_ button in the [toolbar](/x/react-data-grid/components/#toolbar).
- Clicking the _Manage columns_ button in the [column menu](/x/react-data-grid/column-menu/).

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ColumnSelectorGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} showToolbar />
    </div>
  );
}

```

### Disable the column visibility panel

Sometimes, the intention is to disable the columns panel or control the visible columns programmatically based on the application state.
To disable the column visibility panel, set the prop `disableColumnSelector={true}` and use the [`columnVisibilityModel`](#controlled-visible-columns) prop to control the visible columns.

```tsx
<DataGrid disableColumnSelector columnVisibilityModel={columnVisibilityModel} />
```

In the following demo, the columns panel is disabled, and access to columns `id`, `quantity`, and `filledQuantity` is only allowed for the `Admin` type user.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const UserType = {
  Regular: 0,
  Admin: 1,
};

export default function ColumnSelectorDisabledGrid() {
  const [userType, setUserType] = React.useState(UserType.Regular);
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 7,
  });

  const columnVisibilityModel = React.useMemo(() => {
    if (userType === UserType.Admin) {
      return {
        quantity: true,
        filledQuantity: true,
        id: true,
      };
    }
    return {
      quantity: false,
      filledQuantity: false,
      id: false,
    };
  }, [userType]);

  return (
    <Stack height="450px" width="100%">
      <FormControl sx={{ width: '200px', pb: 1 }}>
        <InputLabel id="demo-simple-select-label">User Type</InputLabel>
        <Select
          labelId="demo-user-type-label"
          id="demo-user-type"
          value={userType}
          label="User Type"
          onChange={(event: SelectChangeEvent<number>) => {
            setUserType(event.target.value as number);
          }}
        >
          <MenuItem value={UserType.Regular}>Regular User</MenuItem>
          <MenuItem value={UserType.Admin}>Admin</MenuItem>
        </Select>
      </FormControl>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          {...data}
          disableColumnSelector
          columnVisibilityModel={columnVisibilityModel}
          showToolbar
        />
      </div>
    </Stack>
  );
}

```

### Customize the list of columns in columns management

To show or hide specific columns in the column visibility panel, use the `slotProps.columnsManagement.getTogglableColumns` prop. It should return an array of column field names.

```tsx
import {
  DataGridPremium,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
} from '@mui/x-data-grid-premium';

// stop `id`, GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, and `status` columns to be togglable
const hiddenFields = ['id', GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'status'];

const getTogglableColumns = (columns: GridColDef[]) => {
  return columns
    .filter((column) => !hiddenFields.includes(column.field))
    .map((column) => column.field);
};

<DataGridPremium
  showToolbar
  slotProps={{
    columnsManagement: {
      getTogglableColumns,
    },
  }}
/>;
```

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  useKeepGroupedColumnsHidden,
  useGridApiRef,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

const hiddenFields = ['id', GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'status'];

const getTogglableColumns = (columns: GridColDef[]) => {
  return columns
    .filter((column) => !hiddenFields.includes(column.field))
    .map((column) => column.field);
};

export default function ColumnSelectorGridCustomizeColumns() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      ...data.initialState,
      rowGrouping: {
        model: ['status'],
      },
    },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        apiRef={apiRef}
        {...data}
        initialState={initialState}
        showToolbar
        slotProps={{
          columnsManagement: {
            getTogglableColumns,
          },
        }}
      />
    </div>
  );
}

```

### Disable actions in footer

To disable `Show/Hide All` checkbox or `Reset` button in the footer of the columns management component, pass `disableShowHideToggle` or `disableResetButton` to `slotProps.columnsManagement`.

```tsx
<DataGrid
  showToolbar
  slotProps={{
    columnsManagement: {
      disableShowHideToggle: true,
      disableResetButton: true,
    },
  }}
/>
```

### Customize action buttons behavior when search is active

By default, the `Show/Hide All` checkbox toggles the visibility of all columns, including the ones that are not visible in the current search results.

To only toggle the visibility of the columns that are present in the current search results, pass `toggleAllMode: 'filteredOnly'` to `slotProps.columnsManagement`.

```tsx
<DataGrid
  slotProps={{
    columnsManagement: {
      toggleAllMode: 'filteredOnly',
    },
  }}
/>
```

```tsx
import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ColumnSelectorGridToggleAllMode() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        showToolbar
        slotProps={{
          columnsManagement: {
            toggleAllMode: 'filteredOnly',
          },
        }}
      />
    </div>
  );
}

```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
