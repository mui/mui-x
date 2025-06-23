import * as React from 'react';
import { DateTime } from 'luxon';

import { WeekView } from '@mui/x-scheduler/joy/week-view';
import { StandaloneView } from '@mui/x-scheduler/joy/standalone-view';
import classes from './StandaloneWeekView.module.css';

const initialEvents = [
  {
    id: '1',
    start: DateTime.fromISO('2025-05-26T07:30:00'),
    end: DateTime.fromISO('2025-05-26T08:15:00'),
    title: 'Footing',
    resource: 'workout',
  },
  {
    id: '2',
    start: DateTime.fromISO('2025-05-26T16:00:00'),
    end: DateTime.fromISO('2025-05-26T17:00:00'),
    title: 'Weekly',
    resource: 'work',
  },
  {
    id: '3',
    start: DateTime.fromISO('2025-05-27T10:00:00'),
    end: DateTime.fromISO('2025-05-27T11:00:00'),
    title: 'Backlog grooming',
    resource: 'work',
  },
  {
    id: '4',
    start: DateTime.fromISO('2025-05-27T19:00:00'),
    end: DateTime.fromISO('2025-05-27T22:00:00'),
    title: 'Pizza party',
  },
  {
    id: '5',
    start: DateTime.fromISO('2025-05-28T08:00:00'),
    end: DateTime.fromISO('2025-05-28T17:00:00'),
    title: 'Scheduler deep dive',
    resource: 'work',
  },
  {
    id: '6',
    start: DateTime.fromISO('2025-05-29T07:30:00'),
    end: DateTime.fromISO('2025-05-29T08:15:00'),
    title: 'Footing',
    resource: 'workout',
  },
  {
    id: '7',
    start: DateTime.fromISO('2025-05-29T08:15:00'),
    end: DateTime.fromISO('2025-05-29T08:30:00'),
    title: 'Standup',
    resource: 'work',
  },
  {
    id: '8',
    start: DateTime.fromISO('2025-05-30T15:00:00'),
    end: DateTime.fromISO('2025-05-30T15:45:00'),
    title: 'Retrospective',
    resource: 'work',
  },
];

const resources = [
  { name: 'Work', id: 'work', color: 'red' },
  { name: 'Workout', id: 'workout', color: 'jade' },
];

export default function StandaloneWeekView() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <StandaloneView events={events} resources={resources}>
      <WeekView className={classes.Container} onEventsChange={setEvents} />
    </StandaloneView>
  );
}
