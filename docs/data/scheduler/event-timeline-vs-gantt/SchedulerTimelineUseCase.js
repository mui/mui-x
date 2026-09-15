import * as React from 'react';

import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';

const resources = [
  { id: 'room-a', title: 'Room A' },
  { id: 'room-b', title: 'Room B' },
  { id: 'mri', title: 'MRI scanner' },
];

const initialEvents = [
  {
    id: 1,
    title: 'Patient intake',
    start: '2025-07-01T08:00:00',
    end: '2025-07-01T09:30:00',
    resource: 'room-a',
  },
  {
    id: 2,
    title: 'Procedure block',
    start: '2025-07-01T09:45:00',
    end: '2025-07-01T12:15:00',
    resource: 'room-a',
  },
  {
    id: 3,
    title: 'Recovery prep',
    start: '2025-07-01T12:30:00',
    end: '2025-07-01T14:00:00',
    resource: 'room-a',
  },
  {
    id: 4,
    title: 'Follow-up visits',
    start: '2025-07-01T14:15:00',
    end: '2025-07-01T17:00:00',
    resource: 'room-a',
  },
  {
    id: 5,
    title: 'Consultations',
    start: '2025-07-01T08:30:00',
    end: '2025-07-01T11:00:00',
    resource: 'room-b',
  },
  {
    id: 6,
    title: 'Care team sync',
    start: '2025-07-01T11:15:00',
    end: '2025-07-01T12:00:00',
    resource: 'room-b',
  },
  {
    id: 7,
    title: 'Training session',
    start: '2025-07-01T13:00:00',
    end: '2025-07-01T15:30:00',
    resource: 'room-b',
  },
  {
    id: 8,
    title: 'Evening handoff',
    start: '2025-07-01T16:00:00',
    end: '2025-07-01T17:00:00',
    resource: 'room-b',
  },
  {
    id: 9,
    title: 'Maintenance window',
    start: '2025-07-01T08:00:00',
    end: '2025-07-01T09:00:00',
    resource: 'mri',
  },
  {
    id: 10,
    title: 'Scan block A',
    start: '2025-07-01T09:15:00',
    end: '2025-07-01T11:45:00',
    resource: 'mri',
  },
  {
    id: 11,
    title: 'Imaging appointments',
    start: '2025-07-01T12:00:00',
    end: '2025-07-01T14:30:00',
    resource: 'mri',
  },
  {
    id: 12,
    title: 'Scan block B',
    start: '2025-07-01T15:00:00',
    end: '2025-07-01T17:30:00',
    resource: 'mri',
  },
];

export default function SchedulerTimelineUseCase() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: 360, width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        onEventsChange={setEvents}
        resources={resources}
        defaultVisibleDate={new Date('2025-07-01T00:00:00')}
        defaultPreset="dayAndHour"
        presets={['dayAndHour']}
      />
    </div>
  );
}
