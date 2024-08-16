import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';

const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'isAdmin', type: 'boolean', headerName: 'is admin', width: 100 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
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
  { id: 1, isAdmin: false, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, isAdmin: true, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, isAdmin: false, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, isAdmin: false, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, isAdmin: true, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, isAdmin: true, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, isAdmin: false, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, isAdmin: false, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, isAdmin: false, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const columnGroupingModel = [
  {
    groupId: 'internal_data',
    headerName: 'Internal (not freeReordering)',
    description: '',
    children: [{ field: 'id' }, { field: 'isAdmin' }],
  },
  {
    groupId: 'naming',
    headerName: 'Full name (freeReordering)',
    freeReordering: true,
    children: [{ field: 'lastName' }, { field: 'firstName' }],
  },
];

export default function BreakingGroupDemo() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        columnGroupingModel={columnGroupingModel}
      />
    </div>
  );
}
