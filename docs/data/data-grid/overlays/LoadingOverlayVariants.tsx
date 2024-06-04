import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function LoadingOverlayVariants() {
  const [withRows, setWithRows] = React.useState(false);
  const toggleRows = () => setWithRows((prevwithRows) => !prevwithRows);

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 5,
    maxColumns: 9,
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button size="small" onClick={toggleRows}>
          {withRows ? 'Remove rows' : 'Add rows'}
        </Button>
      </Stack>
      <Box sx={{ height: 345 }}>
        <DataGrid
          {...data}
          loading
          slotProps={{
            loadingOverlay: {
              noRowsVariant: 'skeleton',
              variant: 'linear-progress',
            },
          }}
          rows={withRows ? data.rows : []}
        />
      </Box>
    </Box>
  );
}
