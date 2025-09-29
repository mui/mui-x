'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { CalendarEventOccurrenceWithTimePosition } from '../../../../primitives';
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
import { useGetDateFromPositionInColumn } from '../../../../primitives/time-grid/column/useGetDateFromPositionInColumn';
import { SchedulerValidDate } from '../../../../primitives/models/date';
import { useEventPopoverContext } from '../event-popover/EventPopoverContext';
import {
  EVENT_CREATION_DEFAULT_LENGTH_MINUTE,
  EVENT_CREATION_PRECISION_MINUTE,
} from '../../../../primitives/utils/event-utils';
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
        start={start}
        end={end}
        showCurrentTimeIndicator={showCurrentTimeIndicator}
        index={index}
        occurrences={occurrences}
        maxIndex={maxIndex}
      />
    </TimeGrid.Column>
  );
}

function ColumnInteractiveLayer({
  day,
  start,
  end,
  showCurrentTimeIndicator,
  index,
  occurrences,
  maxIndex,
}: {
  day: useEventOccurrencesWithDayGridPosition.DayData;
  start: SchedulerValidDate;
  end: SchedulerValidDate;
  showCurrentTimeIndicator: boolean;
  index: number;
  occurrences: CalendarEventOccurrenceWithTimePosition[];
  maxIndex: number;
}) {
  const adapter = useAdapter();

  const placeholder = TimeGrid.usePlaceholderInRange({ start, end, occurrences, maxIndex });
  const store = useEventCalendarStoreContext();
  const columnRef = React.useRef<HTMLDivElement | null>(null);
  const getDateFromPosition = useGetDateFromPositionInColumn({
    elementRef: columnRef,
    snapMinutes: EVENT_CREATION_PRECISION_MINUTE,
  });
  const { startEditing } = useEventPopoverContext();
  const isCreation = useStore(store, selectors.isCreatingNewEventInTimeRange, start, end);

  const computeInitialRange = (event: React.MouseEvent<HTMLDivElement>) => {
    const startDateFromPosition = getDateFromPosition(event.clientY);

    return {
      start: startDateFromPosition,
      end: adapter.addMinutes(startDateFromPosition, EVENT_CREATION_DEFAULT_LENGTH_MINUTE),
    };
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const draftRange = computeInitialRange(event);
    store.setOccurrencePlaceholder({
      eventId: null,
      occurrenceKey: 'create-placeholder',
      surfaceType: 'time-grid',
      start: draftRange.start,
      end: draftRange.end,
      originalStart: null,
    });
  };

  React.useEffect(() => {
    if (!isCreation || !placeholder || !columnRef.current) {
      return;
    }
    startEditing(columnRef.current, placeholder);
  }, [isCreation, placeholder, startEditing]);

  return (
    <div
      className="DayTimeGridColumnInteractiveLayer"
      ref={columnRef}
      onDoubleClick={handleDoubleClick}
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
      {placeholder != null && (
        <TimeGridEvent
          occurrence={placeholder}
          variant="placeholder"
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
