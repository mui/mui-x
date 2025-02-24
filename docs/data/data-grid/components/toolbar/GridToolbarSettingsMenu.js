import * as React from 'react';
import { DataGrid, Toolbar, ToolbarButton } from '@mui/x-data-grid';
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
  { label: 'Compact density', value: 'compact' },
  { label: 'Standard density', value: 'standard' },
  { label: 'Comfortable density', value: 'comfortable' },
];

const SETTINGS_STORAGE_KEY = 'mui-data-grid-settings';

const SETTINGS_DEFAULT = {
  density: 'standard',
  showCellBorders: false,
  showColumnBorders: false,
};

const getInitialSettings = () => {
  try {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return storedSettings ? JSON.parse(storedSettings) : SETTINGS_DEFAULT;
  } catch (error) {
    return SETTINGS_DEFAULT;
  }
};

function CustomToolbar(props) {
  const { settings, onSettingsChange } = props;
  const [settingsMenuOpen, setSettingsMenuOpen] = React.useState(false);
  const settingsMenuTriggerRef = React.useRef(null);

  return (
    <Toolbar>
      <Tooltip title="Settings">
        <ToolbarButton
          ref={settingsMenuTriggerRef}
          id="settings-menu-trigger"
          aria-controls="settings-menu"
          aria-haspopup="true"
          aria-expanded={settingsMenuOpen ? 'true' : undefined}
          onClick={() => setSettingsMenuOpen(true)}
        >
          <SettingsIcon fontSize="small" sx={{ ml: 'auto' }} />
        </ToolbarButton>
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
    </Toolbar>
  );
}

export default function GridToolbarSettingsMenu() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  const [settings, setSettings] = React.useState(getInitialSettings());

  React.useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        density={settings.density}
        showCellVerticalBorder={settings.showCellBorders}
        showColumnVerticalBorder={settings.showColumnBorders}
        slots={{ toolbar: CustomToolbar }}
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
