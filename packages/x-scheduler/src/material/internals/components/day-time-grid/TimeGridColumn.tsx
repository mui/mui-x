'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { useTimeGridColumnContext } from '../../../../primitives/time-grid/column/TimeGridColumnContext';
import { SchedulerValidDate, CalendarEventOccurrence } from '../../../../primitives/models';
import { TimeGrid } from '../../../../primitives/time-grid';
import { TimeGridEvent } from '../event/time-grid-event/TimeGridEvent';
import { isWeekend } from '../../../../primitives/utils/date-utils';
import { useEventCalendarContext } from '../../hooks/useEventCalendarContext';
import { selectors } from '../../../../primitives/use-event-calendar';
import { useAdapter } from '../../../../primitives/utils/adapter/useAdapter';
import { useOnEveryMinuteStart } from '../../../../primitives/utils/useOnEveryMinuteStart';
import { EventPopoverTrigger } from '../event-popover';
import { useEventPopover } from '../event-popover/EventPopoverContext';
import { CREATE_PLACEHOLDER_ID } from '../../../../primitives/utils/event-utils';
import { useCreateDraftOnDoubleClick } from '../../../../primitives/draft/useCreateDraftOnDoubleClick';
import './DayTimeGrid.css';

export function TimeGridColumn(props: TimeGridColumnProps) {
  const { day, events, isToday, showCurrentTimeIndicator, index } = props;
  const adapter = useAdapter();
  return (
    <TimeGrid.Column
      start={adapter.startOfDay(day)}
      end={adapter.endOfDay(day)}
      className="DayTimeGridColumn"
      data-weekend={isWeekend(adapter, day) ? '' : undefined}
      data-current={isToday ? '' : undefined}
    >
      <ColumnInteractiveLayer
        day={day}
        events={events}
        showCurrentTimeIndicator={showCurrentTimeIndicator}
        index={index}
      />
    </TimeGrid.Column>
  );
}

function ColumnInteractiveLayer({
  day,
  events,
  showCurrentTimeIndicator,
  index,
}: {
  day: SchedulerValidDate;
  events: CalendarEventOccurrence[];
  showCurrentTimeIndicator: boolean;
  index: number;
}) {
  const adapter = useAdapter();
  const { store } = useEventCalendarContext();
  const { start, end, getCursorPositionInElementMs } = useTimeGridColumnContext();
  const { startEditing } = useEventPopover();
  const columnRef = React.useRef<HTMLDivElement | null>(null);
  const placeholder = TimeGrid.usePlaceholderInRange(start, end);

  const onDoubleClick = useCreateDraftOnDoubleClick({
    adapter,
    startEditing,
    computeInitialRange: (event) => {
      const offsetMs = getCursorPositionInElementMs({
        input: { clientY: event.clientY },
        elementRef: columnRef,
      });

      const offsetMin = Math.floor(offsetMs / 60000);
      const anchor = adapter.addMinutes(start, offsetMin);

      // snap to 30 minutes
      const roundedStart = adapter.addMinutes(anchor, -(adapter.getMinutes(anchor) % 30));

      return {
        start: roundedStart,
        end: adapter.addMinutes(roundedStart, 30),
        allDay: false,
        surface: 'time',
      };
    },
  });

  const initialDraggedEvent = useStore(store, selectors.event, placeholder?.eventId ?? null);

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
    <div
      ref={columnRef}
      data-surface="time"
      onDoubleClick={onDoubleClick}
      className="DayTimeGridColumnInteractiveLayer"
    >
      {events.map((event) => (
        <EventPopoverTrigger
          key={event.key}
          event={event}
          render={
            <TimeGridEvent
              event={event}
              variant="regular"
              ariaLabelledBy={`DayTimeGridHeaderCell-${adapter.getDate(day)}`}
            />
          }
        />
      ))}
      {draggedEvent != null && (
        <TimeGridEvent
          event={draggedEvent}
          variant="regular"
          ariaLabelledBy={`DayTimeGridHeaderCell-${day.day.toString()}`}
        />
      )}
      {placeholder && (
        <TimeGridEvent
          variant="createPlaceholder"
          event={{
            id: CREATE_PLACEHOLDER_ID,
            title: '',
            start: placeholder.start,
            end: placeholder.end,
            allDay: false,
          }}
          ariaLabelledBy={`DayTimeGridHeaderCell-${adapter.getDate(day)}`}
        />
      )}
      {showCurrentTimeIndicator ? (
        <TimeGrid.CurrentTimeIndicator className="DayTimeGridCurrentTimeIndicator">
          {index === 0 && <TimeGridCurrentTimeLabel />}
        </TimeGrid.CurrentTimeIndicator>
      ) : null}
    </div>
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
