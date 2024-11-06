import * as React from 'react';
import Box from '@mui/material/Box';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGridPro } from '@mui/x-data-grid-pro';

export default function LoadingOverlaySkeleton() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 9,
  });

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGridPro
        {...data}
        loading
        slotProps={{
          loadingOverlay: {
            variant: 'skeleton',
            noRowsVariant: 'skeleton',
          },
        }}
        initialState={{
          pinnedColumns: {
            left: ['desk'],
          },
        }}
      />
    </Box>
  );
}
