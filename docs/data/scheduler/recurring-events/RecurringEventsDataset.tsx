import * as React from 'react';
import Box from '@mui/material/Box';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda-rrule';

export default function RecurringEventsDataset() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <Box sx={{ height: 600, width: '100%', px: { xs: 2, md: 0 } }}>
      <EventCalendarPremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultPreferences={{ isSidePanelOpen: false }}
      />
    </Box>
  );
}
