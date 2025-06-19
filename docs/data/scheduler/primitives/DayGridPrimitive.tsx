import * as React from 'react';
import { DateTime } from 'luxon';
import { DayGrid } from '@mui/x-scheduler/primitives/day-grid';
import { useWeekList } from '@mui/x-scheduler/primitives/use-week-list';
import { useDayList } from '@mui/x-scheduler/primitives/use-day-list';
import classes from './DayGridPrimitive.module.css';
import { events, Event } from './day-grid-events';

export default function DayGridPrimitive() {
  const getWeekList = useWeekList();
  const getDayList = useDayList();

  const weeks = React.useMemo(() => {
    const weeksFirstDays = getWeekList({
      date: events[0].start.startOf('month'),
      amount: 'end-of-month',
    });

    const tempWeeks: { date: DateTime; events: Event[] }[][] = [];
    for (let i = 0; i < weeksFirstDays.length; i += 1) {
      const weekStart = weeksFirstDays[i];
      const weekDays = getDayList({ date: weekStart, amount: 7 });
      const weekDaysWithEvents = weekDays.map((date) => ({
        date,
        events: events.filter((event) => event.start.hasSame(date, 'day')),
      }));
      tempWeeks.push(weekDaysWithEvents);
    }

    return tempWeeks;
  }, [getWeekList, getDayList]);

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
