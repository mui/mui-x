# Data Grid - Row selection

Row selection allows the user to select and highlight a single or multiple rows that they can then take action on.

## Single row selection

Single row selection comes enabled by default for the MIT Data Grid component.
You can select a row by clicking it, or using the [keyboard shortcuts](/x/react-data-grid/accessibility/#selection).
To unselect a row, hold the <kbd class="key">Ctrl</kbd> (<kbd class="key">Cmd</kbd> on MacOS) key and click on it.

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function SingleRowSelectionGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} />
    </div>
  );
}

```

## Multiple row selection [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

On the Data Grid Pro and Data Grid Premium components, you can select multiple rows in two ways:

- To select multiple independent rows, hold the <kbd class="key">Ctrl</kbd> (<kbd class="key">Cmd</kbd> on MacOS) key while selecting rows.
- To select a range of rows, hold the <kbd class="key">Shift</kbd> key while selecting rows.
- To disable multiple row selection, use `disableMultipleRowSelection={true}`.

```tsx
import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function MultipleRowSelectionGrid() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        pagination
        initialState={{
          ...data.initialState,
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
      />
    </div>
  );
}

```

## Disable row selection on click

You might have interactive content in the cells and need to disable the selection of the row on click. Use the `disableRowSelectionOnClick` prop in this case.

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function DisableClickSelectionGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid checkboxSelection disableRowSelectionOnClick {...data} />
    </div>
  );
}

```

## Disable selection on certain rows

Use the `isRowSelectable` prop to indicate if a row can be selected.
It's called with a `GridRowParams` object and should return a boolean value.
If not specified, all rows are selectable.

In the demo below only rows with quantity above 50,000 can be selected:

```tsx
import * as React from 'react';
import { DataGrid, GridRowParams } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function DisableRowSelection() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        isRowSelectable={(params: GridRowParams) => params.row.quantity > 50000}
        checkboxSelection
      />
    </div>
  );
}

```

## Row selection with filtering

By default, when the rows are filtered the selection is cleared from the rows that don't meet the filter criteria.
To keep those rows selected even when they're not visible, set the `keepNonExistentRowsSelected` prop.

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function KeepNonExistentRowsSelected() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        checkboxSelection
        disableRowSelectionOnClick
        keepNonExistentRowsSelected
        showToolbar
      />
    </div>
  );
}

```

## Controlled row selection

Use the `rowSelectionModel` prop to control the selection.
Each time this prop changes, the `onRowSelectionModelChange` callback is called with the new selection value.

```tsx
import * as React from 'react';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ControlledSelectionGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>({ type: 'include', ids: new Set() });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        checkboxSelection
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        {...data}
      />
    </div>
  );
}

```

## Checkbox selection

To activate checkbox selection set `checkboxSelection={true}`.

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';

export default function CheckboxSelectionGrid() {
  const [checkboxSelection, setCheckboxSelection] = React.useState(true);
  const [disableMultipleRowSelection, setDisableMultipleRowSelection] =
    React.useState(false);

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 5,
  });

  return (
    <div style={{ width: '100%' }}>
      <Box sx={{ mb: 1 }}>
        <FormControlLabel
          label="checkboxSelection"
          control={
            <Switch
              checked={checkboxSelection}
              onChange={(event) => setCheckboxSelection(event.target.checked)}
            />
          }
        />
        <FormControlLabel
          label="disableMultipleRowSelection"
          control={
            <Switch
              checked={disableMultipleRowSelection}
              onChange={(event) =>
                setDisableMultipleRowSelection(event.target.checked)
              }
            />
          }
        />
      </Box>
      <div style={{ height: 400 }}>
        <DataGrid
          {...data}
          checkboxSelection={checkboxSelection}
          disableMultipleRowSelection={disableMultipleRowSelection}
        />
      </div>
    </div>
  );
}

```

### Custom checkbox column

If you provide a custom checkbox column to the Data Grid with the `GRID_CHECKBOX_SELECTION_FIELD` field, the Data Grid will not add its own.

We strongly recommend to use the `GRID_CHECKBOX_SELECTION_COL_DEF` variable instead of re-defining all the custom properties yourself.

