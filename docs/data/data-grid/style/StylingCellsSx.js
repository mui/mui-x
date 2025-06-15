import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { alpha } from '@mui/material/styles';

export default function StylingCellsSx() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 10,
  });

  return (
    <Box sx={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        sx={(theme) => ({
          '& .MuiDataGrid-columnHeader': {
            paddingLeft: 3,
            paddingRight: 3,
          },
          '& .MuiDataGrid-cell': {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '&:not(.MuiDataGrid-cellEmpty)': {
              paddingLeft: 3,
              paddingRight: 3,
            },
          },
        })}
      />
    </Box>
  );
}
