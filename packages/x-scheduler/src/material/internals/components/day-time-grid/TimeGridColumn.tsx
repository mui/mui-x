'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { SchedulerValidDate, CalendarEvent } from '../../../../primitives/models';
import { TimeGrid } from '../../../../primitives/time-grid';
import { TimeGridEvent } from '../event/time-grid-event/TimeGridEvent';
import { isWeekend } from '../../../../primitives/utils/date-utils';
import { useEventCalendarContext } from '../../hooks/useEventCalendarContext';
import { selectors } from '../../../../primitives/use-event-calendar';
import { useAdapter } from '../../../../primitives/utils/adapter/useAdapter';
import { EventPopoverTrigger } from '../event-popover';
import './DayTimeGrid.css';

export function TimeGridColumn(props: TimeGridColumnProps) {
  const { day, events } = props;

  const adapter = useAdapter();
  const { store } = useEventCalendarContext();
  const start = React.useMemo(() => adapter.startOfDay(day), [adapter, day]);
  const end = React.useMemo(() => adapter.endOfDay(day), [adapter, day]);
  const resourcesByIdMap = useStore(store, selectors.resourcesByIdMap);

  const placeholder = TimeGrid.usePlaceholderInRange(start, end);
  const draggedEvent = useStore(store, selectors.getEventById, placeholder?.eventId ?? null);

  const updatedDraggedEvent = React.useMemo(() => {
    if (!draggedEvent || !placeholder) {
      return null;
    }

    return { ...draggedEvent, start: placeholder.start, end: placeholder.end };
  }, [draggedEvent, placeholder]);

  return (
    <TimeGrid.Column
      key={day.toString()}
      start={start}
      end={end}
      className="DayTimeGridColumn"
      data-weekend={isWeekend(adapter, day) ? '' : undefined}
    >
      {events.map((event) => (
        <EventPopoverTrigger
          key={event.id}
          event={event}
          nativeButton={false}
          render={
            <TimeGridEvent
              event={event}
              eventResource={resourcesByIdMap.get(event.resource)}
              variant="regular"
              ariaLabelledBy={`DayTimeGridHeaderCell-${adapter.getDate(day)}`}
            />
          }
        />
      ))}
      {updatedDraggedEvent != null && (
        <TimeGridEvent
          event={updatedDraggedEvent}
          eventResource={resourcesByIdMap.get(updatedDraggedEvent.resource)}
          variant="regular"
          ariaLabelledBy={`DayTimeGridHeaderCell-${day.day.toString()}`}
          readOnly
        />
      )}
    </TimeGrid.Column>
  );
}

interface TimeGridColumnProps {
  day: SchedulerValidDate;
  events: CalendarEvent[];
}
