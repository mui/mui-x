import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';

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
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function ReadOnlySortingGrid() {
  const apiRef = useGridApiRef();

  return (
    <div style={{ width: '100%' }}>
      <Button onClick={() => apiRef.current.sortColumn('firstName', 'asc')}>
        Ascending
      </Button>
      <Button onClick={() => apiRef.current.sortColumn('firstName', 'desc')}>
        Descending
      </Button>
      <Button onClick={() => apiRef.current.sortColumn('firstName', null)}>
        None
      </Button>
      <Box sx={{ height: 400 }}>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          initialState={{
            sorting: {
              sortModel: [{ field: 'firstName', sort: 'asc' }],
            },
          }}
        />
      </Box>
    </div>
  );
}
