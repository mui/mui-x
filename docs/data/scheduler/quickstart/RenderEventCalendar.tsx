import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { SchedulerEvent } from '@mui/x-scheduler/models';

const events: SchedulerEvent[] = [
  {
    id: 1,
    title: 'Team Meeting',
    start: new Date(2024, 0, 15, 10, 0),
    end: new Date(2024, 0, 15, 11, 0),
  },
  {
    id: 2,
    title: 'Project Review',
    start: new Date(2024, 0, 16, 14, 0),
    end: new Date(2024, 0, 16, 15, 30),
  },
  {
    id: 3,
    title: 'Client Call',
    start: new Date(2024, 0, 17, 9, 0),
    end: new Date(2024, 0, 17, 10, 0),
  },
];

export default function RenderEventCalendar() {
  return (
    <div style={{ height: 600, width: '100%' }}>
      <EventCalendar events={events} defaultVisibleDate={new Date(2024, 0, 15)} />
    </div>
  );
}
