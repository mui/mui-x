import * as React from 'react';
import Button from '@material-ui/core/Button';
import { DataGrid, GridColDef, GridCellParams } from '@material-ui/data-grid';

const columns: GridColDef[] = [
  {
    field: 'date',
    headerName: 'Year',
    width: 150,
    renderCell: (params: GridCellParams) => (
      <strong>
        {(params.value as Date).getFullYear()}
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginLeft: 16 }}
        >
          Open
        </Button>
      </strong>
    ),
  },
];

const rows = [
  {
    id: 1,
    date: new Date(1979, 0, 1),
  },
  {
    id: 2,
    date: new Date(1984, 1, 1),
  },
  {
    id: 3,
    date: new Date(1992, 2, 1),
  },
];

export default function RenderCellGrid() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
