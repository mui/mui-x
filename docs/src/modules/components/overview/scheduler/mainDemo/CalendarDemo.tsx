import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import InfoCard from '../../InfoCard';
import { calendarEvents, calendarResources, calendarDefaultVisibleDate } from './data';
import {
  CustomThemeName,
  DemoThemeSelector,
  SchedulerDemoThemeProvider,
} from './DemoThemeSelector';

const calendarPlanHighlights = [
  {
    title: 'Community',
    icon: <img src="/static/x/community.svg" width={16} height={16} alt="" />,
    description:
      'MIT-licensed Event Calendar with day, week, month, and agenda views. Includes resources, event creation, editing, drag and drop, resizing, and read-only rules.',
  },
  {
    title: 'Premium',
    icon: <img src="/static/x/premium.svg" width={16} height={16} alt="" />,
    description:
      'Adds recurring events and lazy loading through data sources. Use EventCalendarPremium when calendar workflows need commercial Scheduler features.',
  },
];

export default function CalendarDemo() {
  const [selectedTheme, setSelectedTheme] = React.useState<CustomThemeName>('default');
  const [calendarEventsState, setCalendarEventsState] =
    React.useState<SchedulerEvent[]>(calendarEvents);

  return (
    <Stack spacing={2.5} sx={{ p: 1, width: '100%', mb: 6 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ maxWidth: { xs: '500px', md: '100%' } }}
      >
        {calendarPlanHighlights.map(({ title, description, icon }) => (
          <Box sx={{ flexBasis: '50%' }} key={title}>
            <InfoCard
              title={title}
              description={description}
              icon={icon}
              backgroundColor="subtle"
              link="https://mui.com/pricing/"
            />
          </Box>
        ))}
      </Stack>

      <SchedulerDemoThemeProvider selectedTheme={selectedTheme}>
        <Paper
          elevation={0}
          sx={{
            height: 660,
            width: '100%',
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
            <DemoThemeSelector
              ariaLabel="Calendar demo theme"
              selectedTheme={selectedTheme}
              onThemeChange={(event) => {
                setSelectedTheme(event.target.value as CustomThemeName);
              }}
            />
          </Stack>
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
    </Stack>
  );
}
