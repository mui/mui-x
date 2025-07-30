# Data Grid - Editing recipes

Advanced grid customization recipes.

## Multiline editing

You can have columns with multiline text and edit them by creating a custom edit component.

In the demo below, the **Bio** column is composed of multiple lines.
To persist the changes, use <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Enter</kbd></kbd> (or <kbd><kbd class="key">⌘ Command</kbd>+<kbd class="key">Enter</kbd></kbd> on macOS).

```tsx
import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRenderEditCellParams,
  useGridApiContext,
  GridColTypeDef,
  GridCellEditStopReasons,
} from '@mui/x-data-grid';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import {
  randomInt,
  randomUserName,
  randomArrayItem,
} from '@mui/x-data-grid-generator';

const lines = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Aliquam dapibus, lorem vel mattis aliquet, purus lorem tincidunt mauris, in blandit quam risus sed ipsum.',
  'Maecenas non felis venenatis, porta velit quis, consectetur elit.',
  'Vestibulum commodo et odio a laoreet.',
  'Nullam cursus tincidunt auctor.',
  'Sed feugiat venenatis nulla, sit amet dictum nulla convallis sit amet.',
  'Nulla venenatis justo non felis vulputate, eu mollis metus ornare.',
  'Nam ullamcorper ligula id consectetur auctor.',
  'Phasellus et ultrices dui.',
  'Fusce facilisis egestas massa, et eleifend magna imperdiet et.',
  'Pellentesque ac metus velit.',
  'Vestibulum in massa nibh.',
  'Vestibulum pulvinar aliquam turpis, ac faucibus risus varius a.',
];

function isKeyboardEvent(event: any): event is React.KeyboardEvent {
  return !!event.key;
}

function EditTextarea(props: GridRenderEditCellParams<any, string>) {
  const { id, field, value, colDef, hasFocus } = props;
  const [valueState, setValueState] = React.useState(value);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>();
  const [inputRef, setInputRef] = React.useState<HTMLInputElement | null>(null);
  const apiRef = useGridApiContext();

  React.useLayoutEffect(() => {
    if (hasFocus && inputRef) {
      inputRef.focus();
    }
  }, [hasFocus, inputRef]);

  const handleRef = React.useCallback((el: HTMLElement | null) => {
    setAnchorEl(el);
  }, []);

  const handleChange = React.useCallback<NonNullable<InputBaseProps['onChange']>>(
    (event) => {
      const newValue = event.target.value;
      setValueState(newValue);
      apiRef.current.setEditCellValue(
        { id, field, value: newValue, debounceMs: 200 },
        event,
      );
    },
    [apiRef, field, id],
  );

  return (
    <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
      <div
        ref={handleRef}
        style={{
          height: 1,
          width: colDef.computedWidth,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      {anchorEl && (
        <Popper open anchorEl={anchorEl} placement="bottom-start">
          <Paper elevation={1} sx={{ p: 1, minWidth: colDef.computedWidth }}>
            <InputBase
              multiline
              rows={4}
              value={valueState}
              sx={{ textarea: { resize: 'both' }, width: '100%' }}
              onChange={handleChange}
              inputRef={(ref) => setInputRef(ref)}
            />
          </Paper>
        </Popper>
      )}
    </div>
  );
}

const multilineColumn: GridColTypeDef = {
  type: 'string',
  renderEditCell: (params) => <EditTextarea {...params} />,
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'username', headerName: 'Name', width: 150 },
  { field: 'age', headerName: 'Age', width: 80, type: 'number' },
  {
    field: 'bio',
    headerName: 'Bio',
    width: 400,
    editable: true,
    ...multilineColumn,
  },
];

const rows: GridRowModel[] = [];

for (let i = 0; i < 50; i += 1) {
  const bio = [];

  for (let j = 0; j < randomInt(1, 7); j += 1) {
    bio.push(randomArrayItem(lines));
  }

  rows.push({
    id: i,
    username: randomUserName(),
    age: randomInt(10, 80),
    bio: bio.join(' '),
  });
}

export default function MultilineEditing() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        onCellEditStop={(params, event) => {
          if (params.reason !== GridCellEditStopReasons.enterKeyDown) {
            return;
          }
          if (isKeyboardEvent(event) && !event.ctrlKey && !event.metaKey) {
            event.defaultMuiPrevented = true;
          }
        }}
      />
    </div>
  );
}

```

