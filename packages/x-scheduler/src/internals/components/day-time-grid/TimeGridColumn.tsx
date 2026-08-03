'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import type { TemporalSupportedObject } from '@mui/x-scheduler-internals/models';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { isWeekend } from '@mui/x-scheduler-internals/use-adapter';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import type { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-internals/use-event-occurrences-with-day-grid-position';
import { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-internals/use-event-occurrences-with-timeline-position';
import { eventCalendarOccurrencePlaceholderSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { EventSkeleton } from '../event-skeleton';
import { EventDialogTrigger, useEventDialogContext } from '../event-dialog/EventDialog';
import { useEventCalendarStyledContext } from '../../../event-calendar/EventCalendarStyledContext';
import { getCellFocusBackground } from '../../utils/tokens';
import { useDayTimeGridInternalRenderers } from './DayTimeGridInternalRenderersContext';

const DayTimeGridColumn = styled(CalendarGrid.TimeColumn, {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridColumn',
})(({ theme }) => ({
  borderInlineStart: `1px solid ${(theme.vars || theme).palette.divider}`,
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: 0,
  minWidth: 0,
  position: 'relative',
  '&[data-weekend]': {
    backgroundColor: (theme.vars || theme).palette.action.hover,
  },
  '&:focus-visible': {
    outline: 'none',
    backgroundColor: getCellFocusBackground(theme),
  },
}));

const DayTimeGridColumnInteractiveLayer = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridColumnInteractiveLayer',
})({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

const DayTimeGridCurrentTimeIndicator = styled(CalendarGrid.CurrentTimeIndicator, {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridCurrentTimeIndicator',
})(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  top: 'var(--y-position)',
  left: 0,
  right: -1,
  height: 0,
  borderTop: `2px solid ${(theme.vars || theme).palette.primary.main}`,
}));

const DayTimeGridCurrentTimeIndicatorCircle = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridCurrentTimeIndicatorCircle',
})(({ theme }) => ({
  position: 'absolute',
  zIndex: 1,
  left: -5,
  top: -5,
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: (theme.vars || theme).palette.primary.main,
}));

export function TimeGridColumn(props: TimeGridColumnProps) {
  const { day, showCurrentTimeIndicator, index, colIndex, startTime, endTime } = props;

  const adapter = useAdapterContext();
  const { classes } = useEventCalendarStyledContext();
  // `setHours(startOfDay, 0)` is equivalent to `startOfDay`, so no special-casing is needed here.
  const start = React.useMemo(
    () => adapter.setHours(adapter.startOfDay(day.value), startTime),
    [adapter, day, startTime],
  );
  const end = React.useMemo(
    () =>
      endTime === 24
        ? adapter.endOfDay(day.value)
        : adapter.setHours(adapter.startOfDay(day.value), endTime),
    [adapter, day, endTime],
  );

  // Only place occurrences that overlap the visible `[start, end)` window. Occurrences entirely
  // before `startTime` or after `endTime` would otherwise be clamped to a zero-height sliver pinned
  // to an edge (showing a misleading time) and still count toward the column's lane count.
  const visibleOccurrences = React.useMemo(() => {
    const startTimestamp = adapter.getTime(start);
    const endTimestamp = adapter.getTime(end);
    return day.withoutPosition.filter(
      (occurrence) =>
        occurrence.displayTimezone.end.timestamp > startTimestamp &&
        occurrence.displayTimezone.start.timestamp < endTimestamp,
    );
  }, [adapter, day.withoutPosition, start, end]);

  const { occurrences, maxIndex } = useEventOccurrencesWithTimelinePosition({
    occurrences: visibleOccurrences,
    maxSpan: Infinity,
  });

  return (
    <DayTimeGridColumn
      className={classes.dayTimeGridColumn}
      start={start}
      end={end}
      dayStartMinute={startTime * 60}
      dayEndMinute={endTime * 60}
      addPropertiesToDroppedEvent={addPropertiesToDroppedEvent}
      aria-colindex={colIndex}
      data-weekend={isWeekend(adapter, day.value) || undefined}
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
    </DayTimeGridColumn>
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
  start: TemporalSupportedObject;
  end: TemporalSupportedObject;
  showCurrentTimeIndicator: boolean;
  index: number;
  occurrences: useEventOccurrencesWithTimelinePosition.EventOccurrenceWithPosition[];
  maxIndex: number;
}) {
  // Context hooks
  const store = useEventCalendarStoreContext();
  const { onOpen: startEditing } = useEventDialogContext();
  const { classes } = useEventCalendarStyledContext();
  const { timeGridEvent: TimeGridEvent } = useDayTimeGridInternalRenderers();

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
  const isLoading = useStore(store, schedulerOtherSelectors.isLoading);

  React.useEffect(() => {
    if (!isCreatingAnEvent || !placeholder || !columnRef.current) {
      return;
    }
    startEditing(columnRef, placeholder);
  }, [isCreatingAnEvent, placeholder, startEditing]);

  return (
    <DayTimeGridColumnInteractiveLayer
      className={classes.dayTimeGridColumnInteractiveLayer}
      ref={columnRef}
    >
      {isLoading && <EventSkeleton data-variant="time-column" />}
      {!isLoading &&
        occurrences.map((occurrence) => (
          <EventDialogTrigger key={occurrence.key} occurrence={occurrence}>
            <TimeGridEvent occurrence={occurrence} variant="regular" />
          </EventDialogTrigger>
        ))}
      {placeholder != null && <TimeGridEvent occurrence={placeholder} variant="placeholder" />}
      {showCurrentTimeIndicator ? (
        <DayTimeGridCurrentTimeIndicator
          className={classes.dayTimeGridCurrentTimeIndicator}
          aria-hidden
        >
          {index === 0 && (
            <DayTimeGridCurrentTimeIndicatorCircle
              className={classes.dayTimeGridCurrentTimeIndicatorCircle}
            />
          )}
        </DayTimeGridCurrentTimeIndicator>
      ) : null}
    </DayTimeGridColumnInteractiveLayer>
  );
}

interface TimeGridColumnProps {
  day: useEventOccurrencesWithDayGridPosition.DayData;
  index: number;
  colIndex: number;
  /**
   * The first hour displayed in the column (whole hour between 0 and 24).
   */
  startTime: number;
  /**
   * The last hour displayed in the column (whole hour between 0 and 24).
   */
  endTime: number;
  showCurrentTimeIndicator: boolean;
}

/**
 * Makes sure any event dropped in the time grid column is turned into a non all-day event.
 */
function addPropertiesToDroppedEvent() {
  return {
    allDay: false,
  };
}
