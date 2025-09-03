'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';

import { getEventWithLargestRowIndex } from '../../../../primitives/utils/event-utils';
import { DayGrid } from '../../../../primitives/day-grid';
import { useAdapter } from '../../../../primitives/utils/adapter/useAdapter';
import { diffIn, isWeekend } from '../../../../primitives/utils/date-utils';
import { useEventCalendarContext } from '../../../../primitives/utils/useEventCalendarContext';
import { useAddRowPlacementToEventOccurrences } from '../../../../primitives/use-row-event-occurrences';
import { selectors } from '../../../../primitives/use-event-calendar';
import { EventPopoverTrigger } from '../event-popover';
import { DayGridEvent } from '../event';
import './DayTimeGrid.css';

export function DayGridCell(props: DayGridCellProps) {
  const { day } = props;
  const adapter = useAdapter();
  const { store } = useEventCalendarContext();
  const resourcesByIdMap = useStore(store, selectors.resourcesByIdMap);
  const placeholder = DayGrid.usePlaceholderInDay(day.value);
  const initialDraggedEvent = useStore(store, selectors.getEventById, placeholder?.eventId ?? null);

  const draggedEvent = React.useMemo(() => {
    if (!initialDraggedEvent || !placeholder) {
      return null;
    }

    return { ...initialDraggedEvent, start: placeholder.start, end: placeholder.end };
  }, [initialDraggedEvent, placeholder]);

  return (
    <DayGrid.Cell
      value={day.value}
      className="DayTimeGridAllDayEventsCell"
      style={
        {
          '--row-count': getEventWithLargestRowIndex(day.withRowPlacement),
        } as React.CSSProperties
      }
      aria-labelledby={`DayTimeGridHeaderCell-${adapter.getDate(day.value)} DayTimeGridAllDayEventsHeaderCell`}
      role="gridcell"
      data-weekend={isWeekend(adapter, day.value) ? '' : undefined}
    >
      <div className="DayTimeGridAllDayEventsCellEvents">
        {day.withRowPlacement.map((event) => {
          if (event.placement.columnSpan > 0) {
            return (
              <EventPopoverTrigger
                key={`${event.key}-${day.key}`}
                event={event}
                render={
                  <DayGridEvent
                    event={event}
                    eventResource={resourcesByIdMap.get(event.resource)}
                    variant="allDay"
                    ariaLabelledBy={`MonthViewHeaderCell-${day.key}`}
                    gridRow={event.placement.rowIndex}
                    columnSpan={event.placement.columnSpan}
                  />
                }
              />
            );
          }

          return (
            <DayGridEvent
              key={`${event.key}-${day.key}`}
              event={event}
              eventResource={resourcesByIdMap.get(event.resource)}
              variant="invisible"
              ariaLabelledBy={`MonthViewHeaderCell-${day.key}`}
              gridRow={event.placement.rowIndex}
            />
          );
        })}
        {draggedEvent != null && (
          <div className="DayTimeGridAllDayEventContainer">
            <DayGridEvent
              event={draggedEvent}
              eventResource={resourcesByIdMap.get(draggedEvent.resource)}
              variant="dragPlaceholder"
              ariaLabelledBy={`MonthViewHeaderCell-${day.key}`}
              gridRow={1} // TODO: Fix
              columnSpan={diffIn(adapter, draggedEvent.end, day.value, 'days') + 1}
            />
          </div>
        )}
      </div>
    </DayGrid.Cell>
  );
}

interface DayGridCellProps {
  day: useAddRowPlacementToEventOccurrences.DayData;
}
