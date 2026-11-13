import Box from '@mui/material/Box';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid } from '@mui/x-data-grid';

export default function LoadingOverlaySkeleton() {
  // @focus-start @padding 1
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 9,
  });

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGrid
        {...data}
        loading
        slotProps={{
          loadingOverlay: {
            variant: 'skeleton',
            noRowsVariant: 'skeleton',
          },
        }}
      />
    </Box>
  );
  // @focus-end
}
