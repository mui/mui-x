import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {
  DataGridPro,
  Toolbar,
  ToolbarRoot,
  FilterPanelTrigger,
  useGridApiContext,
  useGridRootProps,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import GridDensitySelector from '../../../src/modules/components/GridDensitySelector';

function GridCustomToolbar({ syncState }) {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  return (
    <Toolbar
      render={
        <ToolbarRoot sx={{ minHeight: 'auto', p: 0.5, gap: 1, flexWrap: 'wrap' }} />
      }
    >
      <FilterPanelTrigger
        render={(props, { filterCount }) => (
          <rootProps.slots.baseButton
            {...props}
            size="small"
            startIcon={
              <rootProps.slots.baseBadge badgeContent={filterCount} color="primary">
                <rootProps.slots.openFilterButtonIcon />
              </rootProps.slots.baseBadge>
            }
          />
        )}
      >
        {apiRef.current.getLocaleText('toolbarFilters')}
      </FilterPanelTrigger>
      <GridDensitySelector />
      <Button
        size="small"
        startIcon={<rootProps.slots.columnSelectorIcon />}
        onClick={() => syncState(apiRef.current.exportState())}
        {...rootProps.slotProps?.baseButton}
      >
        Recreate the 2nd grid
      </Button>
    </Toolbar>
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
          showToolbar
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
