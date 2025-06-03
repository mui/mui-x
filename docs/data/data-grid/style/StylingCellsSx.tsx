import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function SxProp() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 10,
  });

  return (
    <Box sx={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        sx={{
          '& .MuiDataGrid-columnHeader': {
            paddingLeft: 3,
            paddingRight: 3,
          },
          // You must avoid targeting the empty cells, otherwise the empty
          // filler cells at the end of grid rows will be affected and
          // this will break the layout.
          '& .MuiDataGrid-cell:not(.MuiDataGrid-cellEmpty)': {
            paddingLeft: 3,
            paddingRight: 3,
          },
        }}
      />
    </Box>
  );
}
