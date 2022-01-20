import * as React from 'react';
import Paper from '@mui/material/Paper';
import { AutoSizer, Grid } from 'react-virtualized';

const ROWS = 100000;
const COLUMNS = 100000;

const columns = [];
const rows = [];

for (let columnIdx = 0; columnIdx < COLUMNS; columnIdx += 1) {
  columns.push({
    key: `col-${columnIdx}`,
  });
}

for (let rowIdx = 0; rowIdx < ROWS; rowIdx += 1) {
  rows.push({ idx: rowIdx });
}

export default function ReactVirtualized() {
  return (
    <Paper sx={{ height: 'calc(100vh - 16px)', width: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            columnWidth={100}
            columnCount={columns.length}
            height={height}
            rowHeight={32}
            overscanRowCount={10}
            cellRenderer={({ key, style, rowIndex, columnIndex }) => {
              return (
                <div key={key} style={style}>
                  {`${rowIndex} ${columnIndex}`}
                </div>
              );
            }}
            rowCount={rows.length}
            width={width}
          />
        )}
      </AutoSizer>
    </Paper>
  );
}
