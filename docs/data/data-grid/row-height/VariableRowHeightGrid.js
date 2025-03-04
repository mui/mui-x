import * as React from 'react';
import { DataGrid, Toolbar, ToolbarButton } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckIcon from '@mui/icons-material/Check';
import SettingsIcon from '@mui/icons-material/Settings';
import { randomInt, randomUserName } from '@mui/x-data-grid-generator';

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

let idCounter = 0;
const createRandomRow = () => {
  idCounter += 1;
  return { id: idCounter, username: randomUserName(), age: randomInt(10, 80) };
};

const columns = [
  { field: 'id' },
  { field: 'username', width: 150 },
  { field: 'age', width: 80, type: 'number' },
];

const rows = [
  createRandomRow(),
  createRandomRow(),
  createRandomRow(),
  createRandomRow(),
  createRandomRow(),
];

export default function VariableRowHeightGrid() {
  const [density, setDensity] = React.useState('standard');

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowHeight={({ id, densityFactor }) => {
          if (id % 2 === 0) {
            return 100 * densityFactor;
          }

          return null;
        }}
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
