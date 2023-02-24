import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGridPro,
  GridRow,
  GridCell,
  GridColumnHeaders,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const MemoizedRow = React.memo(GridRow);

const MemoizedCell = React.memo(GridCell);

const MemoizedColumnHeaders = React.memo(GridColumnHeaders);

export default function DataGridProDemo() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100000,
    editable: true,
  });

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={data.rows.length === 0}
        rowHeight={38}
        checkboxSelection
        disableRowSelectionOnClick
        components={{
          Row: MemoizedRow,
          Cell: MemoizedCell,
          ColumnHeaders: MemoizedColumnHeaders,
        }}
      />
    </Box>
  );
}
