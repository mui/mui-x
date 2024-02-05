import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridValueGetter,
  GridValueSetter,
  GridValueParser,
} from '@mui/x-data-grid';

type Row = (typeof defaultRows)[number];

const setFullName: GridValueSetter<Row> = (value, row) => {
  const [firstName, lastName] = value!.toString().split(' ');
  return { ...row, firstName, lastName };
};

const parseFullName: GridValueParser = (value) => {
  return String(value)
    .split(' ')
    .map((str) => (str.length > 0 ? str[0].toUpperCase() + str.slice(1) : ''))
    .join(' ');
};

export default function ValueParserSetterGrid() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={defaultRows} columns={columns} />
    </div>
  );
}

const defaultRows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon' },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei' },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime' },
  { id: 4, lastName: 'Stark', firstName: 'Arya' },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys' },
];

const getFullName: GridValueGetter<Row> = (value, row) => {
  return `${row.firstName || ''} ${row.lastName || ''}`;
};

const columns: GridColDef[] = [
  { field: 'firstName', headerName: 'First name', width: 130, editable: true },
  { field: 'lastName', headerName: 'Last name', width: 130, editable: true },
  {
    field: 'fullName',
    headerName: 'Full name',
    width: 160,
    editable: true,
    valueGetter: getFullName,
    valueSetter: setFullName,
    valueParser: parseFullName,
    sortComparator: (v1, v2) => v1!.toString().localeCompare(v2!.toString()),
  },
];
