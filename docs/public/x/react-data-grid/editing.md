# Data Grid - Editing

The Data Grid has built-in support for cell and row editing.

## Full-featured CRUD

The Data Grid is not only a data visualization tool. It offers built-in editing features for you to manage your data set.
The following demo shows a full-featured CRUD (Create, Read, Update, Delete) typically found in enterprise applications.

:::info
You will find the details of the editing API in the next sections.
:::

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlotProps,
  Toolbar,
  ToolbarButton,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';

const roles = ['Market', 'Finance', 'Development'];
const randomRole = () => {
  return randomArrayItem(roles);
};

const initialRows: GridRowsProp = [
  {
    id: randomId(),
    name: randomTraderName(),
    age: 25,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 36,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 19,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 28,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 23,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
];

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
  }
}

function EditToolbar(props: GridSlotProps['toolbar']) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { id, name: '', age: '', role: '', isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <Toolbar>
      <Tooltip title="Add record">
        <ToolbarButton onClick={handleClick}>
          <AddIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>
    </Toolbar>
  );
}

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 180, editable: true },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 80,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'joinDate',
      headerName: 'Join date',
      type: 'date',
      width: 180,
      editable: true,
    },
    {
      field: 'role',
      headerName: 'Department',
      width: 220,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Market', 'Finance', 'Development'],
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              material={{
                sx: {
                  color: 'primary.main',
                },
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        showToolbar
      />
    </Box>
  );
}

```

## Making a column editable

You can make a column editable by enabling the `editable` property in its [column definition](/x/api/data-grid/grid-col-def/).

This lets the user edit any cell from the specified columns.
For example, with the code snippet below, users can edit cells in the `name` column, but not in the `id` column.

```tsx
<DataGrid columns={[{ field: 'id' }, { field: 'name', editable: true }]} />
```

The following demo shows an example of how to make all columns editable.
Play with it by double-clicking or pressing <kbd class="key">Enter</kbd> on any cell.

```tsx
import * as React from 'react';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

export default function BasicEditingGrid() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    editable: true,
    align: 'left',
    headerAlign: 'left',
  },
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
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];

```

## Row editing

By default, only one cell can be editable at a time.
But you can let your user edit all cells in a row simultaneously.

To enable this behavior, set the `editMode` prop on the Data Grid to `"row"`. Note that you still need to set the `editable` property in each column definition to specify which of them are editable; the same basic rules for cell editing also apply to row editing.

```tsx
<DataGrid editMode="row" columns={[{ field: 'name', editable: true }]} />
```

The following demo illustrates how row editing works.
The user can [start](#start-editing) and [stop](#stop-editing) editing a row using the same actions as those provided for cell editing (for example double-clicking a cell).

```tsx
import * as React from 'react';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

export default function BasicRowEditingGrid() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid editMode="row" rows={rows} columns={columns} />
    </div>
  );
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    editable: true,
    align: 'left',
    headerAlign: 'left',
  },
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
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];

