import * as React from 'react';
import {
  DataGrid,
  GridDensityComfortableIcon,
  GridDensityCompactIcon,
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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const DENSITY_ICONS = {
  compact: <GridDensityCompactIcon fontSize="small" />,
  standard: <GridDensityStandardIcon fontSize="small" />,
  comfortable: <GridDensityComfortableIcon fontSize="small" />,
};

const DENSITY_OPTIONS = [
  {
    icon: DENSITY_ICONS.compact,
    label: 'Compact',
    value: 'compact',
  },
  {
    icon: DENSITY_ICONS.standard,
    label: 'Standard',
    value: 'standard',
  },
  {
    icon: DENSITY_ICONS.comfortable,
    label: 'Comfortable',
    value: 'comfortable',
  },
];

function DensityMenu() {
  const apiRef = useGridApiContext();
  const density = useGridSelector(apiRef, gridDensitySelector);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const buttonId = useId();
  const menuId = useId();
  const open = !!anchorEl;

  const handleDensityUpdate = (newDensity) => {
    if (newDensity !== null) {
      apiRef.current.setDensity(newDensity);
    }
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <GridToolbar.Button
        id={buttonId}
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : undefined}
        aria-controls={open ? menuId : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        {DENSITY_ICONS[density]}
        Density
        <ArrowDropDownIcon fontSize="small" sx={{ mx: -0.25 }} />
      </GridToolbar.Button>

      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': buttonId,
        }}
      >
        {DENSITY_OPTIONS.map((option) => (
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
