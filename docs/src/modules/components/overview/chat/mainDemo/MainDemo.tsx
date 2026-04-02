import * as React from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { getSoftEdgesTheme } from '../theme/softEdgesTheme';
import { getNeutralVibesTheme } from '../theme/neutralVibesTheme';
import { darkGrey } from '../theme/colors';
import ViewToggleGroup, { ChatView } from './ViewToggleGroup';
import MessengerDemo from './MessengerDemo';
import AgentDemo from './AgentDemo';
import CaptionsDemo from './CaptionsDemo';
import WidgetDemo from './WidgetDemo';

type CustomThemeName = 'default' | 'softEdges' | 'neutralVibes';

// Use CSS variables to avoid first load light/dark blink.
const darkThemeManagement = {
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'data-mui-color-scheme',
  },
};

const themeOptions: { value: CustomThemeName; label: string }[] = [
  { value: 'default', label: 'Default theme' },
  { value: 'softEdges', label: 'Soft edges' },
  { value: 'neutralVibes', label: 'Neutral vibes' },
];

export default function MainDemo() {
  const brandingTheme = useTheme();
  const [selectedView, setSelectedView] = React.useState<ChatView>('messenger');
  const [selectedTheme, setSelectedTheme] = React.useState<CustomThemeName>('softEdges');

  const handleThemeChange = (event: SelectChangeEvent) => {
    setSelectedTheme(event.target.value as CustomThemeName);
  };

  const mode = selectedView === 'captions' ? 'dark' : brandingTheme.palette.mode;
  const baseTheme = createTheme(darkThemeManagement, { palette: { mode } });
  const softEdgesTheme = getSoftEdgesTheme(mode);
  const neutralVibesTheme = getNeutralVibesTheme(mode);

  const getThemeByName = (name: CustomThemeName) => {
    switch (name) {
      case 'softEdges':
        return softEdgesTheme;
      case 'neutralVibes':
        return neutralVibesTheme;
      default:
        return baseTheme;
    }
  };

  // CaptionsDemo always uses dark mode to match Google Meet style,
  // but still respects the selected custom theme (softEdges, neutralVibes, etc.)
  const getDarkThemeByName = (name: CustomThemeName) => {
    switch (name) {
      case 'softEdges':
        return getSoftEdgesTheme('dark');
      case 'neutralVibes':
        return getNeutralVibesTheme('dark');
      default:
        return createTheme(darkThemeManagement, {
          palette: {
            mode: 'dark',
            grey: darkGrey,
            text: { primary: darkGrey[900], secondary: darkGrey[700] },
            background: { default: darkGrey[50], paper: '#121113' },
          },
        });
    }
  };

  return (
    <Stack spacing={1} sx={{ p: 1, width: '100%', mb: 6 }}>
      {/* Toolbar: view toggle + theme selector */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
      >
        <ViewToggleGroup selected={selectedView} onToggleChange={setSelectedView} />
        <Select
          value={selectedTheme}
          defaultValue="default"
          onChange={handleThemeChange}
          size="small"
          sx={{ minWidth: 140 }}
        >
          {themeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <ThemeProvider theme={getThemeByName(selectedTheme)}>
        {selectedView === 'messenger' && (
          <Paper variant="outlined" elevation={0} sx={{ height: 600, width: '100%' }}>
            <MessengerDemo />
          </Paper>
        )}

        {selectedView === 'agent' && (
          <Paper variant="outlined" elevation={0} sx={{ height: 600, width: '100%' }}>
            <AgentDemo />
          </Paper>
        )}

        {selectedView === 'widget' && (
          <Paper
            variant="outlined"
            elevation={0}
            sx={{ height: 760, width: '100%', position: 'relative', overflow: 'hidden' }}
          >
            <WidgetDemo />
          </Paper>
        )}

        {selectedView === 'captions' && (
          <ThemeProvider theme={getDarkThemeByName(selectedTheme)}>
            <Paper
              variant="outlined"
              elevation={0}
              sx={{ height: 600, width: '100%', overflow: 'hidden' }}
            >
              <CaptionsDemo />
            </Paper>
          </ThemeProvider>
        )}
      </ThemeProvider>
    </Stack>
  );
}
