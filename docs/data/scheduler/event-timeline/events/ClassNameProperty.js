import * as React from 'react';

import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { defaultVisibleDate } from '../../datasets/company-roadmap';

const initialEvents = [
  {
    id: 'event-1',
    start: '2025-07-02T00:00:00',
    end: '2025-07-02T00:00:00',
    allDay: true,
    title: 'Regular Meeting',
    resource: 'room-1',
  },
  {
    id: 'event-2',
    start: '2025-07-02T00:00:00',
    end: '2025-07-02T00:00:00',
    allDay: true,
    title: 'Important Meeting',
    className: 'highlighted-event',
    resource: 'room-2',
  },
  {
    id: 'event-3',
    start: '2025-07-03T00:00:00',
    end: '2025-07-03T00:00:00',
    allDay: true,
    title: 'Project Review',
    className: 'striped-event',
    resource: 'room-1',
  },
  {
    id: 'event-4',
    start: '2025-07-03T00:00:00',
    end: '2025-07-03T00:00:00',
    allDay: true,
    title: 'Team Standup',
    resource: 'room-2',
  },
  {
    id: 'event-5',
    start: '2025-07-04T00:00:00',
    end: '2025-07-04T00:00:00',
    allDay: true,
    title: 'Urgent Task',
    className: 'highlighted-event',
    resource: 'room-1',
  },
];

const resources = [
  { id: 'room-1', title: 'Room 1' },
  { id: 'room-2', title: 'Room 2' },
];

export default function ClassNameProperty() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
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
      <EventTimelinePremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultView="days"
      />
    </div>
  );
}