## Conditional validation

When all cells in a row are in edit mode, you can validate fields by comparing their values against one another.
To do this, start by adding the `preProcessEditCellProps` as explained in the [validation](/x/react-data-grid/editing/#validation) section.
When the callback is called, it will have an additional `otherFieldsProps` param containing the props from the other fields in the same row.
Use this param to check if the value from the current column is valid or not.
Return the modified `props` containing the error as you would for cell editing.
Once at the least one field has the `error` attribute set to a truthy value, the row will not exit edit mode.

The following demo requires a value for the **Payment method** column only if the **Is paid?** column is checked:

```tsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { randomPrice } from '@mui/x-data-grid-generator';

const StyledBox = styled('div')(({ theme }) => ({
  height: 300,
  width: '100%',
  '& .MuiDataGrid-cell--editing': {
    backgroundColor: 'rgb(255,215,115, 0.19)',
    color: '#1a3e72',
    '& .MuiInputBase-root': {
      height: '100%',
    },
  },
  '& .Mui-error': {
    backgroundColor: 'rgb(126,10,15, 0.1)',
    color: theme.palette.error.main,
    ...theme.applyStyles('dark', {
      backgroundColor: 'rgb(126,10,15, 0)',
    }),
  },
}));

const rows: GridRowsProp = [
  {
    id: 1,
    expense: 'Light bill',
    price: randomPrice(0, 1000),
    dueAt: new Date(2021, 6, 8),
    isPaid: false,
    paymentMethod: '',
  },
  {
    id: 2,
    expense: 'Rent',
    price: randomPrice(0, 1000),
    dueAt: new Date(2021, 7, 1),
    isPaid: false,
    paymentMethod: '',
  },
  {
    id: 3,
    expense: 'Car insurance',
    price: randomPrice(0, 1000),
    dueAt: new Date(2021, 7, 4),
    isPaid: true,
    paymentMethod: 'Wire transfer',
  },
];

export default function ConditionalValidationGrid() {
  const columns: GridColDef[] = [
    { field: 'expense', headerName: 'Expense', width: 160, editable: true },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      width: 120,
      editable: true,
    },
    {
      field: 'dueAt',
      headerName: 'Due at',
      type: 'date',
      width: 120,
      editable: true,
    },
    {
      field: 'isPaid',
      headerName: 'Is paid?',
      type: 'boolean',
      width: 140,
      editable: true,
    },
    {
      field: 'paymentMethod',
      headerName: 'Payment method',
      type: 'singleSelect',
      valueOptions: ['Credit card', 'Wire transfer', 'Cash'],
      width: 160,
      editable: true,
      preProcessEditCellProps: (params) => {
        const isPaidProps = params.otherFieldsProps!.isPaid;
        const hasError = isPaidProps.value && !params.props.value;
        return { ...params.props, error: hasError };
      },
    },
  ];

  return (
    <StyledBox>
      <DataGrid rows={rows} columns={columns} editMode="row" />
    </StyledBox>
  );
}

```

## Linked fields

The options available for one field may depend on the value of another field.
For instance, if the `singleSelect` column is used, you can provide a function to `valueOptions` returning the relevant options for the value selected in another field, as exemplified below.

```tsx
const columns: GridColDef[] = [
  {
    field: 'account',
    type: 'singleSelect',
    valueOptions: ({ row }) => {
      if (!row) {
        // The row is not available when filtering this column
        return ['Sales', 'Investments', 'Ads', 'Taxes', 'Payroll', 'Utilities'];
      }

      return row.type === 'Income' // Gets the value of the "type" field
        ? ['Sales', 'Investments', 'Ads']
        : ['Taxes', 'Payroll', 'Utilities'];
    },
  },
];
```

The code above is already enough to display different options in the **Account** column based on the value selected in the **Type** column.
The only task left is to reset the account once the type is changed.
This is needed because the previously selected account will not exist now in the options.
To solve that, you can create a custom edit component, reusing the built-in one, and pass a function to the `onValueChange` prop.
This function should call `apiRef.current.setEditCellValue()` to reset the value of the other field.

```tsx
const CustomTypeEditComponent = (props: GridEditSingleSelectCellProps) => {
  const apiRef = useGridApiContext();

  const handleValueChange = async () => {
    await apiRef.current.setEditCellValue({
      id: props.id,
      field: 'account',
      value: '',
    });
  };

  return <GridEditSingleSelectCell onValueChange={handleValueChange} {...props} />;
};
```

The demo below combines the steps showed above.
You can experiment it by changing the value of any cell in the **Type** column.
The **Account** column is automatically updated with the correct options.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridEditSingleSelectCell,
  GridEditSingleSelectCellProps,
  useGridApiContext,
} from '@mui/x-data-grid';
import { randomPrice } from '@mui/x-data-grid-generator';

