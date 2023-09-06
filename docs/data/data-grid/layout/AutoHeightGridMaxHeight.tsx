import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DataGrid, useGridAutoHeight, useGridApiRef } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const maxHeight = 500;

export default function AutoHeightGridMaxHeight() {
  const [nbRows, setNbRows] = React.useState(3);
  const removeRow = () => setNbRows((x) => Math.max(0, x - 1));
  const addRow = () => setNbRows((x) => Math.min(100, x + 1));

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const apiRef = useGridApiRef();
  const autoHeight = useGridAutoHeight(apiRef, maxHeight);

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button size="small" onClick={removeRow}>
          Remove a row
        </Button>
        <Button size="small" onClick={addRow}>
          Add a row
        </Button>
      </Stack>
      <div style={{ height: autoHeight ? 'auto' : maxHeight }}>
        <DataGrid
          apiRef={apiRef}
          autoHeight={autoHeight}
          {...data}
          rows={data.rows.slice(0, nbRows)}
        />
      </div>
    </Box>
  );
}
