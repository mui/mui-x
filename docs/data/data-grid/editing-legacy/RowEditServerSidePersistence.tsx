import * as React from 'react';
import {
  DataGridPro,
  GridColumns,
  GridRowId,
  GridRowsProp,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertProps } from '@mui/material/Alert';

interface User {
  name: string;
  age: number;
  id: GridRowId;
  dateCreated: Date;
  lastLogin: Date;
}

const useFakeMutation = () => {
  return React.useCallback(
    (user: User) =>
      new Promise((resolve) =>
        setTimeout(() => {
          resolve(user);
        }, 200),
      ),
    [],
  );
};

export default function RowEditServerSidePersistence() {
  const mutateRow = useFakeMutation();
  const apiRef = useGridApiRef();
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleRowEditCommit = React.useCallback(
    async (id: GridRowId) => {
      const model = apiRef.current.getEditRowsModel(); // This object contains all rows that are being edited
      const newRow = model[id]; // The data that will be committed

      // The new value entered
      const name = newRow.name.value as string;
      const age = newRow.age.value as number;
      const lastLogin = newRow.lastLogin.value as Date;
      const dateCreated = newRow.dateCreated.value as Date;

      // Get the row old value before committing
      const oldRow = apiRef.current.getRow(id)!;

      try {
        // Make the HTTP request to save in the backend
        await mutateRow({ id, name, age, lastLogin, dateCreated });
        setSnackbar({ children: 'User successfully saved', severity: 'success' });
      } catch (error) {
        setSnackbar({ children: 'Error while saving user', severity: 'error' });
        // Restore the row in case of error
        apiRef.current.updateRows([oldRow]);
      }
    },
    [apiRef, mutateRow],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        editMode="row"
        onRowEditCommit={handleRowEditCommit}
      />
      {!!snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </div>
  );
}

const columns: GridColumns = [
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
