import * as React from 'react';
import Button from '@mui/material/Button';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function CellSelectionGrid() {
  const [rowSelection, setRowSelection] = React.useState(false);

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  return (
    <div style={{ width: '100%' }}>
      <Button sx={{ mb: 1 }} onClick={() => setRowSelection(!rowSelection)}>
        Toggle row selection
      </Button>
      <div style={{ height: 400 }}>
        <DataGridPremium
          rowSelection={rowSelection}
          checkboxSelection={rowSelection}
          cellSelection
          {...data}
        />
      </div>
    </div>
  );
}
