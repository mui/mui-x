import * as React from 'react';
import { DataGrid, Toolbar, ToolbarButton } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckIcon from '@mui/icons-material/Check';
import SettingsIcon from '@mui/icons-material/Settings';

const DENISTY_OPTIONS = [
  { label: 'Compact density', value: 'compact' },
  { label: 'Standard density', value: 'standard' },
  { label: 'Comfortable density', value: 'comfortable' },
];

function CustomToolbar(props) {
  const { density, onDensityChange } = props;
  const [densityMenuOpen, setDensityMenuOpen] = React.useState(false);
  const densityMenuTriggerRef = React.useRef(null);

  return (
    <Toolbar>
      <Tooltip title="Settings">
        <ToolbarButton
          ref={densityMenuTriggerRef}
          id="density-menu-trigger"
          aria-controls="density-menu"
          aria-haspopup="true"
          aria-expanded={densityMenuOpen ? 'true' : undefined}
          onClick={() => setDensityMenuOpen(true)}
        >
          <SettingsIcon fontSize="small" sx={{ ml: 'auto' }} />
        </ToolbarButton>
      </Tooltip>

      <Menu
        id="density-menu"
        anchorEl={densityMenuTriggerRef.current}
        open={densityMenuOpen}
        onClose={() => setDensityMenuOpen(false)}
        MenuListProps={{
          'aria-labelledby': 'density-menu-trigger',
        }}
      >
        {DENISTY_OPTIONS.map((option) => (
          <MenuItem key={option.value} onClick={() => onDensityChange(option.value)}>
            <ListItemIcon>
              {density === option.value && <CheckIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Toolbar>
  );
}

export default function DensitySelectorGrid() {
  const [density, setDensity] = React.useState('standard');
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
        slots={{
          toolbar: CustomToolbar,
        }}
        slotProps={{
          toolbar: {
            density,
            onDensityChange: setDensity,
          },
        }}
        showToolbar
      />
    </div>
  );
}
