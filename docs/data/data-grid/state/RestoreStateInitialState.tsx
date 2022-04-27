import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {
  DataGridPro,
  GridInitialState,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  useGridApiContext,
  useGridRootProps,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const GridCustomToolbar = ({
  syncState,
}: {
  syncState: (stateToSave: GridInitialState) => void;
}) => {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Button
        size="small"
        color="primary"
        startIcon={<rootProps.components.ColumnSelectorIcon />}
        onClick={() => syncState(apiRef.current.exportState())}
        {...rootProps.componentsProps?.baseButton}
      >
        Recreate the 2nd grid
      </Button>
    </GridToolbarContainer>
  );
};

export default function RestoreStateInitialState() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const [savedState, setSavedState] = React.useState<{
    count: number;
    initialState: GridInitialState | undefined;
  }>({ count: 0, initialState: undefined });

  const syncState = React.useCallback((newInitialState: GridInitialState) => {
    setSavedState((prev) => ({
      ...prev,
      count: prev.count + 1,
      initialState: newInitialState,
    }));
  }, []);

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Box sx={{ width: '100%', height: 336, bgcolor: 'background.paper' }}>
        <DataGridPro
          {...data}
          loading={loading}
          components={{ Toolbar: GridCustomToolbar }}
          componentsProps={{ toolbar: { syncState } }}
        />
      </Box>
      <Box sx={{ width: '100%', height: 300, bgcolor: 'background.paper' }}>
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
