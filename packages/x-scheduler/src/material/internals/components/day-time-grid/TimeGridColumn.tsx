'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { useTimeGridColumnContext } from '../../../../primitives/time-grid/column/TimeGridColumnContext';
import { CalendarEventOccurrenceWithTimePosition } from '../../../../primitives/models';
import { TimeGrid } from '../../../../primitives/time-grid';
import { TimeGridEvent } from '../event/time-grid-event/TimeGridEvent';
import { isWeekend } from '../../../../primitives/utils/date-utils';
import { useEventCalendarStoreContext } from '../../../../primitives/utils/useEventCalendarStoreContext';
import { selectors } from '../../../../primitives/use-event-calendar';
import { useAdapter } from '../../../../primitives/utils/adapter/useAdapter';
import { useOnEveryMinuteStart } from '../../../../primitives/utils/useOnEveryMinuteStart';
import { useEventOccurrencesWithDayGridPosition } from '../../../../primitives/use-event-occurrences-with-day-grid-position';
import { useEventOccurrencesWithTimelinePosition } from '../../../../primitives/use-event-occurrences-with-timeline-position';
import { EventPopoverTrigger } from '../event-popover';
import { useEventPopover } from '../event-popover/EventPopoverContext';
import { CREATE_PLACEHOLDER_ID } from '../../../../primitives/utils/event-utils';
import { useCreateDraftOnDoubleClick } from '../../../../primitives/draft/useCreateDraftOnDoubleClick';
import './DayTimeGrid.css';

export function TimeGridColumn(props: TimeGridColumnProps) {
  const { day, isToday, showCurrentTimeIndicator, index } = props;
  const adapter = useAdapter();
  const start = React.useMemo(() => adapter.startOfDay(day.value), [adapter, day]);
  const end = React.useMemo(() => adapter.endOfDay(day.value), [adapter, day]);

  const { occurrences, maxIndex } = useEventOccurrencesWithTimelinePosition({
    occurrences: day.withoutPosition,
    maxColumnSpan: Infinity,
  });

  return (
    <TimeGrid.Column
      start={start}
      end={end}
      className="DayTimeGridColumn"
      data-weekend={isWeekend(adapter, day.value) ? '' : undefined}
      data-current={isToday ? '' : undefined}
      style={{ '--columns-count': maxIndex } as React.CSSProperties}
    >
      <ColumnInteractiveLayer
        day={day}
        occurrences={occurrences}
        showCurrentTimeIndicator={showCurrentTimeIndicator}
        index={index}
        maxIndex={maxIndex}
      />
    </TimeGrid.Column>
  );
}

function ColumnInteractiveLayer({
  day,
  occurrences,
  showCurrentTimeIndicator,
  index,
  maxIndex,
}: {
  day: useEventOccurrencesWithDayGridPosition.DayData;
  occurrences: CalendarEventOccurrenceWithTimePosition[];
  showCurrentTimeIndicator: boolean;
  index: number;
  maxIndex: number;
}) {
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
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

  const draggedOccurrence = React.useMemo(() => {
    if (!initialDraggedEvent || !placeholder) {
      return null;
    }

    return {
      ...initialDraggedEvent,
      key: `dragged-${initialDraggedEvent.id}`,
      start: placeholder.start,
      end: placeholder.end,
      readOnly: true,
      position: {
        // TODO: Apply the same firstIndex and lastIndex as the initial event if present in the column, 1 / maxIndex otherwise
        firstIndex: 1,
        lastIndex: maxIndex,
      },
    };
  }, [initialDraggedEvent, placeholder, maxIndex]);

  return (
    <div
      ref={columnRef}
      onDoubleClick={onDoubleClick}
      className="DayTimeGridColumnInteractiveLayer"
    >
      {occurrences.map((occurrence) => (
        <EventPopoverTrigger
          key={occurrence.key}
          occurrence={occurrence}
          render={
            <TimeGridEvent
              occurrence={occurrence}
              variant="regular"
              ariaLabelledBy={`DayTimeGridHeaderCell-${adapter.getDate(day.value)}`}
            />
          }
        />
      ))}
      {draggedOccurrence != null && (
        <TimeGridEvent
          occurrence={draggedOccurrence}
          variant="regular"
          ariaLabelledBy={`DayTimeGridHeaderCell-${day.key}`}
        />
      )}
      {placeholder && (
        <TimeGridEvent
          variant="createPlaceholder"
          occurrence={{
            key: CREATE_PLACEHOLDER_ID,
            id: CREATE_PLACEHOLDER_ID,
            title: '',
            start: placeholder.start,
            end: placeholder.end,
            allDay: false,
            position: {
              // TODO: Apply the same firstIndex and lastIndex as the initial event if present in the column, 1 / maxIndex otherwise
              firstIndex: 1,
              lastIndex: maxIndex,
            },
          }}
          ariaLabelledBy={`DayTimeGridHeaderCell-${day.key}`}
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
  const store = useEventCalendarStoreContext();
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
  day: useEventOccurrencesWithDayGridPosition.DayData;
  isToday: boolean;
  index: number;
  showCurrentTimeIndicator: boolean;
}
