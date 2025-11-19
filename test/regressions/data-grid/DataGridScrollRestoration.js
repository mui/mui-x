import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ScrollRestoration() {
  const apiRef = useGridApiRef();

  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ height: 400 }}>
        <DataGridPro
          key={String(loading)}
          apiRef={apiRef}
          hideFooter
          loading={loading}
          {...data}
          initialState={{
            ...data.initialState,
            scroll: {
              top: 2000,
              left: 2000,
            },
          }}
        />
      </Box>
    </Box>
  );
}
