import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { calendarEvents, calendarResources, calendarDefaultVisibleDate } from './data';
import {
  CustomThemeName,
  DemoThemeSelector,
  SchedulerDemoThemeProvider,
} from './DemoThemeSelector';
import LicenseCard from '../LicenseCard';

export default function CalendarDemo() {
  const [selectedTheme, setSelectedTheme] = React.useState<CustomThemeName>('default');
  const [calendarEventsState, setCalendarEventsState] =
    React.useState<SchedulerEvent[]>(calendarEvents);

  return (
    <Stack spacing={2.5} sx={{ width: '100%', mb: 6 }}>
      <Stack direction="row" sx={{ justifyContent: 'flex-start' }}>
        <DemoThemeSelector
          ariaLabel="Calendar demo theme"
          selectedTheme={selectedTheme}
          onThemeChange={(event) => {
            setSelectedTheme(event.target.value as CustomThemeName);
          }}
        />
      </Stack>
      <SchedulerDemoThemeProvider selectedTheme={selectedTheme}>
        <Paper
          elevation={0}
          sx={{
            height: 660,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Box sx={{ minHeight: 0, flexGrow: 1 }}>
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
          </Box>
        </Paper>
      </SchedulerDemoThemeProvider>
      <Stack direction="row" spacing={2} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
        <LicenseCard
          plan="community"
          title="Community features"
          description="Free forever under MIT. Everything you need for everyday calendar workflows: multiple views, resources, drag and drop, resizing, and full theming."
        />
        <LicenseCard
          plan="premium"
          title="Premium features"
          description="Adds recurring events, exception dates, DST-aware recurrence, and lazy loading through data sources. Same API as Community, so upgrading is a one-line change."
        />
      </Stack>
    </Stack>
  );
}
