'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import {
  CalendarEvent,
  CalendarEventOccurrenceWithPosition,
  SchedulerValidDate,
} from '../../../primitives/models';
import { useAdapter } from '../../../primitives/utils/adapter/useAdapter';
import { DayGrid } from '../../../primitives/day-grid';
import { useEventCalendarContext } from '../../internals/hooks/useEventCalendarContext';
import { DayGridEvent } from '../../internals/components/event/day-grid-event/DayGridEvent';
import { diffIn, isWeekend } from '../../../primitives/utils/date-utils';
import { useTranslations } from '../../internals/utils/TranslationsContext';
import { EventPopoverTrigger } from '../../internals/components/event-popover';
import { selectors } from '../../../primitives/use-event-calendar';
import { getEventWithLargestRowIndex } from '../../../primitives/utils/event-utils';
import './MonthViewWeekRow.css';

export const MonthViewCell = React.forwardRef(function MonthViewCell(
  props: MonthViewCellProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { day, events, allDayEvents, maxEvents, dayIndexInRow, rowLength } = props;
  const adapter = useAdapter();
  const { store, instance } = useEventCalendarContext();
  const translations = useTranslations();
  const placeholder = DayGrid.usePlaceholderInDay(day);
  const hasDayView = useStore(store, selectors.hasDayView);
  const visibleDate = useStore(store, selectors.visibleDate);
  const initialDraggedEvent = useStore(store, selectors.event, placeholder?.eventId ?? null);

  const isCurrentMonth = adapter.isSameMonth(day, visibleDate);
  const isFirstDayOfMonth = adapter.isSameDay(day, adapter.startOfMonth(day));
  const isToday = React.useMemo(() => adapter.isSameDay(day, adapter.date()), [adapter, day]);

  const draggedEvent = React.useMemo(() => {
    if (!initialDraggedEvent || !placeholder) {
      return null;
    }

    return { ...initialDraggedEvent, start: placeholder.start, end: placeholder.end };
  }, [initialDraggedEvent, placeholder]);

  const visibleAllDayEvents = allDayEvents.slice(0, maxEvents);
  const visibleEvents = events.slice(0, maxEvents - visibleAllDayEvents.length);
  const hiddenCount = events.length + allDayEvents.length - maxEvents;

  const rowCount =
    1 +
    getEventWithLargestRowIndex(allDayEvents) +
    visibleEvents.length +
    (hiddenCount > 0 ? 1 : 0);

  const cellNumberContent = (
    <span className="MonthViewCellNumber">
      {isFirstDayOfMonth
        ? adapter.formatByString(day, adapter.formats.shortDate)
        : adapter.formatByString(day, adapter.formats.dayOfMonth)}
    </span>
  );

  return (
    <DayGrid.Cell
      ref={ref}
      key={day.toString()}
      value={day}
      data-current={isToday ? '' : undefined}
      className={clsx(
        'MonthViewCell',
        !isCurrentMonth && 'OtherMonth',
        isToday && 'Today',
        isWeekend(adapter, day) && 'Weekend',
      )}
      style={
        {
          '--row-count': rowCount,
        } as React.CSSProperties
      }
    >
      {hasDayView ? (
        <button
          type="button"
          className="MonthViewCellNumberButton"
          onClick={(event) => instance.switchToDay(day, event)}
          tabIndex={0}
        >
          {cellNumberContent}
        </button>
      ) : (
        cellNumberContent
      )}
      <div className="MonthViewCellEvents">
        {visibleAllDayEvents.map((event) => {
          const durationInDays = diffIn(adapter, event.end, day, 'days') + 1;
          const gridColumnSpan = Math.min(durationInDays, rowLength - dayIndexInRow); // Don't exceed available columns
          const shouldRenderEvent = adapter.isSameDay(event.start, day) || dayIndexInRow === 0;

          return shouldRenderEvent ? (
            <EventPopoverTrigger
              key={`${event.id}-${day.toString()}`}
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
              key={`invisible-${event.id}-${day.toString()}`}
              event={event}
              variant="invisible"
              ariaLabelledBy={`MonthViewHeaderCell-${day.toString()}`}
              aria-hidden="true"
              gridRow={event.eventRowIndex}
            />
          );
        })}
        {visibleEvents.map((event) => (
          <EventPopoverTrigger
            key={event.id}
            event={event}
            render={
              <DayGridEvent
                event={event}
                variant="compact"
                ariaLabelledBy={`MonthViewHeaderCell-${day.toString()}`}
              />
            }
          />
        ))}
        {hiddenCount > 0 && events.length > 0 && (
          <p className="MonthViewMoreEvents">{translations.hiddenEvents(hiddenCount)}</p>
        )}
        {draggedEvent != null && (
          <div className="MonthViewDraggedEventContainer">
            <DayGridEvent
              event={draggedEvent}
              variant="dragPlaceholder"
              ariaLabelledBy={`MonthViewHeaderCell-${day.toString()}`}
              gridRow={1} // TODO: Fix
              columnSpan={diffIn(adapter, draggedEvent.end, day, 'days') + 1}
            />
          </div>
        )}
      </div>
    </DayGrid.Cell>
  );
});

interface MonthViewCellProps {
  day: SchedulerValidDate;
  events: CalendarEvent[];
  allDayEvents: CalendarEventOccurrenceWithPosition[];
  maxEvents: number;
  dayIndexInRow: number;
  rowLength: number;
}
