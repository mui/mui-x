import * as React from 'react';
import { DataGrid, ColDef, ValueFormatterParams } from '@material-ui/data-grid';

const columns: ColDef[] = [
  {
    field: 'date',
    headerName: 'Year',
    renderCell: (params: ValueFormatterParams) => (
      <strong>
        {(params.value as Date).getFullYear()}{' '}
        <span role="img" aria-label="birthday">
          🎂
        </span>
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
