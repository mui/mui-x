import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { defaultVisibleDate } from '../datasets/personal-agenda';

const initialEvents = [
  {
    id: 'work-daily-standup',
    start: '2025-07-02T09:00:00',
    end: '2025-07-02T09:30:00',
    title: 'Daily Standup',
    rrule: { freq: 'WEEKLY', interval: 1, byDay: ['MO', 'TU', 'WE', 'TH', 'FR'] },
  },
  {
    id: 'work-retro',
    start: '2025-07-02T16:00:00',
    end: '2025-07-02T17:00:00',
    title: 'Team Retrospective',
    rrule: { freq: 'WEEKLY', interval: 2, byDay: ['TU'] },
  },
];

const eventModelStructure = {
  start: {
    getter: (event) => event.start,
    setter: (event, newValue) => {
      event.start = newValue;
      return event;
    },
  },
  end: {
    getter: (event) => event.end,
    setter: (event, newValue) => {
      event.end = newValue;
      return event;
    },
  },
};

export default function StartEndProperties() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        eventModelStructure={eventModelStructure}
        defaultPreferences={{ isSidePanelOpen: false }}
      />
    </div>
  );
}
