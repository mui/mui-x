import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  DataGrid,
  useGridApiRef,
  gridPaginatedVisibleSortedGridRowIdsSelector,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function DirectSelector() {
  const { data, loading } = useDemoData({
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
    <Box sx={{ width: '100%' }}>
      <Button size="small" onClick={handleSelectFirstVisibleRow}>
        Toggle the selection of the 1st row of the page
      </Button>
      <Box sx={{ height: 400, mt: 1 }}>
        <DataGrid
          {...data}
          loading={loading}
          apiRef={apiRef}
          pageSizeOptions={[10]}
          initialState={{
            ...data.initialState,
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}
