import * as React from 'react';
import {
  DataGrid,
  Toolbar,
  ToolbarButton,
  useGridApiContext,
} from '@mui/x-data-grid';
import Button from '@mui/material/Button';

const columns = [
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

function CustomToolbar() {
  const apiRef = useGridApiContext();

  return (
    <Toolbar>
      <ToolbarButton
        onClick={() => apiRef.current?.sortColumn('firstName', 'asc')}
        render={<Button />}
      >
        Ascending
      </ToolbarButton>
      <ToolbarButton
        onClick={() => apiRef.current?.sortColumn('firstName', 'desc')}
        render={<Button />}
      >
        Descending
      </ToolbarButton>
      <ToolbarButton
        onClick={() => apiRef.current?.sortColumn('firstName', null)}
        render={<Button />}
      >
        None
      </ToolbarButton>
    </Toolbar>
  );
}

export default function ReadOnlySortingGrid() {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          sorting: {
            sortModel: [{ field: 'firstName', sort: 'asc' }],
          },
        }}
        slots={{
          toolbar: CustomToolbar,
        }}
        showToolbar
      />
    </div>
  );
}
