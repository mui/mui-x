import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function NoRowsOverlay() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 0,
    maxColumns: 6,
  });

  return (
    <Box sx={{ width: '100%', height: 340 }}>
      <DataGrid {...data} rows={[]} />
    </Box>
  );
}
