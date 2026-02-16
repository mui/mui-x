import * as React from 'react';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../datasets/personal-agenda';

export default function CustomLocaleTextCalendar() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        localeText={{
          today: 'Now',
          week: 'Weekly',
          month: 'Monthly',
          day: 'Daily',
          agenda: 'Schedule',
        }}
        defaultPreferences={{ isSidePanelOpen: false }}
      />
    </div>
  );
}
