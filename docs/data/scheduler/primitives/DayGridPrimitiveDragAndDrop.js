import * as React from 'react';

import { DayGrid } from '@mui/x-scheduler/primitives/day-grid';
import { useWeekList } from '@mui/x-scheduler/primitives/use-week-list';
import { useDayList } from '@mui/x-scheduler/primitives/use-day-list';

import classes from './DayGridPrimitive.module.css';
import { initialEvents } from './day-grid-events';

export default function DayGridPrimitiveDragAndDrop() {
  const [events, setEvents] = React.useState(initialEvents);
  const getWeekList = useWeekList();
  const getDayList = useDayList();

  const weeks = React.useMemo(() => {
    const weeksFirstDays = getWeekList({
      date: events[0].start.startOf('month'),
      amount: 'end-of-month',
    });

    const tempWeeks = [];
    for (let i = 0; i < weeksFirstDays.length; i += 1) {
      const weekStart = weeksFirstDays[i];
      const weekDays = getDayList({ date: weekStart, amount: 'week' });
      const weekDaysWithEvents = weekDays.map((date) => ({
        date,
        events: events.filter((event) => event.start.hasSame(date, 'day')),
      }));
      tempWeeks.push(weekDaysWithEvents);
    }

    return tempWeeks;
  }, [events, getWeekList, getDayList]);

  const handleEventChange = React.useCallback((eventData) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventData.eventId
          ? { ...event, start: eventData.start, end: eventData.end }
          : event,
      ),
    );
  }, []);

  return (
    <div className={classes.Container}>
      <DayGrid.Root className={classes.Root} onEventChange={handleEventChange}>
        {weeks.map((week) => (
          <DayGrid.Row
            key={week[0].date.toString()}
            start={week[0].date.startOf('day')}
            end={week[6].date.endOf('day')}
            className={classes.Row}
          >
            {week.map((day) => (
              <DayGridCell
                key={day.date.toString()}
                day={day.date}
                events={day.events}
                allEvents={events}
              />
            ))}
          </DayGrid.Row>
        ))}
      </DayGrid.Root>
    </div>
  );
}

function DayGridCell({ day, events, allEvents }) {
  const placeholder = DayGrid.usePlaceholderInDay(day);

  const placeholderEvent =
    placeholder == null
      ? undefined
      : allEvents.find((calendarEvent) => calendarEvent.id === placeholder.eventId);

  return (
    <DayGrid.Cell className={classes.Cell} value={day}>
      <span className={classes.CellLabel}>{day.toFormat('dd')}</span>
      <div className={classes.CellEvents}>
        {events.map((event) => (
          <DayGrid.Event
            key={event.id}
            eventId={event.id}
            start={event.start}
            end={event.end}
            className={classes.Event}
            isDraggable
          >
            <span className={classes.EventChip} data-resource={event.resource} />
            <span className={classes.EventLabel}>{event.title}</span>
          </DayGrid.Event>
        ))}
        {placeholderEvent != null && placeholder != null && (
          <DayGrid.EventPlaceholder
            data-resource={placeholderEvent.resource}
            className={classes.Event}
          >
            <span
              className={classes.EventChip}
              data-resource={placeholderEvent.resource}
            />
            <span className={classes.EventLabel}>{placeholderEvent.title}</span>
          </DayGrid.EventPlaceholder>
        )}
      </div>
    </DayGrid.Cell>
  );
}
