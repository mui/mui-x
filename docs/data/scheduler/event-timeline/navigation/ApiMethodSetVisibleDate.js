import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { useEventCalendarApiRef } from '@mui/x-scheduler/use-event-calendar-api-ref';
import {
  initialEvents,
  resources,
  defaultVisibleDate,
} from '../../datasets/company-roadmap';

export default function ApiMethodSetVisibleDate() {
  const [events, setEvents] = React.useState(initialEvents);
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
      <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
        <EventTimelinePremium
          // apiRef={apiRef} TODO: Uncomment when the `apiRef` prop is added to the `EventTimelinePremium` component.
          events={events}
          resources={resources}
          defaultVisibleDate={defaultVisibleDate}
          onEventsChange={setEvents}
          defaultView="months"
        />
      </div>
    </Stack>
  );
}
