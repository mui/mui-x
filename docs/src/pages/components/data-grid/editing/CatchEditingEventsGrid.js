/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import Alert from '@material-ui/lab/Alert';
import {
  GRID_CELL_EDIT_ENTER,
  GRID_CELL_EDIT_EXIT,
  useGridApiRef,
  XGrid,
} from '@material-ui/x-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from '@material-ui/x-grid-data-generator';

export default function CatchEditingEventsGrid() {
  const apiRef = useGridApiRef();
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    return apiRef.current.subscribeEvent(GRID_CELL_EDIT_ENTER, (param, event) => {
      setMessage(`Editing cell with value: ${param.value} at row: ${param.rowIndex}, column: ${param.field},
                        triggered by ${event.type}
      `);
    });
  }, [apiRef]);

  React.useEffect(() => {
    return apiRef.current.subscribeEvent(GRID_CELL_EDIT_EXIT, () => {
      setMessage('');
    });
  }, [apiRef]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      {message && <Alert severity="info">{message}</Alert>}
      <XGrid rows={rows} columns={columns} apiRef={apiRef} />
    </div>
  );
}

const columns = [
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

const rows = [
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
