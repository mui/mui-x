'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';

import { getEventWithLargestRowIndex } from '../../../../primitives/utils/event-utils';
import { DayGrid } from '../../../../primitives/day-grid';
import { useAdapter } from '../../../../primitives/utils/adapter/useAdapter';
import { diffIn, isWeekend } from '../../../../primitives/utils/date-utils';
import { useEventCalendarContext } from '../../../../primitives/utils/useEventCalendarContext';
import { useEventOccurrencesWithRowIndex } from '../../../../primitives/use-day-grid-row-event-occurrences';
import { selectors } from '../../../../primitives/use-event-calendar';
import { EventPopoverTrigger } from '../event-popover';
import { DayGridEvent } from '../event';
import './DayTimeGrid.css';

export function DayGridCell(props: DayGridCellProps) {
  const { day, dayIndexInRow, rowLength } = props;
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
          '--row-count': getEventWithLargestRowIndex(day.allDayEvents),
        } as React.CSSProperties
      }
      aria-labelledby={`DayTimeGridHeaderCell-${adapter.getDate(day.value)} DayTimeGridAllDayEventsHeaderCell`}
      role="gridcell"
      data-weekend={isWeekend(adapter, day.value) ? '' : undefined}
    >
      <div className="DayTimeGridAllDayEventsCellEvents">
        {day.allDayEvents.map((event) => {
          const durationInDays = diffIn(adapter, event.end, day.value, 'days') + 1;
          const gridColumnSpan = Math.min(durationInDays, rowLength - dayIndexInRow); // Don't exceed available columns
          const shouldRenderEvent =
            adapter.isSameDay(event.start, day.value) || dayIndexInRow === 0;

          return shouldRenderEvent ? (
            <EventPopoverTrigger
              key={`${event.key}-${day.toString()}`}
              event={event}
              render={
                <DayGridEvent
                  event={event}
                  eventResource={resourcesByIdMap.get(event.resource)}
                  variant="allDay"
                  ariaLabelledBy={`MonthViewHeaderCell-${day.toString()}`}
                  gridRow={event.eventRowIndex}
                  columnSpan={gridColumnSpan}
                />
              }
            />
          ) : (
            <DayGridEvent
              key={`invisible-${event.key}-${day.toString()}`}
              event={event}
              eventResource={resourcesByIdMap.get(event.resource)}
              variant="invisible"
              ariaLabelledBy={`MonthViewHeaderCell-${day.toString()}`}
              aria-hidden="true"
              gridRow={event.eventRowIndex}
            />
          );
        })}
        {draggedEvent != null && (
          <div className="DayTimeGridAllDayEventContainer">
            <DayGridEvent
              event={draggedEvent}
              eventResource={resourcesByIdMap.get(draggedEvent.resource)}
              variant="dragPlaceholder"
              ariaLabelledBy={`MonthViewHeaderCell-${day.toString()}`}
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
  day: useEventOccurrencesWithRowIndex.DayData;
  dayIndexInRow: number;
  rowLength: number;
}
