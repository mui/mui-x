import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function QuickFilteringGridWasm() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100_000,
  });

  return (
    <Box sx={{ height: 500, width: 1 }}>
      <DataGrid
        {...data}
        density="compact"
        experimentalFeatures={{ wasmQuickFilter: true }}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: {
              debounceMs: 50,
            },
          },
        }}
      />
    </Box>
  );
}
