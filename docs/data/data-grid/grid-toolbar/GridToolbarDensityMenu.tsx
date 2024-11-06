import * as React from 'react';
import {
  DataGrid,
  GridArrowDropDownIcon,
  GridDensity,
  GridDensityComfortableIcon,
  GridDensityCompactIcon,
  GridDensityOption,
  gridDensitySelector,
  GridDensityStandardIcon,
  GridToolbarV8 as GridToolbar,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useId from '@mui/utils/useId';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

function DensityMenu() {
  const apiRef = useGridApiContext();
  const density = useGridSelector(apiRef, gridDensitySelector);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const densityButtonId = useId();
  const densityMenuId = useId();

  const handleDensitySelectorOpen = (event: React.MouseEvent) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget as HTMLButtonElement);
    }
  };

  const densityIcons = {
    compact: <GridDensityCompactIcon fontSize="small" />,
    standard: <GridDensityStandardIcon fontSize="small" />,
    comfortable: <GridDensityComfortableIcon fontSize="small" />,
  };

  const densityOptions: GridDensityOption[] = [
    {
      icon: densityIcons.compact,
      label: apiRef.current.getLocaleText('toolbarDensityCompact'),
      value: 'compact',
    },
    {
      icon: densityIcons.standard,
      label: apiRef.current.getLocaleText('toolbarDensityStandard'),
      value: 'standard',
    },
    {
      icon: densityIcons.comfortable,
      label: apiRef.current.getLocaleText('toolbarDensityComfortable'),
      value: 'comfortable',
    },
  ];

  const handleDensityUpdate = (newDensity: GridDensity) => {
    if (newDensity !== null) {
      apiRef.current.setDensity(newDensity);
    }
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <GridToolbar.ToggleButton
        id={densityButtonId}
        value="density"
        selected={!!anchorEl}
        onChange={handleDensitySelectorOpen}
      >
        {densityIcons[density]}
        Density
        <GridArrowDropDownIcon fontSize="small" sx={{ mx: -0.25 }} />
      </GridToolbar.ToggleButton>

      <Menu
        id={densityMenuId}
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {densityOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleDensityUpdate(option.value)}
            selected={density === option.value}
          >
            <ListItemIcon>{option.icon}</ListItemIcon>
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}

function Toolbar() {
  return (
    <GridToolbar.Root>
      <DensityMenu />
    </GridToolbar.Root>
  );
}

export default function GridToolbarDensityMenu() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} slots={{ toolbar: Toolbar }} />
    </div>
  );
}
