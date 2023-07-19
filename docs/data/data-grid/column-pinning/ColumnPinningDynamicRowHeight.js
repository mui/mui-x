import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomTraderName,
  randomEmail,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

export default function ColumnPinningDynamicRowHeight() {
  const apiRef = useGridApiRef();
  const [showEditDelete, setShowEditDelete] = React.useState(true);

  const columns = React.useMemo(
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
    apiRef.current.resetRowHeights();
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

const rows = [
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
