import * as React from 'react';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { useEventTimelinePremiumApiRef } from '@mui/x-scheduler-premium/use-event-timeline-premium-api-ref';
import { EventTimelinePremiumView } from '@mui/x-scheduler-headless-premium/models';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { timelineEvents, timelineResources, timelineDefaultVisibleDate } from './data';

const viewOptions: EventTimelinePremiumView[] = ['time', 'days', 'weeks', 'months', 'years'];

export default function TimelineDemo() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(timelineEvents);
  const [view, setView] = React.useState<EventTimelinePremiumView>('months');
  const apiRef = useEventTimelinePremiumApiRef();

  const handleViewChange = (event: SelectChangeEvent) => {
    setView(event.target.value as EventTimelinePremiumView);
  };

  return (
    <Paper
      variant="outlined"
      elevation={0}
      sx={{ height: 600, width: '100%', p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}
    >
      <Select value={view} onChange={handleViewChange} size="small" sx={{ width: 140 }}>
        {viewOptions.map((value) => (
          <MenuItem key={value} value={value}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </MenuItem>
        ))}
      </Select>

      <EventTimelinePremium
        apiRef={apiRef}
        events={events}
        onEventsChange={setEvents}
        resources={timelineResources}
        defaultVisibleDate={timelineDefaultVisibleDate}
        view={view}
        onViewChange={setView}
        areEventsResizable
        areEventsDraggable
      />
    </Paper>
  );
}
