'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { warnOnce } from '@mui/x-internals/warning';
import { SchedulerProcessedDate, TemporalSupportedObject } from '@mui/x-scheduler-headless/models';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { useAdapterContext } from '@mui/x-scheduler-headless/use-adapter-context';
import {
  eventCalendarOccurrencePlaceholderSelectors,
  eventCalendarOccurrencePositionSelectors,
} from '@mui/x-scheduler-headless/event-calendar-selectors';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { TimeGridEvent } from '../event/time-grid-event/TimeGridEvent';
import { EventSkeleton } from '../event-skeleton';
import { EventDialogTrigger, useEventDialogContext } from '../event-dialog/EventDialog';
import { useEventCalendarStyledContext } from '../../../event-calendar/EventCalendarStyledContext';
import { getCellFocusBackground } from '../../utils/tokens';

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
  ':last-of-type': {
    borderInlineEnd: `1px solid ${(theme.vars || theme).palette.divider}`,
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

interface TimeGridColumnEventProps {
  occurrenceKey: string;
  firstLane: number;
  lastLane: number;
}

const TimeGridColumnEvent = React.memo(function TimeGridColumnEvent(
  props: TimeGridColumnEventProps,
) {
  const { occurrenceKey, firstLane, lastLane } = props;
  const store = useEventCalendarStoreContext();
  const occurrence = useStore(
    store,
    eventCalendarOccurrencePositionSelectors.occurrenceByKey,
    occurrenceKey,
  );

  if (!occurrence) {
    return null;
  }

  return (
    <EventDialogTrigger occurrence={occurrence}>
      <TimeGridEvent
        occurrence={occurrence}
        variant="regular"
        firstLane={firstLane}
        lastLane={lastLane}
      />
    </EventDialogTrigger>
  );
});

export function TimeGridColumn(props: TimeGridColumnProps) {
  const { day, showCurrentTimeIndicator, index } = props;

  const adapter = useAdapterContext();
  const store = useEventCalendarStoreContext();
  const { classes } = useEventCalendarStyledContext();
  const start = React.useMemo(() => adapter.startOfDay(day.value), [adapter, day]);
  const end = React.useMemo(() => adapter.endOfDay(day.value), [adapter, day]);

  const dayLayout = useStore(
    store,
    eventCalendarOccurrencePositionSelectors.timeGridLayoutForDay,
    day.key,
  );
  const maxLane = dayLayout?.maxLane ?? 1;

  return (
    <DayTimeGridColumn
      className={classes.dayTimeGridColumn}
      start={start}
      end={end}
      addPropertiesToDroppedEvent={addPropertiesToDroppedEvent}
      data-weekend={isWeekend(adapter, day.value) || undefined}
      style={{ '--columns-count': maxLane } as React.CSSProperties}
    >
      <ColumnInteractiveLayer
        day={day}
        start={start}
        end={end}
        showCurrentTimeIndicator={showCurrentTimeIndicator}
        index={index}
      />
    </DayTimeGridColumn>
  );
}

function ColumnInteractiveLayer({
  day,
  start,
  end,
  showCurrentTimeIndicator,
  index,
}: {
  day: SchedulerProcessedDate;
  start: TemporalSupportedObject;
  end: TemporalSupportedObject;
  showCurrentTimeIndicator: boolean;
  index: number;
}) {
  // Context hooks
  const store = useEventCalendarStoreContext();
  const { onOpen: startEditing } = useEventDialogContext();
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
  const dayLayout = useStore(
    store,
    eventCalendarOccurrencePositionSelectors.timeGridLayoutForDay,
    day.key,
  );
  const placeholder = CalendarGrid.usePlaceholderInRange({ day, start, end });
  const isLoading = useStore(store, schedulerOtherSelectors.isLoading);

  React.useEffect(() => {
    if (!isCreatingAnEvent || !placeholder || !columnRef.current) {
      return;
    }
    startEditing(columnRef, placeholder.occurrence);
  }, [isCreatingAnEvent, placeholder, startEditing]);

  return (
    <DayTimeGridColumnInteractiveLayer
      className={classes.dayTimeGridColumnInteractiveLayer}
      ref={columnRef}
    >
      {isLoading && <EventSkeleton data-variant="time-column" />}
      {!isLoading &&
        dayLayout?.orderedKeys.map((occurrenceKey) => {
          const position = dayLayout.positionByKey.get(occurrenceKey);
          if (!position) {
            if (process.env.NODE_ENV !== 'production') {
              warnOnce(
                `MUI X Scheduler: occurrence "${occurrenceKey}" is in \`orderedKeys\` for day "${day.key}" ` +
                  'but missing from `positionByKey`. The event will not render. This is an internal bug — please file an issue.',
              );
            }
            return null;
          }
          return (
            <TimeGridColumnEvent
              key={occurrenceKey}
              occurrenceKey={occurrenceKey}
              firstLane={position.firstLane}
              lastLane={position.lastLane}
            />
          );
        })}
      {placeholder != null && (
        <TimeGridEvent
          occurrence={placeholder.occurrence}
          variant="placeholder"
          firstLane={placeholder.firstLane}
          lastLane={placeholder.lastLane}
        />
      )}
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
  day: SchedulerProcessedDate;
  index: number;
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
