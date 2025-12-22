'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { useAdapter, isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-day-grid-position';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { eventCalendarOccurrencePlaceholderSelectors } from '@mui/x-scheduler-headless/event-calendar-selectors';
import { EventPopoverTrigger } from '../event-popover';
import { DayGridEvent } from '../event';
import { useEventPopoverContext } from '../event-popover/EventPopover';

import './DayTimeGrid.css';
import { useEventCreationProps } from '../../hooks/useEventCreationProps';

export function DayGridCell(props: DayGridCellProps) {
  const { day, row } = props;

  // Context hooks
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const { open: startEditing } = useEventPopoverContext();

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
    startEditing(cellRef.current, placeholder);
  }, [isCreatingAnEvent, placeholder, startEditing]);

  return (
    <CalendarGrid.DayCell
      ref={cellRef}
      value={day.value}
      addPropertiesToDroppedEvent={addPropertiesToDroppedEvent}
      className="DayTimeGridAllDayEventsCell"
      style={
        {
          '--row-count': row.maxIndex,
        } as React.CSSProperties
      }
      aria-labelledby={`DayTimeGridHeaderCell-${adapter.getDate(day.value)} DayTimeGridAllDayEventsHeaderCell`}
      role="gridcell"
      data-weekend={isWeekend(adapter, day.value) ? '' : undefined}
      {...eventCreationProps}
    >
      <div className="DayTimeGridAllDayEventsCellEvents">
        {day.withPosition.map((occurrence) => {
          if (occurrence.position.isInvisible) {
            return (
              <DayGridEvent key={occurrence.key} occurrence={occurrence} variant="invisible" />
            );
          }

          return (
            <EventPopoverTrigger
              key={occurrence.key}
              occurrence={occurrence}
              render={<DayGridEvent occurrence={occurrence} variant="filled" />}
            />
          );
        })}
        {placeholder != null && (
          <div className="DayTimeGridAllDayEventContainer">
            <DayGridEvent occurrence={placeholder} variant="placeholder" />
          </div>
        )}
      </div>
    </CalendarGrid.DayCell>
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
