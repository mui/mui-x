import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {
  DataGridPro,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  useGridApiContext,
  useGridRootProps,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

function GridCustomToolbar({ syncState }) {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Button
        size="small"
        startIcon={<rootProps.slots.columnSelectorIcon />}
        onClick={() => syncState(apiRef.current.exportState())}
        {...rootProps.slotProps?.baseButton}
      >
        Recreate the 2nd grid
      </Button>
    </GridToolbarContainer>
  );
}

export default function RestoreStateInitialState() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const [savedState, setSavedState] = React.useState({
    count: 0,
    initialState: data.initialState,
  });

  const syncState = React.useCallback((newInitialState) => {
    setSavedState((prev) => ({
      count: prev.count + 1,
      initialState: newInitialState,
    }));
  }, []);

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Box sx={{ height: 336 }}>
        <DataGridPro
          {...data}
          loading={loading}
          slots={{ toolbar: GridCustomToolbar }}
          slotProps={{ toolbar: { syncState } }}
        />
      </Box>
      <Box sx={{ height: 300 }}>
        <DataGridPro
          {...data}
          loading={loading}
          initialState={savedState.initialState}
          key={savedState.count}
        />
      </Box>
    </Stack>
  );
}
