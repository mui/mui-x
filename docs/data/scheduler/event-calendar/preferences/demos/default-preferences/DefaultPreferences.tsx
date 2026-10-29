import * as React from 'react';
import type {
  EventCalendarPreferences,
  SchedulerEvent,
} from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import {
  initialEvents,
  resources,
  defaultVisibleDate,
} from '../../../../datasets/personal-agenda';

const defaultPreferences: Partial<EventCalendarPreferences> = {
  ampm: false,
  showWeekends: false,
  isSidePanelOpen: false,
};

export default function DefaultPreferences() {
  // @focus-start @padding 1
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        resources={resources}
        defaultPreferences={defaultPreferences}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      />
    </div>
  );
  // @focus-end
}
