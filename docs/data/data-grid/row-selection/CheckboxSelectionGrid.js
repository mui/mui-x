import * as React from 'react';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function CheckboxSelectionGrid() {
  const [checkboxSelection, setCheckboxSelection] = React.useState(true);

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 5,
  });

  return (
    <div style={{ width: '100%' }}>
      <Button
        sx={{ mb: 1 }}
        onClick={() => setCheckboxSelection(!checkboxSelection)}
      >
        Toggle checkbox selection
      </Button>
      <div style={{ height: 400 }}>
        <DataGrid checkboxSelection={checkboxSelection} {...data} />
      </div>
    </div>
  );
}
