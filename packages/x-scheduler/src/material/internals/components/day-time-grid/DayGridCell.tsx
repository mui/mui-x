'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';

import { DayGrid } from '../../../../primitives/day-grid';
import { useAdapter } from '../../../../primitives/utils/adapter/useAdapter';
import { diffIn, isWeekend } from '../../../../primitives/utils/date-utils';
import { useEventCalendarContext } from '../../../../primitives/utils/useEventCalendarContext';
import { useDayListEventOccurrencesWithPosition } from '../../../../primitives/use-day-list-event-occurrences-with-position';
import { selectors } from '../../../../primitives/use-event-calendar';
import { EventPopoverTrigger } from '../event-popover';
import { DayGridEvent } from '../event';
import './DayTimeGrid.css';

export function DayGridCell(props: DayGridCellProps) {
  const { day } = props;
  const adapter = useAdapter();
  const { store } = useEventCalendarContext();
  const placeholder = DayGrid.usePlaceholderInDay(day.value);
  const initialDraggedEvent = useStore(store, selectors.event, placeholder?.eventId ?? null);

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
          '--row-count': day.maxConcurrentEvents,
        } as React.CSSProperties
      }
      aria-labelledby={`DayTimeGridHeaderCell-${adapter.getDate(day.value)} DayTimeGridAllDayEventsHeaderCell`}
      role="gridcell"
      data-weekend={isWeekend(adapter, day.value) ? '' : undefined}
    >
      <div className="DayTimeGridAllDayEventsCellEvents">
        {day.withPosition.map((event) => {
          if (event.position.span > 0) {
            return (
              <EventPopoverTrigger
                key={event.key}
                event={event}
                render={
                  <DayGridEvent
                    event={event}
                    variant="allDay"
                    ariaLabelledBy={`MonthViewHeaderCell-${day.key}`}
                    gridRow={event.position.index}
                    columnSpan={event.position.span}
                  />
                }
              />
            );
          }

          return (
            <DayGridEvent
              key={event.key}
              event={event}
              variant="invisible"
              ariaLabelledBy={`MonthViewHeaderCell-${day.key}`}
              gridRow={event.position.index}
            />
          );
        })}
        {draggedEvent != null && (
          <div className="DayTimeGridAllDayEventContainer">
            <DayGridEvent
              event={draggedEvent}
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
  day: useDayListEventOccurrencesWithPosition.DayData;
}
