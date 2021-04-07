import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

function getFullName(params) {
  return `${params.getValue('firstName') || ''} ${
    params.getValue('lastName') || ''
  }`;
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
    sortComparator: (v1, v2, cellParams1, cellParams2) =>
      getFullName(cellParams1).localeCompare(getFullName(cellParams2)),
  },
];

const defaultRows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon' },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei' },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime' },
  { id: 4, lastName: 'Stark', firstName: 'Arya' },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys' },
];

export default function ValueGetterGrid() {
  const [rows, setRows] = React.useState(defaultRows);

  const handleEditCellChangeCommitted = React.useCallback(
    ({ id, field, props }) => {
      if (field === 'fullName') {
        const [firstName, lastName] = props.value.toString().split(' ');
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
    <DataGrid
      rows={rows}
      columns={columns}
      onEditCellChangeCommitted={handleEditCellChangeCommitted}
      autoHeight
      hideFooter
    />
  );
}