```

:::warning
By design, when changing the value of a cell all `preProcessEditCellProps` callbacks from other columns are also called.
This lets you apply conditional validation where the value of a cell impacts the validation status of another cell in the same row.
If you only want to run validation when the value has changed, check if the `hasChanged` param is `true`.

For more details on how to use `preProcessEditCellProps`, please check the editing [validation](#validation) section.
:::

## Switching between edit and view modes

Each cell and row has two modes: `edit` and `view`. When in `edit` mode, users can directly change the content of a cell or a row.

### Start editing

When a cell is in `view` mode, users can start editing a cell (or row if `editMode="row"`) with any of the following actions:

- Double-clicking a cell
- Pressing <kbd class="key">Enter</kbd>, <kbd class="key">Backspace</kbd> or <kbd class="key">Delete</kbd>—note that the latter two options both delete any existing content
- Pressing any printable key, such as <kbd class="key">a</kbd>, <kbd class="key">E</kbd>, <kbd class="key">0</kbd>, or <kbd class="key">$</kbd>
- Calling `apiRef.current.startCellEditMode` passing the row ID and column field of the cell to be edited

  ```tsx
  apiRef.current.startCellEditMode({ id: 1, field: 'name' });
  ```

- Calling `apiRef.current.startRowEditMode` passing the ID of the row (only available if `editMode="row"`).

  ```tsx
  apiRef.current.startRowEditMode({ id: 1 });
  ```

:::info
You can also enter edit mode with a single click by following [this recipe](/x/react-data-grid/recipes-editing/#single-click-editing).
:::

### Stop editing

When a cell is in `edit` mode, the user can stop editing with any of the following interactions:

- Pressing <kbd class="key">Escape</kbd>—this also reverts any changes made
- Pressing <kbd class="key">Tab</kbd>—this also saves any changes made
- Pressing <kbd class="key">Enter</kbd>—this also saves any changes made and moves the focus to the next cell in the same column
- Clicking outside the cell or row—this also saves any changes made
- Calling `apiRef.current.stopCellEditMode({ id, field })` passing the row ID and column field of the cell that's been edited

  ```tsx
  apiRef.current.stopCellEditMode({ id: 1, field: 'name' });

  // or

  apiRef.current.stopCellEditMode({
    id: 1,
    field: 'name',
    ignoreModifications: true, // will also discard the changes made
  });
  ```

- Calling `apiRef.current.stopRowEditMode` passing the ID of the row (only possible if `editMode="row"`).

  ```tsx
  apiRef.current.stopRowEditMode({ id: 1 });

  // or

  apiRef.current.stopRowEditMode({
    id: 1,
    ignoreModifications: true, // will also discard the changes made
  });
  ```

### Disable editing of specific cells within a row

The `editable` property controls which cells are editable at the column level.
You can use the `isCellEditable` callback prop to define which individual cells the user can edit in a given row.
It is called with a [`GridCellParams`](/x/api/data-grid/grid-cell-params/) object and must return `true` if the cell is editable, or `false` if not.

In the following demo, only the rows with an even `Age` value are editable.
The editable cells have a green background for better visibility.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

export default function IsCellEditableGrid() {
  return (
    <Box
      sx={(theme) => ({
        height: 400,
        width: '100%',
        '& .MuiDataGrid-cell--editable': {
          bgcolor: 'rgb(217 243 190)',
          ...theme.applyStyles('dark', {
            bgcolor: '#376331',
          }),
        },
      })}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        isCellEditable={(params) => params.row.age % 2 === 0}
      />
    </Box>
  );
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    editable: true,
    align: 'left',
    headerAlign: 'left',
  },
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
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];

```

## Value parser and value setter

You can use the `valueParser` property in the column definition to modify the value entered by the user—for example, to convert the value to a different format:

```tsx
const columns: GridColDef[] = [
  {
    valueParser: (value, row, column, apiRef) => {
      return value.toLowerCase();
    },
  },
];
```

You can use the `valueSetter` property of the column definition to customize how the row is updated with a new value.
This lets you insert a value from a nested object.
It is called with an object containing the new cell value to be saved as well as the row that the cell belongs to.
If you are already using a `valueGetter` to extract the value from a nested object, then the `valueSetter` is probably also necessary.

```tsx
const columns: GridColDef[] = [
  {
    valueSetter: (value, row) => {
      const [firstName, lastName] = value!.toString().split(' ');
      return { ...row, firstName, lastName };
    },
  },
];
```

In the following demo, both the `valueParser` and the `valueSetter` are defined for the **Full name** column.
The `valueParser` capitalizes the value entered, and the `valueSetter` splits the value and saves it correctly into the row model:

