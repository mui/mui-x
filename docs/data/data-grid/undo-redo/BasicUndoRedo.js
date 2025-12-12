import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function BasicUndoRedo() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 200,
    editable: true,
  });

  return (
    <Box sx={{ height: 450, width: '100%' }}>
      <DataGridPremium
        {...data}
        pagination
        showToolbar
        disableRowSelectionOnClick
        cellSelection
        disablePivoting
      />
    </Box>
  );
}
