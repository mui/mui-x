import * as React from 'react';
import { DateTime } from 'luxon';
import { CalendarEvent, CalendarResource } from '@mui/x-scheduler/joy';
import { DayView } from '@mui/x-scheduler/joy/day-view';
import classes from './StandaloneWeekView.module.css';

const eventsList: CalendarEvent[] = [
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
];

const resources: CalendarResource[] = [
  { name: 'Work', id: 'work', color: 'red' },
  { name: 'Workout', id: 'workout', color: 'jade' },
];

export default function StandaloneDayView() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(eventsList);

  return (
    <DayView
      events={events}
      onEventsChange={setEvents}
      resources={resources}
      className={classes.Container}
      day={DateTime.fromISO('2025-05-26')}
    />
  );
}
