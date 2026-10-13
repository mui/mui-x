import * as React from 'react';
import {
  DataGrid,
  GridDensity,
  gridDensitySelector,
  Toolbar,
  ToolbarButton,
  useGridApiContext,
  useGridRootProps,
  useGridSelector,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

function CustomToolbar() {
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
    <Toolbar style={{ justifyContent: 'flex-start' }}>
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
    </Toolbar>
  );
}

export default function DensitySelectorSmallGrid() {
  const [density, setDensity] = React.useState<GridDensity>('compact');

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 4,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        density={density}
        onDensityChange={(newDensity) => {
          console.info(`Density updated to: ${newDensity}`);
          setDensity(newDensity);
        }}
        slots={{
          toolbar: CustomToolbar,
        }}
        showToolbar
      />
    </div>
  );
}
