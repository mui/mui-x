import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { useEventTimelinePremiumApiRef } from '@mui/x-scheduler-premium/use-event-timeline-premium-api-ref';
import { EventTimelinePremiumPreset } from '@mui/x-scheduler-internals-premium/models';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { timelineEvents, timelineResources, timelineDefaultVisibleDate } from './data';
import {
  CustomThemeName,
  DemoThemeSelector,
  SchedulerDemoThemeProvider,
} from './DemoThemeSelector';
import LicenseCard from '../LicenseCard';

const presetOptions: { value: EventTimelinePremiumPreset; label: string }[] = [
  { value: 'dayAndHour', label: 'Time' },
  { value: 'dayAndMonth', label: 'Days' },
  { value: 'dayAndWeek', label: 'Weeks' },
  { value: 'monthAndYear', label: 'Months' },
  { value: 'year', label: 'Years' },
];

export default function TimelineDemo() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(timelineEvents);
  const [preset, setPreset] = React.useState<EventTimelinePremiumPreset>('monthAndYear');
  const [selectedTheme, setSelectedTheme] = React.useState<CustomThemeName>('default');
  const apiRef = useEventTimelinePremiumApiRef();

  const handlePresetChange = (event: SelectChangeEvent) => {
    setPreset(event.target.value as EventTimelinePremiumPreset);
  };

  return (
    <Stack>
      <SchedulerDemoThemeProvider selectedTheme={selectedTheme}>
        <Stack spacing={1} sx={{ height: 600, width: '100%', mb: 6 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <DemoThemeSelector
              ariaLabel="Timeline demo theme"
              selectedTheme={selectedTheme}
              onThemeChange={(event) => {
                setSelectedTheme(event.target.value as CustomThemeName);
              }}
            />
            <Select
              aria-label="Timeline scale"
              value={preset}
              onChange={handlePresetChange}
              size="small"
              sx={{ width: 140 }}
            >
              {presetOptions.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </Stack>

          <Box sx={{ minHeight: 0, flexGrow: 1 }}>
            <EventTimelinePremium
              apiRef={apiRef}
              events={events}
              onEventsChange={setEvents}
              resources={timelineResources}
              defaultVisibleDate={timelineDefaultVisibleDate}
              preset={preset}
              onPresetChange={setPreset}
              areEventsResizable
              areEventsDraggable
            />
          </Box>
        </Stack>
      </SchedulerDemoThemeProvider>
      <Stack direction="row" spacing={2} sx={{ flexDirection: { xs: 'column', md: 'row' }, mb: 6 }}>
        <LicenseCard
          plan="premium"
          title="Premium-only component"
          description="A horizontal, gantt-style view for representing events as continuous bars across resources. Included with any Scheduler Premium license, no separate purchase."
        />
      </Stack>
    </Stack>
  );
}
