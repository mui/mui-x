import * as React from 'react';
import {
  DataGridPro,
  GridCellEditCommitParams,
  GridColumns,
  GridRowId,
  GridRowsProp,
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
    (user: Partial<User>) =>
      new Promise<Partial<User>>((resolve) =>
        setTimeout(() => {
          resolve(user);
        }, 200),
      ),
    [],
  );
};

export default function CellEditServerSidePersistence() {
  const mutateRow = useFakeMutation();
  const [rows, setRows] = React.useState(INITIAL_ROWS);

  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleCellEditCommit = React.useCallback(
    async (params: GridCellEditCommitParams) => {
      try {
        // Make the HTTP request to save in the backend
        const response = await mutateRow({
          id: params.id,
          [params.field]: params.value,
        });
        setSnackbar({ children: 'User successfully saved', severity: 'success' });
        setRows((prev) =>
          prev.map((row) => (row.id === params.id ? { ...row, ...response } : row)),
        );
      } catch (error) {
        setSnackbar({ children: 'Error while saving user', severity: 'error' });
        // Restore the row in case of error
        setRows((prev) => [...prev]);
      }
    },
    [mutateRow],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        onCellEditCommit={handleCellEditCommit}
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

const INITIAL_ROWS: GridRowsProp = [
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
