import * as React from 'react';
import {
  DataGrid,
  GridRowModel,
  GridColumns,
  GridRowId,
  GridRowsProp,
} from '@mui/x-data-grid';
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
      new Promise<Partial<User>>((resolve, reject) =>
        setTimeout(() => {
          if (user.name?.trim() === '') {
            reject();
          } else {
            resolve({ ...user, name: user.name?.toUpperCase() });
          }
        }, 200),
      ),
    [],
  );
};

export default function CellEditServerSidePersistence() {
  const mutateRow = useFakeMutation();

  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const processRowUpdate = React.useCallback(
    async (newRow: GridRowModel) => {
      try {
        // Make the HTTP request to save in the backend
        const response = await mutateRow(newRow);
        setSnackbar({ children: 'User successfully saved', severity: 'success' });
        return response;
      } catch (error) {
        setSnackbar({ children: 'Error while saving user', severity: 'error' });
        throw error; // Throw again the error to reject the promise and keep the cell in edit mode
      }
    },
    [mutateRow],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        processRowUpdate={processRowUpdate}
        experimentalFeatures={{ newEditingApi: true }}
      />
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
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
