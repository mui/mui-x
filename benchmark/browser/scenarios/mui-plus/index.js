import * as React from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid } from 'mui-plus';

const ROWS = 100000;
const COLUMNS = 100000;

const columns = [];
const rows = [];

for (let columnIdx = 0; columnIdx < COLUMNS; columnIdx += 1) {
  columns.push({
    key: `col-${columnIdx}`,
    getValue: (row) => `${row.idx} ${columnIdx}`,
    width: 100,
  });
}

for (let rowIdx = 0; rowIdx < ROWS; rowIdx += 1) {
  rows.push({ idx: rowIdx });
}

export default function MuiPlus() {
  return (
    <Paper
      sx={{
        height: 'calc(100vh - 16px)',
        width: '100%',
        '& .MuiPlusTableCell': {
          boxSizing: 'border-box',
        },
      }}
    >
      <DataGrid data={rows} rowHeight={32} defaultColumns={columns} />
    </Paper>
  );
}
