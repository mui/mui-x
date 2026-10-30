'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import {
  getPlainDateTimelineAxis,
  isWeekendPlainDate,
  useCalendarGridTimeColumnContext,
} from '@mui/x-scheduler-internals/internals';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import type { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-internals/use-event-occurrences-with-day-grid-position';
import { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-internals/use-event-occurrences-with-timeline-position';
import { eventCalendarOccurrencePlaceholderSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { EventSkeleton } from '../event-skeleton';
import { useEventEditingContext } from '../event-editing';
import { EventContextMenuTrigger } from '../event-context-menu';
import { useEventCalendarStyledContext } from '../../../event-calendar/EventCalendarStyledContext';
import { getCellFocusBackground } from '../../utils/tokens';
import { TimeGridEvent } from '../event/time-grid-event/TimeGridEvent';

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
  insetInline: 0,
});

const DayTimeGridCurrentTimeIndicator = styled(CalendarGrid.CurrentTimeIndicator, {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridCurrentTimeIndicator',
})(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  top: 'var(--y-position)',
  insetInlineStart: 0,
  insetInlineEnd: -1,
  height: 0,
  borderTop: `2px solid ${(theme.vars || theme).palette.primary.main}`,
}));

const DayTimeGridCurrentTimeIndicatorCircle = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridCurrentTimeIndicatorCircle',
})(({ theme }) => ({
  position: 'absolute',
  zIndex: 1,
  insetInlineStart: -5,
  top: -5,
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: (theme.vars || theme).palette.primary.main,
}));

export function TimeGridColumn(props: TimeGridColumnProps) {
  const { day, showCurrentTimeIndicator, index, colIndex, startTime, endTime } = props;

  const store = useEventCalendarStoreContext();
  const { classes } = useEventCalendarStyledContext();
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);
  const dayStartMinute = startTime * 60;
  const dayEndMinute = endTime * 60;
  // The bounds of the column, which builds them the same way.
  const { start, end } = React.useMemo(
    () =>
      getPlainDateTimelineAxis(day.plainDate, { dayStartMinute, dayEndMinute }, displayTimezone),
    [day.plainDate, dayStartMinute, dayEndMinute, displayTimezone],
  );

  // Only place occurrences that overlap the visible `[start, end)` window. Occurrences entirely
  // before `startTime` or after `endTime` would otherwise be clamped to a zero-height sliver pinned
  // to an edge (showing a misleading time) and still count toward the column's lane count.
  const visibleOccurrences = React.useMemo(
    () =>
      day.withoutPosition.filter(
        (occurrence) =>
          occurrence.displayTimezone.end.timestamp > start &&
          occurrence.displayTimezone.start.timestamp < end,
      ),
    [day.withoutPosition, start, end],
  );

  const { occurrences, maxIndex } = useEventOccurrencesWithTimelinePosition({
    occurrences: visibleOccurrences,
    maxSpan: Infinity,
  });

  return (
    <DayTimeGridColumn
      className={classes.dayTimeGridColumn}
      value={day.plainDate}
      dayStartMinute={dayStartMinute}
      dayEndMinute={dayEndMinute}
      addPropertiesToDroppedEvent={addPropertiesToDroppedEvent}
      aria-colindex={colIndex}
      data-weekend={isWeekendPlainDate(day.plainDate) || undefined}
      style={{ '--columns-count': maxIndex } as React.CSSProperties}
    >
      <ColumnInteractiveLayer
        showCurrentTimeIndicator={showCurrentTimeIndicator}
        index={index}
        occurrences={occurrences}
        maxIndex={maxIndex}
      />
    </DayTimeGridColumn>
  );
}

function ColumnInteractiveLayer({
  showCurrentTimeIndicator,
  index,
  occurrences,
  maxIndex,
}: {
  showCurrentTimeIndicator: boolean;
  index: number;
  occurrences: useEventOccurrencesWithTimelinePosition.EventOccurrenceWithPosition[];
  maxIndex: number;
}) {
  // Context hooks
  const store = useEventCalendarStoreContext();
  const { start, end } = useCalendarGridTimeColumnContext().axis;
  const { startEditing } = useEventEditingContext();
  const { classes } = useEventCalendarStyledContext();

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
    // `startEditing` is a no-op once the surface is open, so placeholder churn doesn't re-fire it.
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
          <EventContextMenuTrigger key={occurrence.key} occurrence={occurrence}>
            <TimeGridEvent occurrence={occurrence} variant="regular" />
          </EventContextMenuTrigger>
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
   * Inclusive start of the hour range displayed in the column (whole hour between 0 and 24).
   */
  startTime: number;
  /**
   * Exclusive end of the hour range displayed in the column (whole hour between 0 and 24).
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