In the following demo, the checkbox column has been moved to the right and its width has been increased to 100px.

```tsx
import * as React from 'react';
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function CheckboxSelectionCustom() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 5,
  });

  const columns = React.useMemo(
    () => [
      ...data.columns,
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 100,
      },
    ],
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} checkboxSelection columns={columns} />
    </div>
  );
}

```

:::warning
Always set the `checkboxSelection` prop to `true` even when providing a custom checkbox column.
Otherwise, the Data Grid might remove your column.
:::

### Visible rows selection [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

By default, when you click the "Select All" checkbox, all rows in the Data Grid are selected.
If you want to change this behavior and only select the rows that are currently visible on the page, you can use the `checkboxSelectionVisibleOnly` prop.

```tsx
import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';

export default function CheckboxSelectionVisibleOnlyGrid() {
  const [checkboxSelectionVisibleOnly, setCheckboxSelectionVisibleOnly] =
    React.useState(false);

  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 300,
    maxColumns: 5,
  });

  return (
    <div style={{ width: '100%' }}>
      <Box sx={{ mb: 1 }}>
        <FormControlLabel
          label="checkboxSelectionVisibleOnly"
          control={
            <Switch
              checked={checkboxSelectionVisibleOnly}
              onChange={(event) =>
                setCheckboxSelectionVisibleOnly(event.target.checked)
              }
            />
          }
        />
      </Box>
      <div style={{ height: 400 }}>
        <DataGridPro
          {...data}
          loading={loading}
          initialState={{
            ...data.initialState,
            pagination: { paginationModel: { pageSize: 50 } },
          }}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          pagination
          checkboxSelection
          checkboxSelectionVisibleOnly={checkboxSelectionVisibleOnly}
        />
      </div>
    </div>
  );
}

```

## Usage with server-side pagination

Using the controlled selection with `paginationMode="server"` may result in selected rows being lost when the page is changed.
This happens because the Data Grid cross-checks with the `rows` prop and only calls `onRowSelectionModelChange` with existing row IDs.
Depending on your server-side implementation, when the page changes and the new value for the `rows` prop does not include previously selected rows, the Data Grid will call `onRowSelectionModelChange` with an empty value.
To prevent this, enable the `keepNonExistentRowsSelected` prop to keep the rows selected even if they do not exist.

```tsx
<DataGrid keepNonExistentRowsSelected />
```

By using this approach, clicking in the **Select All** checkbox may still leave some rows selected.
It is up to you to clean the selection model, using the `rowSelectionModel` prop.
The following demo shows the prop in action:

```tsx
import * as React from 'react';
import { DataGrid, GridRowsProp, GridRowSelectionModel } from '@mui/x-data-grid';
import { GridDemoData, useDemoData, randomInt } from '@mui/x-data-grid-generator';

function loadServerRows(page: number, data: GridDemoData): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(
      () => {
        resolve(data.rows.slice(page * 5, (page + 1) * 5));
      },
      randomInt(100, 600),
    ); // simulate network latency
  });
}

export default function ControlledSelectionServerPaginationGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [loading, setLoading] = React.useState(false);
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>({ type: 'include', ids: new Set() });

  React.useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      const newRows = await loadServerRows(paginationModel.page, data);

      if (!active) {
        return;
      }

      setRows(newRows);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [paginationModel.page, data]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        rows={rows}
        pagination
        checkboxSelection
        paginationModel={paginationModel}
        pageSizeOptions={[5]}
        rowCount={100}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        loading={loading}
        keepNonExistentRowsSelected
      />
    </div>
  );
}

```

## apiRef

The Data Grid exposes a set of methods via the `apiRef` object that are used internally in the implementation of the row selection feature.
The reference below describes the relevant functions.
See [API object](/x/react-data-grid/api-object/) for more details.

:::warning
This API should only be used as a last resort when the Data Grid's built-in props aren't sufficient for your specific use case.
:::

```jsx
import * as React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/x/api/data-grid/grid-row-selection-api.json';
import proApi from 'docsx/pages/x/api/data-grid/grid-row-multi-selection-api.json';

export default function RowSelectionApiNoSnap() {
  return <ApiDocs api={api} proApi={proApi} />;
}

```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
