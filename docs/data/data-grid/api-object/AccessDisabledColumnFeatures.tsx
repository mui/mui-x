import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid, useGridApiRef, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
    filterable: false,
    sortable: false,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon' },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei' },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime' },
  { id: 4, lastName: 'Stark', firstName: 'Arya' },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 6, lastName: 'Melisandre', firstName: null },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara' },
  { id: 8, lastName: 'Frances', firstName: 'Rossini' },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey' },
];

export default function AccessDisabledColumnFeatures() {
  const apiRef = useGridApiRef();

  return (
    <div style={{ width: '100%' }}>
      <Button onClick={() => apiRef.current.sortColumn('firstName', 'asc')}>
        Sort by ASC
      </Button>
      <Button onClick={() => apiRef.current.sortColumn('firstName', 'desc')}>
        Sort by DESC
      </Button>
      <Button onClick={() => apiRef.current.sortColumn('firstName', null)}>
        Remove sort
      </Button>
      <Box sx={{ height: 400 }}>
        <DataGrid columns={columns} rows={rows} apiRef={apiRef} />
      </Box>
    </div>
  );
}
