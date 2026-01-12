'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { useAdapter, isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-day-grid-position';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { eventCalendarOccurrencePlaceholderSelectors } from '@mui/x-scheduler-headless/event-calendar-selectors';
import { DayGridEvent } from '../event';
import { useEventCreationProps } from '../../hooks/useEventCreationProps';
import { EventDraggableDialogTrigger } from '../draggable-dialog';
import { useEventDraggableDialogContext } from '../draggable-dialog/EventDraggableDialog';

const EVENT_HEIGHT = 22;

const DayTimeGridAllDayEventsCell = styled(CalendarGrid.DayCell, {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridAllDayEventsCell',
})(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: 0,
  minWidth: 0,
  position: 'relative',
  minHeight: `calc(var(--row-count, 0) * ${EVENT_HEIGHT}px + ${theme.spacing(0.5)})`,
  '&:first-of-type': {
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
  '&[data-weekend]': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const DayTimeGridAllDayEventsCellEvents = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridAllDayEventsCellEvents',
})({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

const DayTimeGridAllDayEventContainer = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayTimeGridAllDayEventContainer',
})({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
});

export function DayGridCell(props: DayGridCellProps) {
  const { day, row } = props;

  // Context hooks
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const { onOpen: startEditing } = useEventDraggableDialogContext();

  // Ref hooks
  const cellRef = React.useRef<HTMLDivElement | null>(null);

  // Selector hooks
  const isCreatingAnEvent = useStore(
    store,
    eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell,
    day.value,
  );
  const placeholder = CalendarGrid.usePlaceholderInDay(day.value, row);

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
      <DayTimeGridAllDayEventsCellEvents>
        {day.withPosition.map((occurrence) => {
          if (occurrence.position.isInvisible) {
            return (
              <DayGridEvent key={occurrence.key} occurrence={occurrence} variant="invisible" />
            );
          }

          return (
            <EventDraggableDialogTrigger key={occurrence.key} occurrence={occurrence}>
              <DayGridEvent occurrence={occurrence} variant="filled" />
            </EventDraggableDialogTrigger>
          );
        })}
        {placeholder != null && (
          <DayTimeGridAllDayEventContainer>
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
