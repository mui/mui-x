import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

const rows = [
  {
    id: 1,
    date: new Date(1979, 0, 1),
  },
  {
    id: 2,
    date: new Date(1984, 0, 1),
  },
  {
    id: 3,
    date: new Date(1992, 0, 1),
  },
];

export default function ValueFormatterGrid() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={[
          {
            type: 'number',
            field: 'date',
            headerName: 'Year',
            width: 150,
            valueFormatter: (params) => params.value.getFullYear(),
          },
        ]}
      />
    </div>
  );
}
