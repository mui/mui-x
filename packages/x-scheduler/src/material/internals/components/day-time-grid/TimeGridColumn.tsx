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
import { useOnEveryMinuteStart } from '../../../../primitives/utils/useOnEveryMinuteStart';
import { EventPopoverTrigger } from '../event-popover';
import './DayTimeGrid.css';

export function TimeGridColumn(props: TimeGridColumnProps) {
  const { day, events, isToday, showCurrentTimeIndicator, index } = props;

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
      data-current={isToday ? '' : undefined}
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
      {showCurrentTimeIndicator ? (
        <TimeGrid.CurrentTimeIndicator className="DayTimeGridCurrentTimeIndicator">
          {index === 0 && <TimeGridCurrentTimeLabel />}
        </TimeGrid.CurrentTimeIndicator>
      ) : null}
    </TimeGrid.Column>
  );
}

function TimeGridCurrentTimeLabel() {
  const adapter = useAdapter();
  const { store } = useEventCalendarContext();
  const ampm = useStore(store, selectors.ampm);
  const timeFormat = ampm ? 'hoursMinutes12h' : 'hoursMinutes24h';

  const [now, setNow] = React.useState(() => adapter.date());
  useOnEveryMinuteStart(() => setNow(adapter.date()));

  const currentTimeLabel = React.useMemo(
    () => adapter.format(now, timeFormat),
    [now, timeFormat, adapter],
  );

  return (
    <span className="DayTimeGridCurrentTimeLabel" aria-hidden="true">
      {currentTimeLabel}
    </span>
  );
}

interface TimeGridColumnProps {
  day: SchedulerValidDate;
  events: CalendarEventOccurrence[];
  isToday: boolean;
  index: number;
  showCurrentTimeIndicator: boolean;
}
