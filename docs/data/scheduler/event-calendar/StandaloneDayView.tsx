import * as React from 'react';
import { DateTime } from 'luxon';
import { CalendarEvent } from '@mui/x-scheduler/joy';
import { DayView } from '@mui/x-scheduler/joy/day-view';
import classes from './StandaloneWeekView.module.css';

const events: CalendarEvent[] = [
  {
    id: '1',
    start: DateTime.fromISO('2025-05-26T07:30:00'),
    end: DateTime.fromISO('2025-05-26T08:15:00'),
    title: 'Footing',
  },
  {
    id: '2',
    start: DateTime.fromISO('2025-05-26T16:00:00'),
    end: DateTime.fromISO('2025-05-26T17:00:00'),
    title: 'Weekly',
  },
];

export default function StandaloneDayView() {
  return <DayView events={events} className={classes.Container} />;
}