const rows: GridRowsProp = [
  {
    id: 1,
    description: 'Light bill',
    value: randomPrice(0, 1000),
    type: 'Expense',
    account: 'Utilities',
  },
  {
    id: 3,
    description: 'Order #5',
    value: randomPrice(0, 1000),
    type: 'Income',
    account: 'Sales',
  },
  {
    id: 4,
    description: 'Google AdSense',
    value: randomPrice(0, 1000),
    type: 'Income',
    account: 'Ads',
  },
];

function CustomTypeEditComponent(props: GridEditSingleSelectCellProps) {
  const apiRef = useGridApiContext();

  const handleValueChange = async () => {
    await apiRef.current.setEditCellValue({
      id: props.id,
      field: 'account',
      value: '',
    });
  };

  return <GridEditSingleSelectCell onValueChange={handleValueChange} {...props} />;
}

export default function LinkedFieldsRowEditing() {
  const columns: GridColDef[] = [
    { field: 'description', headerName: 'Description', width: 160, editable: true },
    {
      field: 'value',
      headerName: 'Value',
      type: 'number',
      width: 120,
      editable: true,
    },
    {
      field: 'type',
      headerName: 'Type',
      type: 'singleSelect',
      valueOptions: ['Income', 'Expense'],
      width: 120,
      editable: true,
      renderEditCell: (params) => <CustomTypeEditComponent {...params} />,
    },
    {
      field: 'account',
      headerName: 'Account',
      type: 'singleSelect',
      valueOptions: ({ row }) => {
        if (!row) {
          return [
            'Sales',
            'Investments',
            'Ads',
            'Taxes',
            'Payroll',
            'Utilities',
            'Marketing',
          ];
        }

        return row.type === 'Income'
          ? ['Sales', 'Investments', 'Ads']
          : ['Taxes', 'Payroll', 'Utilities', 'Marketing'];
      },
      width: 140,
      editable: true,
    },
  ];

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <DataGrid rows={rows} columns={columns} editMode="row" />
    </Box>
  );
}

