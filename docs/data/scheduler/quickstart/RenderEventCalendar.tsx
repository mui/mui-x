import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { SchedulerEvent } from '@mui/x-scheduler/models';

const events: SchedulerEvent[] = [
  {
    id: 1,
    title: 'Team Meeting',
    start: '2024-01-15T10:00:00',
    end: '2024-01-15T11:00:00',
  },
  {
    id: 2,
    title: 'Project Review',
    start: '2024-01-16T14:00:00',
    end: '2024-01-16T15:30:00',
  },
  {
    id: 3,
    title: 'Client Call',
    start: '2024-01-17T09:00:00',
    end: '2024-01-17T10:00:00',
  },
];

export default function RenderEventCalendar() {
  return (
    <div style={{ height: 600, width: '100%' }}>
      <EventCalendar events={events} defaultVisibleDate={new Date(2024, 0, 15)} />
    </div>
  );
}
