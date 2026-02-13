import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { useEventCalendarApiRef } from '@mui/x-scheduler/use-event-calendar-api-ref';
import {
  initialEvents,
  resources,
  defaultVisibleDate,
} from '../../datasets/personal-agenda';

export default function ApiMethodSetVisibleDate() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);
  const apiRef = useEventCalendarApiRef();

  return (
    <Stack spacing={2} sx={{ width: '100%', alignItems: 'flex-start' }}>
      <Button
        variant="contained"
        onClick={(event) =>
          apiRef.current?.setVisibleDate({ visibleDate: new Date(), event })
        }
      >
        Navigate to today
      </Button>
      <div style={{ height: '600px', width: '100%' }}>
        <EventCalendar
          apiRef={apiRef}
          events={events}
          resources={resources}
          defaultVisibleDate={defaultVisibleDate}
          onEventsChange={setEvents}
          defaultPreferences={{ isSidePanelOpen: false }}
        />
      </div>
    </Stack>
  );
}