```

:::warning
The call to `apiRef.current.setEditCellValue()` returns a promise that must be awaited.
For instance, if the `singleSelect` column type is used, not awaiting will cause the other column to be rendered with a `value` that is not in the options.

```ts
const handleChange = async () => {
  await apiRef.current.setEditCellValue({
    id: props.id,
    field: 'account',
    value: '',
  });
};
```

:::

A similar behavior can be reproduced with cell editing.
Instead of `apiRef.current.setEditCellValue()`, the `rows` prop must be updated or `apiRef.current.updateRows()` be used.
Note that the `onCellEditStart` and `onCellEditStop` props also have to be used to revert the value of the cell changed, in case the user cancels the edit.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  DataGridProps,
  GridRowModel,
  GridColDef,
  GridRowsProp,
  GridEditSingleSelectCell,
  GridEditSingleSelectCellProps,
  GridCellEditStopReasons,
} from '@mui/x-data-grid';
import { randomPrice } from '@mui/x-data-grid-generator';

const initialRows: GridRowsProp = [
  {
    id: 1,
    description: 'Light bill',
    value: randomPrice(0, 1000),
    type: 'Expense',
    account: 'Utilities',
  },
  {
    id: 3,
    description: 'Order #5',
    value: randomPrice(0, 1000),
    type: 'Income',
    account: 'Sales',
  },
  {
    id: 4,
    description: 'Google AdSense',
    value: randomPrice(0, 1000),
    type: 'Income',
    account: 'Ads',
  },
];

interface CustomTypeEditComponentProps extends GridEditSingleSelectCellProps {
  setRows: React.Dispatch<React.SetStateAction<readonly any[]>>;
}

function CustomTypeEditComponent(props: CustomTypeEditComponentProps) {
  const { setRows, ...other } = props;

  const handleValueChange = () => {
    setRows((prevRows) => {
      console.log(prevRows);
      return prevRows.map((row) =>
        row.id === props.id ? { ...row, account: null } : row,
      );
    });
  };

  return <GridEditSingleSelectCell onValueChange={handleValueChange} {...other} />;
}

export default function LinkedFieldsCellEditing() {
  const editingRow = React.useRef<GridRowModel | null>(null);
  const [rows, setRows] = React.useState(initialRows);

  const columns: GridColDef[] = [
    { field: 'description', headerName: 'Description', width: 160, editable: true },
    {
      field: 'value',
      headerName: 'Value',
      type: 'number',
      width: 120,
      editable: true,
    },
    {
      field: 'type',
      headerName: 'Type',
      type: 'singleSelect',
      valueOptions: ['Income', 'Expense'],
      width: 120,
      editable: true,
      renderEditCell: (params) => (
        <CustomTypeEditComponent setRows={setRows} {...params} />
      ),
    },
    {
      field: 'account',
      headerName: 'Account',
      type: 'singleSelect',
      valueOptions: ({ row }) => {
        if (!row) {
          return [
            'Sales',
            'Investments',
            'Ads',
            'Taxes',
            'Payroll',
            'Utilities',
            'Marketing',
          ];
        }

        return row.type === 'Income'
          ? ['Sales', 'Investments', 'Ads']
          : ['Taxes', 'Payroll', 'Utilities', 'Marketing'];
      },
      width: 140,
      editable: true,
    },
  ];

  const handleCellEditStart: DataGridProps['onCellEditStart'] = (params) => {
    editingRow.current = rows.find((row) => row.id === params.id) || null;
  };

  const handleCellEditStop: DataGridProps['onCellEditStop'] = (params) => {
    if (params.reason === GridCellEditStopReasons.escapeKeyDown) {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === editingRow.current?.id
            ? { ...row, account: editingRow.current?.account }
            : row,
        ),
      );
    }
  };

  const processRowUpdate: DataGridProps['processRowUpdate'] = (newRow) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === editingRow.current?.id ? newRow : row)),
    );
    return newRow;
  };

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        onCellEditStart={handleCellEditStart}
        onCellEditStop={handleCellEditStop}
        processRowUpdate={processRowUpdate}
      />
    </Box>
  );
}

```

## Single click editing

