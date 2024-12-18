import * as React from 'react';
import { DataGrid, Grid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const DENISTY_OPTIONS = [
  { label: 'Compact', value: 'compact' },
  { label: 'Standard', value: 'standard' },
  { label: 'Comfortable', value: 'comfortable' },
];

function Toolbar(props) {
  const { settings, onSettingsChange } = props;
  const [settingsMenuOpen, setSettingsMenuOpen] = React.useState(false);
  const settingsMenuTriggerRef = React.useRef(null);

  return (
    <Grid.Toolbar.Root>
      <Tooltip title="Settings">
        <Grid.Toolbar.Button
          ref={settingsMenuTriggerRef}
          id="settings-menu-trigger"
          aria-controls="settings-menu"
          aria-haspopup="true"
          aria-expanded={settingsMenuOpen ? 'true' : undefined}
          onClick={() => setSettingsMenuOpen(true)}
          size="small"
        >
          <SettingsIcon fontSize="small" sx={{ ml: 'auto' }} />
        </Grid.Toolbar.Button>
      </Tooltip>

      <Menu
        id="settings-menu"
        anchorEl={settingsMenuTriggerRef.current}
        open={settingsMenuOpen}
        onClose={() => setSettingsMenuOpen(false)}
        MenuListProps={{
          'aria-labelledby': 'settings-menu-trigger',
        }}
      >
        {DENISTY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() =>
              onSettingsChange((currentSettings) => ({
                ...currentSettings,
                density: option.value,
              }))
            }
          >
            <ListItemIcon>
              {settings.density === option.value && <CheckIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          onClick={() =>
            onSettingsChange((currentSettings) => ({
              ...currentSettings,
              showColumnBorders: !currentSettings.showColumnBorders,
            }))
          }
        >
          <ListItemIcon>
            {settings.showColumnBorders && <CheckIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>Show column borders</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() =>
            onSettingsChange((currentSettings) => ({
              ...currentSettings,
              showCellBorders: !currentSettings.showCellBorders,
            }))
          }
        >
          <ListItemIcon>
            {settings.showCellBorders && <CheckIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>Show cell borders</ListItemText>
        </MenuItem>
      </Menu>
    </Grid.Toolbar.Root>
  );
}

export default function GridToolbarSettingsMenu() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });
  const [settings, setSettings] = React.useState({
    density: 'standard',
    showCellBorders: false,
    showColumnBorders: false,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        density={settings.density}
        showCellVerticalBorder={settings.showCellBorders}
        showColumnVerticalBorder={settings.showColumnBorders}
        slots={{ toolbar: Toolbar }}
        slotProps={{
          toolbar: {
            settings,
            onSettingsChange: setSettings,
          },
        }}
      />
    </div>
  );
}
