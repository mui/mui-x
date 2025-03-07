import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function NoResultsOverlay() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 6,
    maxColumns: 6,
  });

  return (
    <Box sx={{ width: '100%', height: 340 }}>
      <DataGrid
        {...data}
        initialState={{
          ...data.initialState,
          filter: {
            filterModel: {
              items: [],
              quickFilterValues: ['abc'],
            },
          },
        }}
        showToolbar
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </Box>
  );
}
