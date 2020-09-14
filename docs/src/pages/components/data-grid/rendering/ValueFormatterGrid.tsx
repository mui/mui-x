import * as React from 'react';
import { DataGrid, ColDef, ValueFormatterParams } from '@material-ui/data-grid';

const columns: ColDef[] = [
  { field: 'id', hide: true },
  {
    field: 'date',
    headerName: 'Year',
    valueFormatter: (params: ValueFormatterParams) =>
      (params.value as Date).getFullYear(),
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

export default function ValueFormatterGrid() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
