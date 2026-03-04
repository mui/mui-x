import * as React from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import ViewToggleGroup, { SchedulerView } from './ViewToggleGroup';
import TimelineDemo from './TimelineDemo';
import { calendarEvents, calendarResources, calendarDefaultVisibleDate } from './data';
import { getSoftEdgesTheme } from '../theme/softEdgesTheme';
import { getNeutralVibesTheme } from '../theme/neutralVibesTheme';

type CustomThemeName = 'default' | 'softEdges' | 'neutralVibes';

const themeOptions: { value: CustomThemeName; label: string }[] = [
  { value: 'default', label: 'Default theme' },
  { value: 'softEdges', label: 'Soft edges' },
  { value: 'neutralVibes', label: 'Neutral vibes' },
];

export default function MainDemo() {
  const brandingTheme = useTheme();

  const [selectedView, setSelectedView] = React.useState<SchedulerView>('calendar');
  const [selectedTheme, setSelectedTheme] = React.useState<CustomThemeName>('default');
  const [calendarEventsState, setCalendarEventsState] =
    React.useState<SchedulerEvent[]>(calendarEvents);

  const handleThemeChange = (event: SelectChangeEvent) => {
    setSelectedTheme(event.target.value as CustomThemeName);
  };

  const mode = brandingTheme.palette.mode;

  const theme = React.useMemo(() => {
    const baseTheme = createTheme({ palette: { mode } });

    switch (selectedTheme) {
      case 'softEdges':
        return getSoftEdgesTheme(mode);
      case 'neutralVibes':
        return getNeutralVibesTheme(mode);
      default:
        return baseTheme;
    }
  }, [mode, selectedTheme]);

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
      <ThemeProvider theme={theme}>
        {/* Demo content */}
        {selectedView === 'calendar' && (
          <Paper variant="outlined" elevation={0} sx={{ height: 600, width: '100%', p: 1 }}>
            <EventCalendarPremium
              events={calendarEventsState}
              onEventsChange={setCalendarEventsState}
              resources={calendarResources}
              defaultVisibleDate={calendarDefaultVisibleDate}
              defaultView="month"
              defaultPreferences={{ isSidePanelOpen: false }}
              areEventsDraggable
              areEventsResizable
            />
          </Paper>
        )}

        {selectedView === 'timeline' && <TimelineDemo />}
      </ThemeProvider>
    </Stack>
  );
}
