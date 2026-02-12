'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { useAdapter, isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-day-grid-position';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { eventCalendarOccurrencePlaceholderSelectors } from '@mui/x-scheduler-headless/event-calendar-selectors';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { DayGridEvent } from '../event';
import { useEventCreationProps } from '../../hooks/useEventCreationProps';
import { EventDialogTrigger } from '../event-dialog';
import { useEventDialogContext } from '../event-dialog/EventDialog';
import { useEventCalendarClasses } from '../../../event-calendar/EventCalendarClassesContext';
import { EventSkeleton } from '../event-skeleton';

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
    backgroundColor: theme.palette.action.hover,
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

export function DayGridCell(props: DayGridCellProps) {
  const { day, row } = props;

  // Context hooks
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const { onOpen: startEditing } = useEventDialogContext();
  const classes = useEventCalendarClasses();

  // Ref hooks
  const cellRef = React.useRef<HTMLDivElement | null>(null);

  // Selector hooks
  const isCreatingAnEvent = useStore(
    store,
    eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell,
    day.value,
  );
  const placeholder = CalendarGrid.usePlaceholderInDay(day.value, row);
  const isLoading = useStore(store, schedulerOtherSelectors.isLoading);

  // Feature hooks
  const eventCreationProps = useEventCreationProps(() => {
    store.setOccurrencePlaceholder({
      type: 'creation',
      surfaceType: 'day-grid',
      start: adapter.startOfDay(day.value),
      end: adapter.endOfDay(day.value),
      resourceId: null,
    });
  });

  React.useEffect(() => {
    if (!isCreatingAnEvent || !placeholder || !cellRef.current) {
      return;
    }
    startEditing(cellRef, placeholder);
  }, [isCreatingAnEvent, placeholder, startEditing]);

  return (
    <DayTimeGridAllDayEventsCell
      className={classes.dayTimeGridAllDayEventsCell}
      ref={cellRef}
      value={day.value}
      addPropertiesToDroppedEvent={addPropertiesToDroppedEvent}
      style={
        {
          '--row-count': row.maxIndex,
        } as React.CSSProperties
      }
      aria-labelledby={`DayTimeGridHeaderCell-${adapter.getDate(day.value)} DayTimeGridAllDayEventsHeaderCell`}
      role="gridcell"
      data-weekend={isWeekend(adapter, day.value) || undefined}
      {...eventCreationProps}
    >
      <DayTimeGridAllDayEventsCellEvents className={classes.dayTimeGridAllDayEventsCellEvents}>
        {isLoading && <EventSkeleton data-variant="day-grid" />}
        {day.withPosition.map((occurrence) => {
          if (occurrence.position.isInvisible) {
            return (
              <DayGridEvent key={occurrence.key} occurrence={occurrence} variant="invisible" />
            );
          }

          return (
            <EventDialogTrigger key={occurrence.key} occurrence={occurrence}>
              <DayGridEvent occurrence={occurrence} variant="filled" />
            </EventDialogTrigger>
          );
        })}
        {placeholder != null && (
          <DayTimeGridAllDayEventContainer className={classes.dayTimeGridAllDayEventContainer}>
            <DayGridEvent occurrence={placeholder} variant="placeholder" />
          </DayTimeGridAllDayEventContainer>
        )}
      </DayTimeGridAllDayEventsCellEvents>
    </DayTimeGridAllDayEventsCell>
  );
}

interface DayGridCellProps {
  day: useEventOccurrencesWithDayGridPosition.DayData;
  row: useEventOccurrencesWithDayGridPosition.ReturnValue;
}

/**
 * Makes sure any event dropped in the day cell is turned into an all-day event.
 */
function addPropertiesToDroppedEvent() {
  return {
    allDay: true,
  };
}
