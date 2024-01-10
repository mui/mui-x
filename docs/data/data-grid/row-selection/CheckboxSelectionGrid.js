import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';

export default function CheckboxSelectionGrid() {
  const [checkboxSelection, setCheckboxSelection] = React.useState(true);
  const [disableMultipleRowSelection, setDisableMultipleRowSelection] =
    React.useState(false);

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 5,
  });

  return (
    <div style={{ width: '100%' }}>
      <Box sx={{ mb: 1 }}>
        <FormControlLabel
          label="checkboxSelection"
          control={
            <Switch
              checked={checkboxSelection}
              onChange={(event) => setCheckboxSelection(event.target.checked)}
            />
          }
        />
        <FormControlLabel
          label="disableMultipleRowSelection"
          control={
            <Switch
              checked={disableMultipleRowSelection}
              onChange={(event) =>
                setDisableMultipleRowSelection(event.target.checked)
              }
            />
          }
        />
      </Box>
      <div style={{ height: 400 }}>
        <DataGrid
          {...data}
          checkboxSelection={checkboxSelection}
          disableMultipleRowSelection={disableMultipleRowSelection}
        />
      </div>
    </div>
  );
}
