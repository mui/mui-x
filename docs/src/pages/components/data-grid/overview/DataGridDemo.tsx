import * as React from 'react';
import { DataGrid, ColDef } from '@material-ui/data-grid';

const columns: ColDef[] = [
  { field: 'id' },
  { field: 'firstName' },
  { field: 'lastName' },
  {
    field: 'age',
    cellClassName: ['age'],
    headerClassName: ['age'],
    type: 'number',
  },
  {
    field: 'fullName',
    description: 'this column has a value getter and is not sortable',
    headerClassName: 'highlight',
    sortable: false,
    valueGetter: (params) =>
      `${params.getValue('firstName') || ''} ${
        params.getValue('lastName') || ''
      }`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function DataGridDemo() {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
    </div>
  );
}
