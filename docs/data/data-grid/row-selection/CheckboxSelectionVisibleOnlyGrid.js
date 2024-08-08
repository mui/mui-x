import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';

export default function CheckboxSelectionVisibleOnlyGrid() {
  const [checkboxSelectionVisibleOnly, setCheckboxSelectionVisibleOnly] =
    React.useState(false);

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 300,
    maxColumns: 5,
  });

  return (
    <div style={{ width: '100%' }}>
      <Box sx={{ mb: 1 }}>
        <FormControlLabel
          label="checkboxSelectionVisibleOnly"
          control={
            <Switch
              checked={checkboxSelectionVisibleOnly}
              onChange={(event) =>
                setCheckboxSelectionVisibleOnly(event.target.checked)
              }
            />
          }
        />
      </Box>
      <div style={{ height: 400 }}>
        <DataGridPro
          {...data}
          initialState={{
            ...data.initialState,
            pagination: { paginationModel: { pageSize: 50 } },
          }}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          pagination
          checkboxSelection
          checkboxSelectionVisibleOnly={checkboxSelectionVisibleOnly}
        />
      </div>
    </div>
  );
}
