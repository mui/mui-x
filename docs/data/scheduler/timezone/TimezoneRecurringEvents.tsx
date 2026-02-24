import * as React from 'react';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import {
  defaultVisibleDate,
  initialEvents,
  resources,
} from '../datasets/timezone-instant-based-events';

export default function TimezoneRecurringEvents() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendarPremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultPreferences={{ isSidePanelOpen: false }}
        displayTimezone="Europe/Paris"
        areEventsDraggable
        areEventsResizable
      />
    </div>
  );
}
