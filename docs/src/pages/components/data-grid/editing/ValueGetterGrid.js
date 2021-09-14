import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

function getFullName(params) {
  return `${params.getValue(params.id, 'firstName') || ''} ${
    params.getValue(params.id, 'lastName') || ''
  }`;
}

export default function ValueGetterGrid() {
  const [rows, setRows] = React.useState(defaultRows);

  const handleCellEditCommit = React.useCallback(
    ({ id, field, value }) => {
      if (field === 'fullName') {
        const [firstName, lastName] = value.toString().split(' ');
        const updatedRows = rows.map((row) => {
          if (row.id === id) {
            return { ...row, firstName, lastName };
          }
          return row;
        });
        setRows(updatedRows);
      }
    },
    [rows],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        onCellEditCommit={handleCellEditCommit}
      />
    </div>
  );
}

const columns = [
  { field: 'firstName', headerName: 'First name', width: 130, editable: true },
  { field: 'lastName', headerName: 'Last name', width: 130, editable: true },
  {
    field: 'fullName',
    headerName: 'Full name',
    width: 160,
    editable: true,
    valueGetter: getFullName,
    sortComparator: (v1, v2) => v1.toString().localeCompare(v2.toString()),
  },
];

const defaultRows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon' },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei' },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime' },
  { id: 4, lastName: 'Stark', firstName: 'Arya' },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys' },
];
