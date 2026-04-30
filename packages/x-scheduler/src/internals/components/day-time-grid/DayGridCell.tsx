'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { useAdapterContext } from '@mui/x-scheduler-headless/use-adapter-context';
import { SchedulerProcessedDate } from '@mui/x-scheduler-headless/models';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import {
  eventCalendarOccurrencePlaceholderSelectors,
  eventCalendarOccurrencePositionSelectors,
} from '@mui/x-scheduler-headless/event-calendar-selectors';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { DayGridEvent } from '../event';
import { EventDialogTrigger } from '../event-dialog';
import { useEventDialogContext } from '../event-dialog/EventDialog';
import { EventSkeleton } from '../event-skeleton';
import { useEventCalendarStyledContext } from '../../../event-calendar/EventCalendarStyledContext';
import { getCellFocusBackground } from '../../utils/tokens';

const EVENT_HEIGHT = 22;

const DayTimeGridAllDayEventsCell = styled(CalendarGrid.DayCell, {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridAllDayEventsCell',
})(({ theme }) => ({
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: 0,
  minWidth: 0,
  padding: theme.spacing(0.5),
  display: 'grid',
  gridTemplateRows: 'repeat(var(--row-count), minmax(auto, 18px))',
  gap: theme.spacing(0.5),
  lineHeight: '18px',

  minHeight: `calc(var(--row-count, 0) * ${EVENT_HEIGHT}px + ${theme.spacing(0.5)})`,

  '&[data-weekend]': {
    backgroundColor: (theme.vars || theme).palette.action.hover,
  },
  '&:focus-visible': {
    outline: 'none',
    backgroundColor: getCellFocusBackground(theme),
  },
}));

const DayTimeGridAllDayEventsCellEvents = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridAllDayEventsCellEvents',
})(({ theme }) => ({ position: 'relative', display: 'grid', gap: theme.spacing(0.5) }));

const DayTimeGridAllDayEventContainer = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridAllDayEventContainer',
})({
  display: 'contents',
});

interface DayGridCellEventProps {
  occurrenceKey: string;
  firstLane: number;
  cellSpan: number;
  isInvisible: boolean;
}

const DayGridCellEvent = React.memo(function DayGridCellEvent(props: DayGridCellEventProps) {
  const { occurrenceKey, firstLane, cellSpan, isInvisible } = props;
  const store = useEventCalendarStoreContext();
  const occurrence = useStore(
    store,
    eventCalendarOccurrencePositionSelectors.occurrenceByKey,
    occurrenceKey,
  );

  if (!occurrence) {
    return null;
  }

  if (isInvisible) {
    return (
      <DayGridEvent
        occurrence={occurrence}
        variant="invisible"
        firstLane={firstLane}
        cellSpan={cellSpan}
      />
    );
  }

  return (
    <EventDialogTrigger occurrence={occurrence}>
      <DayGridEvent
        occurrence={occurrence}
        variant="filled"
        firstLane={firstLane}
        cellSpan={cellSpan}
      />
    </EventDialogTrigger>
  );
});

export function DayGridCell(props: DayGridCellProps) {
  const { day } = props;

  // Context hooks
  const adapter = useAdapterContext();
  const store = useEventCalendarStoreContext();
  const { onOpen: startEditing } = useEventDialogContext();
  const { schedulerId, classes } = useEventCalendarStyledContext();

  // Ref hooks
  const cellRef = React.useRef<HTMLDivElement | null>(null);

  // Selector hooks
  const isCreatingAnEvent = useStore(
    store,
    eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell,
    day.value,
  );
  const dayLayout = useStore(
    store,
    eventCalendarOccurrencePositionSelectors.dayGridLayoutForDay,
    day.key,
  );
  const placeholder = CalendarGrid.usePlaceholderInDay(day);
  const isLoading = useStore(store, schedulerOtherSelectors.isLoading);

  const orderedKeys = dayLayout?.orderedKeys ?? EMPTY_ARRAY;
  const layoutMaxLane = dayLayout?.maxLane ?? 0;
  const rowCount = Math.max(layoutMaxLane, placeholder?.firstLane ?? 0);

  React.useEffect(() => {
    if (!isCreatingAnEvent || !placeholder || !cellRef.current) {
      return;
    }
    startEditing(cellRef, placeholder.occurrence);
  }, [isCreatingAnEvent, placeholder, startEditing]);

  return (
    <DayTimeGridAllDayEventsCell
      className={classes.dayTimeGridAllDayEventsCell}
      ref={cellRef}
      value={day.value}
      addPropertiesToDroppedEvent={addPropertiesToDroppedEvent}
      style={
        {
          '--row-count': rowCount,
        } as React.CSSProperties
      }
      aria-labelledby={`${schedulerId}-DayTimeGridAllDayEventsHeaderCell`}
      role="gridcell"
      data-weekend={isWeekend(adapter, day.value) || undefined}
    >
      <DayTimeGridAllDayEventsCellEvents className={classes.dayTimeGridAllDayEventsCellEvents}>
        {isLoading && <EventSkeleton data-variant="day-grid" />}
        {orderedKeys.map((occurrenceKey) => {
          const position = dayLayout?.positionByKey.get(occurrenceKey);
          if (!position) {
            return null;
          }
          return (
            <DayGridCellEvent
              key={occurrenceKey}
              occurrenceKey={occurrenceKey}
              firstLane={position.firstLane}
              cellSpan={dayLayout?.cellSpanByKey.get(occurrenceKey) ?? 1}
              isInvisible={dayLayout?.invisibleKeys.has(occurrenceKey) ?? false}
            />
          );
        })}
        {placeholder != null && (
          <DayTimeGridAllDayEventContainer className={classes.dayTimeGridAllDayEventContainer}>
            <DayGridEvent
              occurrence={placeholder.occurrence}
              variant="placeholder"
              firstLane={placeholder.firstLane}
              cellSpan={placeholder.cellSpan}
            />
          </DayTimeGridAllDayEventContainer>
        )}
      </DayTimeGridAllDayEventsCellEvents>
    </DayTimeGridAllDayEventsCell>
  );
}

interface DayGridCellProps {
  day: SchedulerProcessedDate;
}

/**
 * Makes sure any event dropped in the day cell is turned into an all-day event.
 */
function addPropertiesToDroppedEvent() {
  return {
    allDay: true,
  };
}
