import * as React from 'react';
import { XGrid } from '@material-ui/x-grid';

const columns = [
  { field: 'id' },
  { field: 'firstName' },
  { field: 'lastName' },
  {
    field: 'age',
    cellClassName: ['age'],
    headerClassName: ['age'],
    type: 'number',
    sortDirection: 'desc',
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
];

export default function XGridDemo() {
  return (
    <div style={{ width: '100%', height: 450 }}>
      <XGrid rows={rows} columns={columns} checkboxSelection />
    </div>
  );
}