```tsx
import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridValueGetter,
  GridValueSetter,
  GridValueParser,
} from '@mui/x-data-grid';

type Row = (typeof defaultRows)[number];

const setFullName: GridValueSetter<Row> = (value, row) => {
  const [firstName, lastName] = value!.toString().split(' ');
  return { ...row, firstName, lastName };
};

const parseFullName: GridValueParser = (value) => {
  return String(value)
    .split(' ')
    .map((str) => (str.length > 0 ? str[0].toUpperCase() + str.slice(1) : ''))
    .join(' ');
};

export default function ValueParserSetterGrid() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={defaultRows} columns={columns} />
    </div>
  );
}

const defaultRows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon' },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei' },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime' },
  { id: 4, lastName: 'Stark', firstName: 'Arya' },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys' },
];

const getFullName: GridValueGetter<Row> = (value, row) => {
  return `${row.firstName || ''} ${row.lastName || ''}`;
};

const columns: GridColDef[] = [
  { field: 'firstName', headerName: 'First name', width: 130, editable: true },
  { field: 'lastName', headerName: 'Last name', width: 130, editable: true },
  {
    field: 'fullName',
    headerName: 'Full name',
    width: 160,
    editable: true,
    valueGetter: getFullName,
    valueSetter: setFullName,
    valueParser: parseFullName,
    sortComparator: (v1, v2) => v1!.toString().localeCompare(v2!.toString()),
  },
];

```

## Validation

If the column definition sets a callback for the `preProcessEditCellProps` property, then it will be called each time a new value is entered into a cell from this column.
This property lets you pre-process the props that are passed to the edit component.
The `preProcessEditCellProps` callback is called with an object containing the following attributes:

- `id`: the row ID
- `row`: the row model containing the value(s) of the cell or row before entering edit mode
- `props`: the props, containing the value after the value parser, that are passed to the edit component
- `hasChanged`: determines if `props.value` is different from the last time this callback was called

Data validation is one type of pre-processing that can be done in this way.
To validate the data entered, pass a callback to `preProcessEditCellProps` checking if `props.value` is valid.
If the new value is invalid, set `props.error` to a truthy value and return the modified props, as shown in the example below.
When the user tries to save the updated value, the change will be rejected if the error attribute is truthy (invalid).

```tsx
const columns: GridColDef[] = [
  {
    field: 'firstName',
    preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
      const hasError = params.props.value.length < 3;
      return { ...params.props, error: hasError };
    },
  },
];
```

