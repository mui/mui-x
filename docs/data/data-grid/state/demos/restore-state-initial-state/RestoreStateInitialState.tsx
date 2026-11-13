import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import type { GridInitialState, GridSlotProps } from '@mui/x-data-grid-pro';
import {
  DataGridPro,
  Toolbar,
  ToolbarRoot,
  ToolbarButton,
  gridDensitySelector,
  useGridSelector,
  FilterPanelTrigger,
  useGridApiContext,
  useGridRootProps,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    syncState: (stateToSave: GridInitialState) => void;
  }
}

function GridDensitySelector() {
  const apiRef = useGridApiContext();
  const density = useGridSelector(apiRef, gridDensitySelector);
  const rootProps = useGridRootProps();
  const densityOptions = [
    {
      value: 'compact',
      Icon: rootProps.slots.densityCompactIcon,
      label: apiRef.current.getLocaleText('toolbarDensityCompact'),
    },
    {
      value: 'standard',
      Icon: rootProps.slots.densityStandardIcon,
      label: apiRef.current.getLocaleText('toolbarDensityStandard'),
    },
    {
      value: 'comfortable',
      Icon: rootProps.slots.densityComfortableIcon,
      label: apiRef.current.getLocaleText('toolbarDensityComfortable'),
    },
  ] as const;
  const DensityIcon = densityOptions.find(
    (option) => option.value === density,
  )!.Icon;
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const menuId = React.useId();
  const triggerId = React.useId();

  return (
    <React.Fragment>
      <ToolbarButton
        render={<Button size="small" startIcon={<DensityIcon />} />}
        id={triggerId}
        aria-haspopup="menu"
        aria-controls={anchorEl ? menuId : undefined}
        aria-expanded={Boolean(anchorEl)}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        {apiRef.current.getLocaleText('toolbarDensity')}
      </ToolbarButton>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{ list: { 'aria-labelledby': triggerId } }}
      >
        {densityOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={density === option.value}
            onClick={() => {
              apiRef.current.setDensity(option.value);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <option.Icon />
            </ListItemIcon>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}

function GridCustomToolbar({ syncState }: GridSlotProps['toolbar']) {
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
  // @focus-start @padding 1
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const [savedState, setSavedState] = React.useState<{
    count: number;
    initialState: GridInitialState;
  }>({ count: 0, initialState: data.initialState! });

  const syncState = React.useCallback((newInitialState: GridInitialState) => {
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
  // @focus-end
}
