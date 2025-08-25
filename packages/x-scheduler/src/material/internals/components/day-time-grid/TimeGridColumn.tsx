'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { SchedulerValidDate, CalendarEventOccurrence } from '../../../../primitives/models';
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
  const initialDraggedEvent = useStore(store, selectors.getEventById, placeholder?.eventId ?? null);

  const draggedEvent = React.useMemo(() => {
    if (!initialDraggedEvent || !placeholder) {
      return null;
    }

    return {
      ...initialDraggedEvent,
      start: placeholder.start,
      end: placeholder.end,
      readOnly: true,
    };
  }, [initialDraggedEvent, placeholder]);

  return (
    <TimeGrid.Column
      start={start}
      end={end}
      className="DayTimeGridColumn"
      data-weekend={isWeekend(adapter, day) ? '' : undefined}
    >
      {events.map((event) => (
        <EventPopoverTrigger
          key={event.key}
          event={event}
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
      {draggedEvent != null && (
        <TimeGridEvent
          event={draggedEvent}
          eventResource={resourcesByIdMap.get(draggedEvent.resource)}
          variant="regular"
          ariaLabelledBy={`DayTimeGridHeaderCell-${day.day.toString()}`}
        />
      )}
    </TimeGrid.Column>
  );
}

interface TimeGridColumnProps {
  day: SchedulerValidDate;
  events: CalendarEventOccurrence[];
}
