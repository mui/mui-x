'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { CalendarGrid } from '../../../../primitives/calendar-grid';
import { useAdapter, isWeekend } from '../../../../primitives/use-adapter';
import { useEventOccurrencesWithDayGridPosition } from '../../../../primitives/use-event-occurrences-with-day-grid-position';
import { EventPopoverTrigger } from '../event-popover';
import { DayGridEvent } from '../event';
import { useEventCalendarStoreContext } from '../../../../primitives/use-event-calendar-store-context';
import { selectors } from '../../../../primitives/use-event-calendar';

import './DayTimeGrid.css';
import { useEventPopoverContext } from '../event-popover/EventPopoverContext';

export function DayGridCell(props: DayGridCellProps) {
  const { day, row } = props;
  const adapter = useAdapter();
  const placeholder = CalendarGrid.usePlaceholderInDay(day.value, row);
  const store = useEventCalendarStoreContext();
  const cellRef = React.useRef<HTMLDivElement | null>(null);
  const isCreation = useStore(store, selectors.isCreatingNewEventInDayCell, day.value);

  const { startEditing } = useEventPopoverContext();

  const handleDoubleClick = () => {
    store.setOccurrencePlaceholder({
      eventId: null,
      occurrenceKey: 'create-placeholder',
      surfaceType: 'day-grid',
      start: adapter.startOfDay(day.value),
      end: adapter.endOfDay(day.value),
      originalStart: null,
    });
  };

  React.useEffect(() => {
    if (!isCreation || !placeholder || !cellRef.current) {
      return;
    }
    startEditing(cellRef.current, placeholder);
  }, [isCreation, placeholder, startEditing]);

  return (
    <CalendarGrid.DayCell
      ref={cellRef}
      value={day.value}
      className="DayTimeGridAllDayEventsCell"
      style={
        {
          '--row-count': row.maxIndex,
        } as React.CSSProperties
      }
      aria-labelledby={`DayTimeGridHeaderCell-${adapter.getDate(day.value)} DayTimeGridAllDayEventsHeaderCell`}
      role="gridcell"
      data-weekend={isWeekend(adapter, day.value) ? '' : undefined}
      onDoubleClick={handleDoubleClick}
    >
      <div className="DayTimeGridAllDayEventsCellEvents">
        {day.withPosition.map((occurrence) => {
          if (occurrence.position.isInvisible) {
            return (
              <DayGridEvent
                key={occurrence.key}
                occurrence={occurrence}
                variant="invisible"
                ariaLabelledBy={`MonthViewHeaderCell-${day.key}`}
              />
            );
          }

          return (
            <EventPopoverTrigger
              key={occurrence.key}
              occurrence={occurrence}
              render={
                <DayGridEvent
                  occurrence={occurrence}
                  variant="allDay"
                  ariaLabelledBy={`MonthViewHeaderCell-${day.key}`}
                />
              }
            />
          );
        })}
        {placeholder != null && (
          <div className="DayTimeGridAllDayEventContainer">
            <DayGridEvent
              occurrence={placeholder}
              variant="placeholder"
              ariaLabelledBy={`MonthViewHeaderCell-${day.key}`}
            />
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
