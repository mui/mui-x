import * as React from 'react';
import { DateTime } from 'luxon';
import { DayGrid } from '@mui/x-scheduler/primitives/day-grid';
import { useWeekList } from '@mui/x-scheduler/primitives/use-week-list';
import { useDayList } from '@mui/x-scheduler/primitives/use-day-list';
import classes from './DayGridPrimitives.module.css';

const events = [
  {
    id: '1',
    start: DateTime.fromISO('2025-05-26T07:30:00'),
    end: DateTime.fromISO('2025-05-26T08:15:00'),
    title: 'Footing',
    resource: 'personal',
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
    resource: 'personal',
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
    resource: 'personal',
  },
  {
    id: '7',
    start: DateTime.fromISO('2025-05-30T15:00:00'),
    end: DateTime.fromISO('2025-05-30T15:45:00'),
    title: 'Retrospective',
    resource: 'work',
  },
];

export default function DayGridPrimitives() {
  const getWeekList = useWeekList();
  const getDayList = useDayList();

  const weeks = React.useMemo(
    () =>
      getWeekList({
        date: events[0].start.startOf('month'),
        amount: 'end-of-month',
      }).map((week) =>
        getDayList({ date: week, amount: 7 }).map((date) => ({
          date,
          events: events.filter(
            (event) =>
              event.start.hasSame(date, 'day') || event.end.hasSame(date, 'day'),
          ),
        })),
      ),
    [getWeekList],
  );

  return (
    <div className={classes.Container}>
      <DayGrid.Root className={classes.Root}>
        {weeks.map((week) => (
          <DayGrid.Row key={week[0].date.toString()} className={classes.Row}>
            {week.map((day) => (
              <DayGrid.Cell key={day.date.toString()} className={classes.Cell}>
                <span className={classes.CellLabel}>{day.date.toFormat('dd')}</span>
                {day.events.map((event) => (
                  <DayGrid.Event
                    key={event.id}
                    start={event.start}
                    end={event.end}
                    className={classes.Event}
                  >
                    <span
                      className={classes.EventChip}
                      data-resource={event.resource}
                    />
                    <span className={classes.EventLabel}>{event.title}</span>
                  </DayGrid.Event>
                ))}
              </DayGrid.Cell>
            ))}
          </DayGrid.Row>
        ))}
      </DayGrid.Root>
    </div>
  );
}
