# Data Grid - Editing events

Using editing events.

The interactions that [start](#start-editing) and [stop](#stop-editing) trigger `'cellEditStart'` and `'cellEditStop'` [events](/x/react-data-grid/events/), respectively.
For [row editing](#row-editing), the events are `'rowEditStart'` and `'rowEditStop'`.
You can control how these events are handled to customize editing behavior.

For convenience, you can also listen to these events using their respective props:

- `onCellEditStart()`
- `onCellEditStop()`
- `onRowEditStart()`
- `onRowEditStop()`

These events and props are called with an object containing the row ID and column field of the cell that is being edited.
The object also contains a `reason` param that specifies which type of interaction caused the event to be fired—for instance, `'cellDoubleClick'` when a double-click initiates edit mode.

The following demo shows how to prevent the user from exiting edit mode when clicking outside of a cell.
To do this, the `onCellEditStop()` prop is used to check if the `reason` is `'cellFocusOut'`.
If that condition is true, it [disables](/x/react-data-grid/events/#disabling-the-default-behavior) the default event behavior.
In this context, the user can only stop editing a cell by pressing <kbd class="key">Enter</kbd>, <kbd class="key">Escape</kbd> or <kbd class="key">Tab</kbd>.

```tsx
import * as React from 'react';
import {
  GridColDef,
  GridRowsProp,
  DataGrid,
  GridCellEditStopParams,
  GridCellEditStopReasons,
  MuiEvent,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

export default function DisableStopEditModeOnFocusOut() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        onCellEditStop={(params: GridCellEditStopParams, event: MuiEvent) => {
          if (params.reason === GridCellEditStopReasons.cellFocusOut) {
            event.defaultMuiPrevented = true;
          }
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

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
