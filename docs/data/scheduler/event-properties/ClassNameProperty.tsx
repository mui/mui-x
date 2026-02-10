import * as React from 'react';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { defaultVisibleDate } from '../datasets/personal-agenda';

const initialEvents: SchedulerEvent[] = [
  {
    id: 'event-1',
    start: '2025-07-01T09:00:00',
    end: '2025-07-01T10:00:00',
    title: 'Regular Meeting',
  },
  {
    id: 'event-2',
    start: '2025-07-01T11:00:00',
    end: '2025-07-01T12:00:00',
    title: 'Important Meeting',
    className: 'highlighted-event',
  },
  {
    id: 'event-3',
    start: '2025-07-01T14:00:00',
    end: '2025-07-01T15:30:00',
    title: 'Project Review',
    className: 'striped-event',
  },
  {
    id: 'event-4',
    start: '2025-07-02T10:00:00',
    end: '2025-07-02T11:00:00',
    title: 'Team Standup',
  },
  {
    id: 'event-5',
    start: '2025-07-02T13:00:00',
    end: '2025-07-02T14:00:00',
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
