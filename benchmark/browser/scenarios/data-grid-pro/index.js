import * as React from 'react';
import { DataGridPro as MuiDataGridPro } from '@mui/x-data-grid-pro';

const ROWS = 100000;
const COLUMNS = 100000;

const columns = [];
const rows = [];

for (let columnIdx = 0; columnIdx < COLUMNS; columnIdx += 1) {
  columns.push({
    field: `col-${columnIdx}`,
    valueGetter: (row) => `${row.id} ${columnIdx}`,
  });
}

for (let rowIdx = 0; rowIdx < ROWS; rowIdx += 1) {
  rows.push({ id: rowIdx });
}

export default function DataGridPro() {
  return (
    <div style={{ height: 'calc(100vh - 16px)', width: '100%' }}>
      <MuiDataGridPro rows={rows} rowHeight={32} columns={columns} />
    </div>
  );
}
