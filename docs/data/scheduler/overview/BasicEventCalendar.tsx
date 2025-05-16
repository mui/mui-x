import * as React from 'react';
import { DateTime, WeekdayNumbers, MinuteNumbers, HourNumbers } from 'luxon';
import { EventCalendar } from '@mui/x-scheduler/joy/event-calendar';
import { CalendarEvent } from '@mui/x-scheduler/joy/models/events';

const startOfWeek = DateTime.now().startOf('week');
const createDate = (
  weekday: WeekdayNumbers,
  hour: HourNumbers,
  minute: MinuteNumbers,
) => {
  return startOfWeek.set({ weekday, hour, minute });
};

const events: CalendarEvent[] = [
  {
    id: '1',
    start: createDate(1, 7, 30),
    end: createDate(1, 8, 15),
    title: 'Footing',
  },
  {
    id: '2',
    start: createDate(1, 16, 0),
    end: createDate(1, 17, 0),
    title: 'Weekly',
  },
  {
    id: '3',
    start: createDate(2, 10, 0),
    end: createDate(2, 11, 0),
    title: 'Backlog grooming',
  },
  {
    id: '4',
    start: createDate(2, 19, 0),
    end: createDate(2, 22, 0),
    title: 'Pizza party',
  },
  {
    id: '5',
    start: createDate(3, 8, 0),
    end: createDate(3, 17, 0),
    title: 'Scheduler deep dive',
  },
  {
    id: '1',
    start: createDate(4, 7, 30),
    end: createDate(4, 8, 15),
    title: 'Footing',
  },
  {
    id: '1',
    start: createDate(5, 15, 0),
    end: createDate(5, 15, 45),
    title: 'Retrospective',
  },
];

export default function BasicEventCalendar() {
  return <EventCalendar events={events} />;
}
