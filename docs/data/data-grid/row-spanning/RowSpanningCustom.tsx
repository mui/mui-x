import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

export default function RowSpanningCustom() {
  return (
    <Box sx={{ height: 350, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        showCellVerticalBorder
        showColumnVerticalBorder
        disableRowSelectionOnClick
        hideFooter
        unstable_rowSpanning
        sx={{
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'transparent',
          },
        }}
      />
    </Box>
  );
}

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
    editable: true,
  },
  {
    field: 'designation',
    headerName: 'Designation',
    width: 200,
    editable: true,
  },
  {
    field: 'department',
    headerName: 'Department',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 100,
    valueFormatter: (value) => {
      return `${value} yo`;
    },
    rowSpanValueGetter: (value, row) => {
      return row ? `${row.name}-${row.age}` : value;
    },
  },
];

const rows = [
  {
    id: 1,
    name: 'George Floyd',
    designation: 'React Engineer',
    department: 'Engineering',
    age: 25,
  },
  {
    id: 2,
    name: 'George Floyd',
    designation: 'Technical Interviewer',
    department: 'Human resource',
    age: 25,
  },
  {
    id: 3,
    name: 'Cynthia Duke',
    designation: 'Technical Team Lead',
    department: 'Engineering',
    age: 25,
  },
  {
    id: 4,
    name: 'Jordyn Black',
    designation: 'React Engineer',
    department: 'Engineering',
    age: 31,
  },
  {
    id: 5,
    name: 'Rene Glass',
    designation: 'Ops Lead',
    department: 'Operations',
    age: 31,
  },
];
