import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function AutoHeightGrid() {
  const [nbRows, setNbRows] = React.useState(3);
  const removeRow = () => setNbRows((x) => Math.max(0, x - 1));
  const addRow = () => setNbRows((x) => Math.min(100, x + 1));

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <Stack spacing={1} sx={{ width: '100%', alignItems: 'flex-start' }}>
      <Button variant="outlined" onClick={removeRow}>
        Remove a row
      </Button>
      <Button variant="outlined" onClick={addRow}>
        Add a row
      </Button>
      <DataGrid
        autoHeight
        sx={{ width: '100%' }}
        {...data}
        rows={data.rows.slice(0, nbRows)}
      />
    </Stack>
  );
}
