'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';

import { DayGrid } from '../../../../primitives/day-grid';
import { useAdapter } from '../../../../primitives/utils/adapter/useAdapter';
import { diffIn, isWeekend } from '../../../../primitives/utils/date-utils';
import { useEventCalendarStoreContext } from '../../../../primitives/utils/useEventCalendarStoreContext';
import { useEventOccurrencesWithDayGridPosition } from '../../../../primitives/use-event-occurrences-with-day-grid-position';
import { selectors } from '../../../../primitives/use-event-calendar';
import { EventPopoverTrigger } from '../event-popover';
import { DayGridEvent } from '../event';
import './DayTimeGrid.css';

export function DayGridCell(props: DayGridCellProps) {
  const { day } = props;
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const placeholder = DayGrid.usePlaceholderInDay(day.value);
  const initialDraggedEvent = useStore(store, selectors.event, placeholder?.eventId ?? null);

  const draggedOccurrence = React.useMemo(() => {
    if (!initialDraggedEvent || !placeholder) {
      return null;
    }

    return {
      ...initialDraggedEvent,
      start: placeholder.start,
      end: placeholder.end,
      key: `dragged-${initialDraggedEvent.id}`,
      position: {
        // TODO: Apply the same index as the initial event if present in the row, 1 otherwise
        index: 1,
        daySpan: diffIn(adapter, placeholder.end, day.value, 'days') + 1,
      },
    };
  }, [initialDraggedEvent, placeholder, adapter, day.value]);

  return (
    <DayGrid.Cell
      value={day.value}
      className="DayTimeGridAllDayEventsCell"
      style={
        {
          '--row-count': day.maxIndex,
        } as React.CSSProperties
      }
      aria-labelledby={`DayTimeGridHeaderCell-${adapter.getDate(day.value)} DayTimeGridAllDayEventsHeaderCell`}
      role="gridcell"
      data-weekend={isWeekend(adapter, day.value) ? '' : undefined}
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
        {draggedOccurrence != null && (
          <div className="DayTimeGridAllDayEventContainer">
            <DayGridEvent
              occurrence={draggedOccurrence}
              variant="dragPlaceholder"
              ariaLabelledBy={`MonthViewHeaderCell-${day.key}`}
            />
          </div>
        )}
      </div>
    </DayGrid.Cell>
  );
}

interface DayGridCellProps {
  day: useEventOccurrencesWithDayGridPosition.DayData;
}
