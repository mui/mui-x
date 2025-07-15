import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function NoColumnsOverlay() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 50,
    maxColumns: 6,
  });

  const initialColumns = React.useMemo(
    () =>
      data.columns.reduce((acc, col) => {
        acc[col.field] = false;
        return acc;
      }, {}),
    [data.columns],
  );

  return (
    <Box sx={{ width: '100%', height: 340 }}>
      <DataGrid
        {...data}
        initialState={{
          columns: {
            columnVisibilityModel: initialColumns,
          },
        }}
      />
    </Box>
  );
}
