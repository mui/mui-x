'use client';
import * as React from 'react';
import { SchedulerValidDate } from '../../../../primitives/models';
import { TimeGrid } from '../../../../primitives/time-grid';
import { useAdapter } from '../../../../primitives/utils/adapter/useAdapter';
import { TimeGridEvent } from '../event/time-grid-event/TimeGridEvent';
import { isWeekend } from '../../utils/date-utils';
import { useSelector } from '../../../../base-ui-copy/utils/store';
import { useEventCalendarContext } from '../../hooks/useEventCalendarContext';
import { selectors } from '../../../event-calendar/store';
import { CalendarEvent } from '../../../models/events';
import { EventPopoverTrigger } from '../event-popover';
import './DayTimeGrid.css';

export function TimeGridColumn(props: TimeGridColumnProps) {
  const adapter = useAdapter();
  const { store } = useEventCalendarContext();
  const resourcesByIdMap = useSelector(store, selectors.resourcesByIdMap);
  const { date, events } = props;

  const { start, end } = React.useMemo(
    () => ({ start: adapter.startOfDay(date), end: adapter.endOfDay(date) }),
    [adapter, date],
  );

  const placeholder = TimeGrid.usePlaceholderInRange(start, end);
  const draggedEvent = useSelector(store, selectors.getEventById, placeholder?.id ?? null);

  const updatedDraggedEvent = React.useMemo(() => {
    if (!draggedEvent || !placeholder) {
      return null;
    }

    return { ...draggedEvent, start: placeholder.start, end: placeholder.end };
  }, [draggedEvent, placeholder]);

  return (
    <TimeGrid.Column
      start={start}
      end={end}
      className="DayTimeGridColumn"
      data-weekend={isWeekend(adapter, date) ? '' : undefined}
    >
      {events.map((event) => (
        <EventPopoverTrigger
          key={event.id}
          event={event}
          render={
            <TimeGridEvent
              event={event}
              eventResource={resourcesByIdMap.get(event.resource)}
              variant="regular"
              ariaLabelledBy={`DayTimeGridHeaderCell-${date.toString()}`}
            />
          }
        />
      ))}
      {updatedDraggedEvent != null && (
        <TimeGridEvent
          event={updatedDraggedEvent}
          eventResource={resourcesByIdMap.get(updatedDraggedEvent.resource)}
          variant="regular"
          ariaLabelledBy={`DayTimeGridHeaderCell-${date.day.toString()}`}
          readOnly
        />
      )}
    </TimeGrid.Column>
  );
}

interface TimeGridColumnProps {
  date: SchedulerValidDate;
  events: CalendarEvent[];
}
