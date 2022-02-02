import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {
  DataGridPro,
  useGridApiRef,
  gridPaginatedVisibleSortedGridRowIdsSelector,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function DirectSelector() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 10,
  });

  const apiRef = useGridApiRef();

  const handleSelectFirstVisibleRow = () => {
    const visibleRows = gridPaginatedVisibleSortedGridRowIdsSelector(apiRef);
    if (visibleRows.length === 0) {
      return;
    }

    apiRef.current.selectRow(
      visibleRows[0],
      !apiRef.current.isRowSelected(visibleRows[0]),
    );
  };

  return (
    <Stack spacing={2} alignItems="flex-start" style={{ width: '100%' }}>
      <Button size="small" onClick={handleSelectFirstVisibleRow}>
        Toggle the selection of the 1st row of the page
      </Button>
      <Box sx={{ width: '100%', height: 400, bgcolor: 'background.paper' }}>
        <DataGridPro apiRef={apiRef} pagination pageSize={10} {...data} />
      </Box>
    </Stack>
  );
}
