import * as React from 'react';
import { setHours } from 'date-fns/setHours';
import { setMinutes } from 'date-fns/setMinutes';
import { addDays } from 'date-fns/addDays';

import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { defaultVisibleDate } from '../datasets/personal-agenda';

const initialEvents = [
  {
    id: 'event-1',
    start: setMinutes(setHours(defaultVisibleDate, 9), 0),
    end: setMinutes(setHours(defaultVisibleDate, 10), 0),
    title: 'Regular Meeting',
  },
  {
    id: 'event-2',
    start: setMinutes(setHours(defaultVisibleDate, 11), 0),
    end: setMinutes(setHours(defaultVisibleDate, 12), 0),
    title: 'Important Meeting',
    className: 'highlighted-event',
  },
  {
    id: 'event-3',
    start: setMinutes(setHours(defaultVisibleDate, 14), 0),
    end: setMinutes(setHours(defaultVisibleDate, 15), 30),
    title: 'Project Review',
    className: 'striped-event',
  },
  {
    id: 'event-4',
    start: setMinutes(setHours(addDays(defaultVisibleDate, 1), 10), 0),
    end: setMinutes(setHours(addDays(defaultVisibleDate, 1), 11), 0),
    title: 'Team Standup',
  },
  {
    id: 'event-5',
    start: setMinutes(setHours(addDays(defaultVisibleDate, 1), 13), 0),
    end: setMinutes(setHours(addDays(defaultVisibleDate, 1), 14), 0),
    title: 'Urgent Task',
    className: 'highlighted-event',
  },
];

export default function ClassNameProperty() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <style>
        {`
          .highlighted-event {
            outline: 2px dashed #1976d2 !important;
            outline-offset: -2px;
          }
          .striped-event {
            background-image: repeating-linear-gradient(
              45deg,
              transparent,
              transparent 5px,
              rgba(0, 0, 0, 0.05) 5px,
              rgba(0, 0, 0, 0.05) 10px
            ) !important;
          }
        `}
      </style>
      <EventCalendar
        events={events}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultPreferences={{ isSidePanelOpen: false }}
      />
    </div>
  );
}
