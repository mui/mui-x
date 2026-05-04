import * as React from 'react';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { useEventTimelinePremiumApiRef } from '@mui/x-scheduler-premium/use-event-timeline-premium-api-ref';
import { EventTimelinePremiumPreset } from '@mui/x-scheduler-headless-premium/models';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { timelineEvents, timelineResources, timelineDefaultVisibleDate } from './data';

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
  const apiRef = useEventTimelinePremiumApiRef();

  const handlePresetChange = (event: SelectChangeEvent) => {
    setPreset(event.target.value as EventTimelinePremiumPreset);
  };

  return (
    <Paper
      variant="outlined"
      elevation={0}
      sx={{ height: 600, width: '100%', p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}
    >
      <Select value={preset} onChange={handlePresetChange} size="small" sx={{ width: 140 }}>
        {presetOptions.map(({ value, label }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>

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
    </Paper>
  );
}
