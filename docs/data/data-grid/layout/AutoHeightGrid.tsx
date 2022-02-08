import * as React from 'react';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function AutoHeightGrid() {
  const [nbRows, setNbRows] = React.useState(5);
  const removeRow = () => setNbRows((x) => Math.max(0, x - 1));
  const addRow = () => setNbRows((x) => Math.min(100, x + 1));

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ width: '100%' }}>
      <Button variant="outlined" onClick={removeRow}>
        Remove a row
      </Button>
      <Button variant="outlined" onClick={addRow}>
        Add a row
      </Button>
      <DataGrid autoHeight {...data} rows={data.rows.slice(0, nbRows)} />
    </div>
  );
}
