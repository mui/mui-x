'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import {
  CalendarEventOccurrenceWithTimePosition,
  SchedulerValidDate,
} from '@mui/x-scheduler-headless/models';
import {
  EVENT_CREATION_DEFAULT_LENGTH_MINUTE,
  EVENT_CREATION_PRECISION_MINUTE,
} from '@mui/x-scheduler-headless/constants';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { selectors } from '@mui/x-scheduler-headless/use-event-calendar';
import { useAdapter, isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-day-grid-position';
import { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-timeline-position';
import { eventCalendarOccurrencePlaceholderSelectors } from '@mui/x-scheduler-headless/event-calendar-selectors';
import { TimeGridEvent } from '../event/time-grid-event/TimeGridEvent';
import { EventPopoverTrigger } from '../event-popover';
import { useEventPopoverContext } from '../event-popover/EventPopover';
import './DayTimeGrid.css';
import { useFormatTime } from '../../hooks/useFormatTime';

export function TimeGridColumn(props: TimeGridColumnProps) {
  const { day, showCurrentTimeIndicator, index } = props;

  const adapter = useAdapter();
  const start = React.useMemo(() => adapter.startOfDay(day.value), [adapter, day]);
  const end = React.useMemo(() => adapter.endOfDay(day.value), [adapter, day]);
  const { occurrences, maxIndex } = useEventOccurrencesWithTimelinePosition({
    occurrences: day.withoutPosition,
    maxSpan: Infinity,
  });

  return (
    <CalendarGrid.TimeColumn
      start={start}
      end={end}
      addPropertiesToDroppedEvent={addPropertiesToDroppedEvent}
      className="DayTimeGridColumn"
      data-weekend={isWeekend(adapter, day.value) ? '' : undefined}
      style={{ '--columns-count': maxIndex } as React.CSSProperties}
    >
      <ColumnInteractiveLayer
        start={start}
        end={end}
        showCurrentTimeIndicator={showCurrentTimeIndicator}
        index={index}
        occurrences={occurrences}
        maxIndex={maxIndex}
      />
    </CalendarGrid.TimeColumn>
  );
}

function ColumnInteractiveLayer({
  start,
  end,
  showCurrentTimeIndicator,
  index,
  occurrences,
  maxIndex,
}: {
  start: SchedulerValidDate;
  end: SchedulerValidDate;
  showCurrentTimeIndicator: boolean;
  index: number;
  occurrences: CalendarEventOccurrenceWithTimePosition[];
  maxIndex: number;
}) {
  // Context hooks
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const { open: startEditing } = useEventPopoverContext();

  // Ref hooks
  const columnRef = React.useRef<HTMLDivElement | null>(null);

  // Selector hooks
  const isCreatingAnEvent = useStore(
    store,
    eventCalendarOccurrencePlaceholderSelectors.isCreatingInTimeRange,
    start,
    end,
  );
  const placeholder = CalendarGrid.usePlaceholderInRange({ start, end, occurrences, maxIndex });

  // Feature hooks
  const getDateFromPosition = CalendarGrid.useGetDateFromPositionInColumn({
    elementRef: columnRef,
    snapMinutes: EVENT_CREATION_PRECISION_MINUTE,
  });

  const computeInitialRange = (event: React.MouseEvent<HTMLDivElement>) => {
    const startDateFromPosition = getDateFromPosition(event.clientY);

    return {
      start: startDateFromPosition,
      end: adapter.addMinutes(startDateFromPosition, EVENT_CREATION_DEFAULT_LENGTH_MINUTE),
    };
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!selectors.canCreateNewEvent(store.state)) {
      return;
    }

    const draftRange = computeInitialRange(event);
    store.setOccurrencePlaceholder({
      type: 'creation',
      surfaceType: 'time-grid',
      start: draftRange.start,
      end: draftRange.end,
    });
  };

  React.useEffect(() => {
    if (!isCreatingAnEvent || !placeholder || !columnRef.current) {
      return;
    }
    startEditing(columnRef.current, placeholder);
  }, [isCreatingAnEvent, placeholder, startEditing]);

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
          render={<TimeGridEvent occurrence={occurrence} variant="regular" />}
        />
      ))}
      {placeholder != null && <TimeGridEvent occurrence={placeholder} variant="placeholder" />}
      {showCurrentTimeIndicator ? (
        <CalendarGrid.CurrentTimeIndicator className="DayTimeGridCurrentTimeIndicator">
          {index === 0 && <TimeGridCurrentTimeLabel />}
        </CalendarGrid.CurrentTimeIndicator>
      ) : null}
    </div>
  );
}

function TimeGridCurrentTimeLabel() {
  const store = useEventCalendarStoreContext();
  const now = useStore(store, selectors.nowUpdatedEveryMinute);
  const formatTime = useFormatTime();

  const currentTimeLabel = React.useMemo(() => formatTime(now), [now, formatTime]);

  return (
    <span className="DayTimeGridCurrentTimeLabel" aria-hidden="true">
      {currentTimeLabel}
    </span>
  );
}

interface TimeGridColumnProps {
  day: useEventOccurrencesWithDayGridPosition.DayData;
  index: number;
  showCurrentTimeIndicator: boolean;
}

/**
 * Makes sure any event dropped in the time grid column is turned into an non all-day event.
 */
function addPropertiesToDroppedEvent() {
  return {
    allDay: false,
  };
}