By default, one of the ways to [enter the edit mode](/x/react-data-grid/editing/#start-editing) is by double-clicking a cell.
Using the [controlled mode](/x/react-data-grid/editing/#controlled-model) and listening to click events, you can also enter the edit mode with just a single click.
The following demo implements this behavior.

```tsx
import * as React from 'react';
import {
  DataGrid,
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridRowsProp,
  GridColDef,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 180, editable: true },
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

export default function SingleClickEditing() {
  const [cellModesModel, setCellModesModel] = React.useState<GridCellModesModel>({});

  const handleCellClick = React.useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      if (!params.isEditable) {
        return;
      }

      // Ignore portal
      if (
        (event.target as any).nodeType === 1 &&
        !event.currentTarget.contains(event.target as Element)
      ) {
        return;
      }

      setCellModesModel((prevModel) => {
        return {
          // Revert the mode of the other cells from other rows
          ...Object.keys(prevModel).reduce(
            (acc, id) => ({
              ...acc,
              [id]: Object.keys(prevModel[id]).reduce(
                (acc2, field) => ({
                  ...acc2,
                  [field]: { mode: GridCellModes.View },
                }),
                {},
              ),
            }),
            {},
          ),
          [params.id]: {
            // Revert the mode of other cells in the same row
            ...Object.keys(prevModel[params.id] || {}).reduce(
              (acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }),
              {},
            ),
            [params.field]: { mode: GridCellModes.Edit },
          },
        };
      });
    },
    [],
  );

  const handleCellModesModelChange = React.useCallback(
    (newModel: GridCellModesModel) => {
      setCellModesModel(newModel);
    },
    [],
  );

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        cellModesModel={cellModesModel}
        onCellModesModelChange={handleCellModesModelChange}
        onCellClick={handleCellClick}
      />
    </div>
  );
}

```

## Bulk editing

The Data Grid [Editing](/x/react-data-grid/editing/) API exposes [the `processRowUpdate` callback](/x/react-data-grid/editing/persistence/#the-processrowupdate-callback) which is commonly used to persist edits on per-row basis.
You can utilize this callback to batch edits locally and then choose to either persist or discard them in bulk.

The demo below stores edited and deleted rows in the `unsavedChangesRef`.
These changes are saved or discarded when the user clicks the **Save** or **Discard** buttons respectively.

```tsx
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import {
  DataGrid,
  GridRowId,
  GridValidRowModel,
  DataGridProps,
  useGridApiRef,
  GridActionsCellItem,
  GridColDef,
  gridClasses,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { darken } from '@mui/material/styles';

const visibleFields = [
  'id',
  'commodity',
  'traderName',
  'traderEmail',
  'quantity',
  'filledQuantity',
];

export default function BulkEditing() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 7,
    editable: true,
    visibleFields,
  });

  const apiRef = useGridApiRef();

  const [hasUnsavedRows, setHasUnsavedRows] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const unsavedChangesRef = React.useRef<{
    unsavedRows: Record<GridRowId, GridValidRowModel>;
    rowsBeforeChange: Record<GridRowId, GridValidRowModel>;
  }>({
    unsavedRows: {},
    rowsBeforeChange: {},
  });

  const columns = React.useMemo<GridColDef[]>(() => {
    return [
      {
        field: 'actions',
        type: 'actions',
        getActions: ({ id, row }) => {
          return [
            <GridActionsCellItem
              icon={<RestoreIcon />}
              label="Discard changes"
              disabled={unsavedChangesRef.current.unsavedRows[id] === undefined}
              onClick={() => {
                apiRef.current?.updateRows([
                  unsavedChangesRef.current.rowsBeforeChange[id],
                ]);
                delete unsavedChangesRef.current.rowsBeforeChange[id];
                delete unsavedChangesRef.current.unsavedRows[id];
                setHasUnsavedRows(
                  Object.keys(unsavedChangesRef.current.unsavedRows).length > 0,
                );
              }}
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => {
                unsavedChangesRef.current.unsavedRows[id] = {
                  ...row,
                  _action: 'delete',
                };
                if (!unsavedChangesRef.current.rowsBeforeChange[id]) {
                  unsavedChangesRef.current.rowsBeforeChange[id] = row;
                }
                setHasUnsavedRows(true);
                apiRef.current?.updateRows([row]); // to trigger row render
              }}
            />,
          ];
        },
      },
      ...data.columns,
    ];
  }, [data.columns, unsavedChangesRef, apiRef]);

  const processRowUpdate = React.useCallback<
    NonNullable<DataGridProps['processRowUpdate']>
  >((newRow, oldRow) => {
    const rowId = newRow.id;

    unsavedChangesRef.current.unsavedRows[rowId] = newRow;
    if (!unsavedChangesRef.current.rowsBeforeChange[rowId]) {
      unsavedChangesRef.current.rowsBeforeChange[rowId] = oldRow;
    }
    setHasUnsavedRows(true);
    return newRow;
  }, []);

  const discardChanges = React.useCallback(() => {
    setHasUnsavedRows(false);
    Object.values(unsavedChangesRef.current.rowsBeforeChange).forEach((row) => {
      apiRef.current?.updateRows([row]);
    });
    unsavedChangesRef.current = {
      unsavedRows: {},
      rowsBeforeChange: {},
    };
  }, [apiRef]);

  const saveChanges = React.useCallback(async () => {
    try {
      // Persist updates in the database
      setIsSaving(true);
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      setIsSaving(false);
      const rowsToDelete = Object.values(
        unsavedChangesRef.current.unsavedRows,
      ).filter((row) => row._action === 'delete');
      if (rowsToDelete.length > 0) {
        rowsToDelete.forEach((row) => {
          apiRef.current?.updateRows([row]);
        });
      }

      setHasUnsavedRows(false);
      unsavedChangesRef.current = {
        unsavedRows: {},
        rowsBeforeChange: {},
      };
    } catch (error) {
      setIsSaving(false);
    }
  }, [apiRef]);

  const getRowClassName = React.useCallback<
    NonNullable<DataGridProps['getRowClassName']>
  >(({ id }) => {
    const unsavedRow = unsavedChangesRef.current.unsavedRows[id];
    if (unsavedRow) {
      if (unsavedRow._action === 'delete') {
        return 'row--removed';
      }
      return 'row--edited';
    }
    return '';
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: 8 }}>
        <LoadingButton
          disabled={!hasUnsavedRows}
          loading={isSaving}
          onClick={saveChanges}
          startIcon={<SaveIcon />}
          loadingPosition="start"
        >
          <span>Save</span>
        </LoadingButton>
        <Button
          disabled={!hasUnsavedRows || isSaving}
          onClick={discardChanges}
          startIcon={<RestoreIcon />}
        >
          Discard all changes
        </Button>
      </div>
      <div style={{ height: 400 }}>
        <DataGrid
          {...data}
          columns={columns}
          apiRef={apiRef}
          disableRowSelectionOnClick
          processRowUpdate={processRowUpdate}
          ignoreValueFormatterDuringExport
          sx={{
            [`& .${gridClasses.row}.row--removed`]: {
              backgroundColor: (theme) => {
                if (theme.palette.mode === 'light') {
                  return 'rgba(255, 170, 170, 0.3)';
                }
                return darken('rgba(255, 170, 170, 1)', 0.7);
              },
            },
            [`& .${gridClasses.row}.row--edited`]: {
              backgroundColor: (theme) => {
                if (theme.palette.mode === 'light') {
                  return 'rgba(255, 254, 176, 0.3)';
                }
                return darken('rgba(255, 254, 176, 1)', 0.6);
              },
            },
          }}
          loading={isSaving}
          getRowClassName={getRowClassName}
        />
      </div>
    </div>
  );
}

```

### With commercial features [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

When using [Data Grid Premium](/x/react-data-grid/#premium-version), bulk editing applies to row updates from [Clipboard paste](/x/react-data-grid/clipboard/#clipboard-paste) automatically, since [Clipboard paste uses Editing API for persistence](/x/react-data-grid/clipboard/#persisting-pasted-data):

```tsx
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import {
  DataGridPremium,
  GridRowId,
  GridValidRowModel,
  DataGridPremiumProps,
  useGridApiRef,
  GridActionsCellItem,
  GridColDef,
  gridClasses,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { darken } from '@mui/material/styles';

const visibleFields = [
  'id',
  'commodity',
  'traderName',
  'traderEmail',
  'quantity',
  'filledQuantity',
];

export default function BulkEditingPremiumNoSnap() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 7,
    editable: true,
    visibleFields,
  });

  const apiRef = useGridApiRef();

  const [hasUnsavedRows, setHasUnsavedRows] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const unsavedChangesRef = React.useRef<{
    unsavedRows: Record<GridRowId, GridValidRowModel>;
    rowsBeforeChange: Record<GridRowId, GridValidRowModel>;
  }>({
    unsavedRows: {},
    rowsBeforeChange: {},
  });

  const columns = React.useMemo<GridColDef[]>(() => {
    return [
      {
        field: 'actions',
        type: 'actions',
        getActions: ({ id, row }) => {
          return [
            <GridActionsCellItem
              icon={<RestoreIcon />}
              label="Discard changes"
              disabled={unsavedChangesRef.current.unsavedRows[id] === undefined}
              onClick={() => {
                apiRef.current?.updateRows([
                  unsavedChangesRef.current.rowsBeforeChange[id],
                ]);
                delete unsavedChangesRef.current.rowsBeforeChange[id];
                delete unsavedChangesRef.current.unsavedRows[id];
                setHasUnsavedRows(
                  Object.keys(unsavedChangesRef.current.unsavedRows).length > 0,
                );
              }}
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => {
                unsavedChangesRef.current.unsavedRows[id] = {
                  ...row,
                  _action: 'delete',
                };
                if (!unsavedChangesRef.current.rowsBeforeChange[id]) {
                  unsavedChangesRef.current.rowsBeforeChange[id] = row;
                }
                setHasUnsavedRows(true);
                apiRef.current?.updateRows([row]); // to trigger row render
              }}
            />,
          ];
        },
      },
      ...data.columns,
    ];
  }, [data.columns, unsavedChangesRef, apiRef]);

  const processRowUpdate = React.useCallback<
    NonNullable<DataGridPremiumProps['processRowUpdate']>
  >((newRow, oldRow) => {
    const rowId = newRow.id;

    unsavedChangesRef.current.unsavedRows[rowId] = newRow;
    if (!unsavedChangesRef.current.rowsBeforeChange[rowId]) {
      unsavedChangesRef.current.rowsBeforeChange[rowId] = oldRow;
    }
    setHasUnsavedRows(true);
    return newRow;
  }, []);

  const discardChanges = React.useCallback(() => {
    setHasUnsavedRows(false);
    apiRef.current?.updateRows(
      Object.values(unsavedChangesRef.current.rowsBeforeChange),
    );
    unsavedChangesRef.current = {
      unsavedRows: {},
      rowsBeforeChange: {},
    };
  }, [apiRef]);

  const saveChanges = React.useCallback(async () => {
    try {
      // Persist updates in the database
      setIsSaving(true);
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      setIsSaving(false);
      const rowsToDelete = Object.values(
        unsavedChangesRef.current.unsavedRows,
      ).filter((row) => row._action === 'delete');
      if (rowsToDelete.length > 0) {
        apiRef.current?.updateRows(rowsToDelete);
      }

      setHasUnsavedRows(false);
      unsavedChangesRef.current = {
        unsavedRows: {},
        rowsBeforeChange: {},
      };
    } catch (error) {
      setIsSaving(false);
    }
  }, [apiRef]);

  const getRowClassName = React.useCallback<
    NonNullable<DataGridPremiumProps['getRowClassName']>
  >(({ id }) => {
    const unsavedRow = unsavedChangesRef.current.unsavedRows[id];
    if (unsavedRow) {
      if (unsavedRow._action === 'delete') {
        return 'row--removed';
      }
      return 'row--edited';
    }
    return '';
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: 8 }}>
        <LoadingButton
          disabled={!hasUnsavedRows}
          loading={isSaving}
          onClick={saveChanges}
          startIcon={<SaveIcon />}
          loadingPosition="start"
        >
          <span>Save</span>
        </LoadingButton>
        <Button
          disabled={!hasUnsavedRows || isSaving}
          onClick={discardChanges}
          startIcon={<RestoreIcon />}
        >
          Discard all changes
        </Button>
      </div>
      <div style={{ height: 400 }}>
        <DataGridPremium
          {...data}
          columns={columns}
          apiRef={apiRef}
          disableRowSelectionOnClick
          cellSelection
          processRowUpdate={processRowUpdate}
          ignoreValueFormatterDuringExport
          sx={{
            [`& .${gridClasses.row}.row--removed`]: {
              backgroundColor: (theme) => {
                if (theme.palette.mode === 'light') {
                  return 'rgba(255, 170, 170, 0.3)';
                }
                return darken('rgba(255, 170, 170, 1)', 0.7);
              },
            },
            [`& .${gridClasses.row}.row--edited`]: {
              backgroundColor: (theme) => {
                if (theme.palette.mode === 'light') {
                  return 'rgba(255, 254, 176, 0.3)';
                }
                return darken('rgba(255, 254, 176, 1)', 0.6);
              },
            },
          }}
          loading={isSaving}
          getRowClassName={getRowClassName}
        />
      </div>
    </div>
  );
}

```