:::warning
Changing `props.value` inside the callback has no effect. To pre-process it, use a [value parser](#value-parser-and-value-setter).
:::

The demo below contains an example of server-side data validation.
In this case, the callback returns a promise that resolves to the modified props.
Note that the value passed to `props.error` is passed directly to the edit component as the `error` prop.
While the promise is not resolved, the edit component will receive an `isProcessingProps` prop with value equal to `true`.

```tsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import {
  GridColDef,
  GridRowsProp,
  DataGrid,
  GridPreProcessEditCellProps,
  GridEditInputCell,
  GridRenderEditCellParams,
} from '@mui/x-data-grid';

const StyledBox = styled('div')(({ theme }) => ({
  height: 400,
  width: '100%',
  '& .MuiDataGrid-cell--editable': {
    backgroundColor: 'rgb(217 243 190)',
    '& .MuiInputBase-root': {
      height: '100%',
    },
    ...theme.applyStyles('dark', {
      backgroundColor: '#376331',
    }),
  },
  '& .Mui-error': {
    backgroundColor: 'rgb(126,10,15, 0.1)',
    color: '#750f0f',
    ...theme.applyStyles('dark', {
      backgroundColor: 'rgb(126,10,15, 0)',
      color: '#ff4343',
    }),
  },
}));

let promiseTimeout: ReturnType<typeof setTimeout>;
function validateName(username: string): Promise<boolean> {
  const existingUsers = rows.map((row) => row.name.toLowerCase());

  return new Promise<any>((resolve) => {
    promiseTimeout = setTimeout(
      () => {
        const exists = existingUsers.includes(username.toLowerCase());
        resolve(exists ? `${username} is already taken.` : null);
      },
      Math.random() * 500 + 100,
    ); // simulate network latency
  });
}

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

function NameEditInputCell(props: GridRenderEditCellParams) {
  const { error } = props;

  return (
    <StyledTooltip open={!!error} title={error}>
      <GridEditInputCell {...props} />
    </StyledTooltip>
  );
}

function renderEditName(params: GridRenderEditCellParams) {
  return <NameEditInputCell {...params} />;
}

export default function ValidateServerNameGrid() {
  const preProcessEditCellProps = async (params: GridPreProcessEditCellProps) => {
    const errorMessage = await validateName(params.props.value!.toString());
    return { ...params.props, error: errorMessage };
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'MUI Contributor',
      width: 180,
      editable: true,
      preProcessEditCellProps,
      renderEditCell: renderEditName,
    },
  ];

  React.useEffect(() => {
    return () => {
      clearTimeout(promiseTimeout);
    };
  }, []);

  return (
    <StyledBox>
      <DataGrid
        rows={rows}
        columns={columns}
        isCellEditable={(params) => params.row.id === 5}
      />
    </StyledBox>
  );
}

const rows: GridRowsProp = [
  {
    id: 1,
    name: 'Damien',
  },
  {
    id: 2,
    name: 'Olivier',
  },
  {
    id: 3,
    name: 'Danail',
  },
  {
    id: 4,
    name: 'Matheus',
  },
  {
    id: 5,
    name: 'You?',
  },
];

```

## Controlled model

You can control the active mode using the props `cellModesModel` and `rowModesModel` (only works if `editMode="row"`).

The `cellModesModel` prop accepts an object containing the `mode` (and additional options) for a given column field, in a given row, as in the following example.
The options accepted are the same available in [`apiRef.current.startCellEditMode()`](#start-editing) and [`apiRef.current.stopCellEditMode()`](#stop-editing).

```tsx
// Changes the mode of field=name from row with id=1 to "edit"
<DataGrid
  cellModesModel={{ 1: { name: { mode: GridCellModes.Edit } } }}
/>

// Changes the mode of field=name from row with id=1 to "view", ignoring modifications made
<DataGrid
  cellModesModel={{ 1: { name: { mode: GridCellModes.View, ignoreModifications: true } } }}
/>
```

For row editing, the `rowModesModel` props work in a similar manner.
The options accepted are the same available in [`apiRef.current.startRowEditMode()`](#start-editing) and [`apiRef.current.stopRowEditMode()`](#stop-editing).

```tsx
// Changes the mode of the row with id=1 to "edit"
<DataGrid
  editMode="row"
  rowModesModel={{ 1: { mode: GridRowModes.Edit } }}
/>

// Changes the mode of the row with id=1 to "view", ignoring modifications made
<DataGrid
  editMode="row"
  rowModesModel={{ 1: { mode: GridRowModes.View, ignoreModifications: true } }}
/>
```

Additionally, the callback props `onCellModesModelChange()` and `onRowModesModelChange()` (only works if `editMode="row"`) are available.
Use them to update the respective prop.

In the demo below, `cellModesModel` is used to control the mode of selected cell using the external buttons.
For an example using row editing check the [full-featured CRUD component](#full-featured-crud-component).

```tsx
import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import {
  GridColDef,
  GridRowsProp,
  DataGrid,
  GridRowId,
  GridCellModes,
  GridEventListener,
  GridCellModesModel,
  GridSlotProps,
  Toolbar,
  ToolbarButton,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

interface SelectedCellParams {
  id: GridRowId;
  field: string;
}

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    selectedCellParams: SelectedCellParams | null;
    cellModesModel: GridCellModesModel;
    setCellModesModel: (value: GridCellModesModel) => void;
    cellMode: 'view' | 'edit';
  }
}

function EditToolbar(props: GridSlotProps['toolbar']) {
  const { selectedCellParams, cellMode, cellModesModel, setCellModesModel } = props;

  const handleSaveOrEdit = () => {
    if (!selectedCellParams) {
      return;
    }
    const { id, field } = selectedCellParams;
    if (cellMode === 'edit') {
      setCellModesModel({
        ...cellModesModel,
        [id]: { ...cellModesModel[id], [field]: { mode: GridCellModes.View } },
      });
    } else {
      setCellModesModel({
        ...cellModesModel,
        [id]: { ...cellModesModel[id], [field]: { mode: GridCellModes.Edit } },
      });
    }
  };

  const handleCancel = () => {
    if (!selectedCellParams) {
      return;
    }
    const { id, field } = selectedCellParams;
    setCellModesModel({
      ...cellModesModel,
      [id]: {
        ...cellModesModel[id],
        [field]: { mode: GridCellModes.View, ignoreModifications: true },
      },
    });
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    // Keep the focus in the cell
    event.preventDefault();
  };

  return (
    <Toolbar>
      <Tooltip title={cellMode === 'edit' ? 'Save' : 'Edit'}>
        <ToolbarButton onClick={handleSaveOrEdit}>
          {cellMode === 'edit' ? (
            <SaveIcon fontSize="small" />
          ) : (
            <EditIcon fontSize="small" />
          )}
        </ToolbarButton>
      </Tooltip>
      {cellMode === 'edit' && (
        <Tooltip title="Cancel">
          <ToolbarButton onClick={handleCancel} onPointerDown={handlePointerDown}>
            <CancelIcon fontSize="small" />
          </ToolbarButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export default function StartEditButtonGrid() {
  const [selectedCellParams, setSelectedCellParams] =
    React.useState<SelectedCellParams | null>(null);
  const [cellModesModel, setCellModesModel] = React.useState<GridCellModesModel>({});

  const handleCellFocus = React.useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const row = event.currentTarget.parentElement;
      const id = row!.dataset.id!;
      const field = event.currentTarget.dataset.field!;
      setSelectedCellParams({ id, field });
    },
    [],
  );

  const cellMode = React.useMemo(() => {
    if (!selectedCellParams) {
      return 'view';
    }
    const { id, field } = selectedCellParams;
    return cellModesModel[id]?.[field]?.mode || 'view';
  }, [cellModesModel, selectedCellParams]);

  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      if (cellMode === 'edit') {
        // Prevents calling event.preventDefault() if Tab is pressed on a cell in edit mode
        event.defaultMuiPrevented = true;
      }
    },
    [cellMode],
  );

  const handleCellEditStop = React.useCallback<GridEventListener<'cellEditStop'>>(
    (params, event) => {
      event.defaultMuiPrevented = true;
    },
    [],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        onCellKeyDown={handleCellKeyDown}
        cellModesModel={cellModesModel}
        onCellEditStop={handleCellEditStop}
        onCellModesModelChange={(model) => setCellModesModel(model)}
        slots={{ toolbar: EditToolbar }}
        showToolbar
        slotProps={{
          toolbar: {
            cellMode,
            selectedCellParams,
            cellModesModel,
            setCellModesModel,
          },
          cell: {
            onFocus: handleCellFocus,
          },
        }}
      />
    </div>
  );
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    editable: true,
    align: 'left',
    headerAlign: 'left',
  },
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
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];

```

:::warning
The options passed to both model props only take effect when `mode` changes.
Updating the params of a cell or row, but keeping the same `mode`, makes the cell or row to stay in the same mode.
Also, removing one field or row ID from the object will not cause the missing cell or row to go to `"view"` mode.
:::

## apiRef

The Data Grid exposes a set of methods via the `apiRef` object that are used internally in the implementation of the editing feature.
The reference below describes the relevant functions.
See [API object](/x/react-data-grid/api-object/) for more details.

:::warning
This API should only be used as a last resort when the Data Grid's built-in props aren't sufficient for your specific use case.
:::

```jsx
import * as React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/x/api/data-grid/grid-editing-api.json';

export default function EditApiNoSnap() {
  return <ApiDocs api={api} />;
}

```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
