import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ToggleUndoRedo() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 200,
    editable: true,
  });

  const [stackSize, setStackSize] = React.useState(0);

  return (
    <Box style={{ width: '100%' }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={stackSize > 0}
            onChange={(event) => setStackSize(event.target.checked ? 10 : 0)}
          />
        }
        label="Enable undo/redo"
      />
      <Box style={{ height: 450, position: 'relative' }}>
        <DataGridPremium
          {...data}
          pagination
          showToolbar
          disableRowSelectionOnClick
          cellSelection
          disablePivoting
          historyStackSize={stackSize}
        />
      </Box>
    </Box>
  );
}
