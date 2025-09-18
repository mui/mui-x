'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import {
  SchedulerValidDate,
  CalendarEventOccurrenceWithPosition,
} from '../../../../primitives/models';
import {
  CREATE_PLACEHOLDER_ID,
  getEventWithLargestRowIndex,
} from '../../../../primitives/utils/event-utils';
import { DayGrid } from '../../../../primitives/day-grid';
import { useAdapter } from '../../../../primitives/utils/adapter/useAdapter';
import { diffIn, isWeekend } from '../../../../primitives/utils/date-utils';
import { useEventCalendarContext } from '../../hooks/useEventCalendarContext';
import { selectors } from '../../../../primitives/use-event-calendar';
import { EventPopoverTrigger } from '../event-popover';
import { DayGridEvent } from '../event';
import './DayTimeGrid.css';
import { useEventPopover } from '../event-popover/EventPopoverContext';
import { useCreateDraftOnDoubleClick } from '../../../../primitives/draft/useCreateDraftOnDoubleClick';

export function DayGridCell(props: DayGridCellProps) {
  const { day, allDayEvents, dayIndexInRow, rowLength } = props;
  const adapter = useAdapter();
  const { store } = useEventCalendarContext();
  const placeholder = DayGrid.usePlaceholderInDay(day);
  const initialDraggedEvent = useStore(store, selectors.event, placeholder?.eventId ?? null);
  const { startEditing } = useEventPopover();

  const draggedEvent = React.useMemo(() => {
    if (!initialDraggedEvent || !placeholder) {
      return null;
    }

    return { ...initialDraggedEvent, start: placeholder.start, end: placeholder.end };
  }, [initialDraggedEvent, placeholder]);

  const onDoubleClick = useCreateDraftOnDoubleClick({
    adapter,
    startEditing,
    computeInitialRange: () => {
      const dayStart = adapter.startOfDay(day);
      const dayEnd = adapter.endOfDay(day);
      return {
        start: dayStart,
        end: dayEnd,
        allDay: true,
        surface: 'day',
      };
    },
  });

  return (
    <DayGrid.Cell
      value={day}
      className="DayTimeGridAllDayEventsCell"
      style={
        {
          '--row-count': getEventWithLargestRowIndex(allDayEvents),
        } as React.CSSProperties
      }
      aria-labelledby={`DayTimeGridHeaderCell-${adapter.getDate(day)} DayTimeGridAllDayEventsHeaderCell`}
      role="gridcell"
      data-weekend={isWeekend(adapter, day) ? '' : undefined}
      onDoubleClick={onDoubleClick}
      data-surface="day"
    >
      <div className="DayTimeGridAllDayEventsCellEvents">
        {allDayEvents.map((event) => {
          const durationInDays = diffIn(adapter, event.end, day, 'days') + 1;
          const gridColumnSpan = Math.min(durationInDays, rowLength - dayIndexInRow); // Don't exceed available columns
          const shouldRenderEvent = adapter.isSameDay(event.start, day) || dayIndexInRow === 0;

          return shouldRenderEvent ? (
            <EventPopoverTrigger
              key={event.key}
              event={event}
              render={
                <DayGridEvent
                  event={event}
                  variant="allDay"
                  ariaLabelledBy={`MonthViewHeaderCell-${day.toString()}`}
                  gridRow={event.eventRowIndex}
                  columnSpan={gridColumnSpan}
                />
              }
            />
          ) : (
            <DayGridEvent
              key={event.key}
              event={event}
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
              variant="dragPlaceholder"
              ariaLabelledBy={`MonthViewHeaderCell-${day.toString()}`}
              gridRow={1} // TODO: Fix
              columnSpan={diffIn(adapter, draggedEvent.end, day, 'days') + 1}
            />
          </div>
        )}
        {placeholder && (
          <DayGridEvent
            event={{
              id: CREATE_PLACEHOLDER_ID,
              title: '',
              start: placeholder.start,
              end: placeholder.end,
              allDay: true,
            }}
            variant="createPlaceholder"
            ariaLabelledBy={`MonthViewHeaderCell-${day.toString()}`}
            gridRow={1} // TODO: Fix
            columnSpan={diffIn(adapter, placeholder.end, day, 'days') + 1}
          />
        )}
      </div>
    </DayGrid.Cell>
  );
}

interface DayGridCellProps {
  day: SchedulerValidDate;
  allDayEvents: CalendarEventOccurrenceWithPosition[];
  dayIndexInRow: number;
  rowLength: number;
}
