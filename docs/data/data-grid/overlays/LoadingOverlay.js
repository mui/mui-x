import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function LoadingOverlay() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 6,
    maxColumns: 6,
  });

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGrid {...data} loading />
    </Box>
  );
}
