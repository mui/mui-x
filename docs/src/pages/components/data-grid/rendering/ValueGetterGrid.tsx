import * as React from 'react';
import { DataGrid, ColDef, ValueGetterParams } from '@material-ui/data-grid';

const columns: ColDef[] = [
  { field: 'id', hide: true },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'fullName',
    headerName: 'Full name',
    width: 160,
    valueGetter: (params: ValueGetterParams) =>
      `${params.getValue('firstName') || ''} ${
        params.getValue('lastName') || ''
      }`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon' },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei' },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime' },
  { id: 4, lastName: 'Stark', firstName: 'Arya' },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys' },
];

export default function ValueGetterGrid() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
