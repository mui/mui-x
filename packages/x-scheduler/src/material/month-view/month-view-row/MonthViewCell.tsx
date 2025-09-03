'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { useAdapter } from '../../../primitives/utils/adapter/useAdapter';
import { DayGrid } from '../../../primitives/day-grid';
import { useEventCalendarContext } from '../../../primitives/utils/useEventCalendarContext';
import { DayGridEvent } from '../../internals/components/event/day-grid-event/DayGridEvent';
import { diffIn, isWeekend } from '../../../primitives/utils/date-utils';
import { useTranslations } from '../../internals/utils/TranslationsContext';
import { EventPopoverTrigger } from '../../internals/components/event-popover';
import { selectors } from '../../../primitives/use-event-calendar';
import { getEventWithLargestRowIndex } from '../../../primitives/utils/event-utils';
import { useEventOccurrencesWithRowIndex } from '../../../primitives/use-day-grid-row-event-occurrences';
import './MonthViewWeekRow.css';

export const MonthViewCell = React.forwardRef(function MonthViewCell(
  props: MonthViewCellProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { day, maxEvents, dayIndexInRow, rowLength } = props;
  const adapter = useAdapter();
  const { store, instance } = useEventCalendarContext();
  const translations = useTranslations();
  const placeholder = DayGrid.usePlaceholderInDay(day.value);
  const resourcesByIdMap = useStore(store, selectors.resourcesByIdMap);
  const hasDayView = useStore(store, selectors.hasDayView);
  const visibleDate = useStore(store, selectors.visibleDate);
  const initialDraggedEvent = useStore(store, selectors.getEventById, placeholder?.eventId ?? null);

  const isCurrentMonth = adapter.isSameMonth(day.value, visibleDate);
  const isFirstDayOfMonth = adapter.isSameDay(day.value, adapter.startOfMonth(day.value));
  const isToday = React.useMemo(() => adapter.isSameDay(day.value, adapter.date()), [adapter, day]);

  const draggedEvent = React.useMemo(() => {
    if (!initialDraggedEvent || !placeholder) {
      return null;
    }

    return { ...initialDraggedEvent, start: placeholder.start, end: placeholder.end };
  }, [initialDraggedEvent, placeholder]);

  const visibleAllDayEvents = day.allDayEvents.slice(0, maxEvents);
  const visibleEvents = day.regularEvents.slice(0, maxEvents - visibleAllDayEvents.length);
  const hiddenCount = day.regularEvents.length + day.allDayEvents.length - maxEvents;

  const rowCount =
    1 +
    getEventWithLargestRowIndex(day.allDayEvents) +
    visibleEvents.length +
    (hiddenCount > 0 ? 1 : 0);

  const cellNumberContent = (
    <span className="MonthViewCellNumber">
      {isFirstDayOfMonth
        ? adapter.formatByString(day.value, adapter.formats.shortDate)
        : adapter.formatByString(day.value, adapter.formats.dayOfMonth)}
    </span>
  );

  return (
    <DayGrid.Cell
      ref={ref}
      key={day.key}
      value={day.value}
      data-current={isToday ? '' : undefined}
      className={clsx(
        'MonthViewCell',
        !isCurrentMonth && 'OtherMonth',
        isToday && 'Today',
        isWeekend(adapter, day.value) && 'Weekend',
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
          onClick={(event) => instance.switchToDay(day.value, event)}
          tabIndex={0}
        >
          {cellNumberContent}
        </button>
      ) : (
        cellNumberContent
      )}
      <div className="MonthViewCellEvents">
        {visibleAllDayEvents.map((event) => {
          const durationInDays = diffIn(adapter, event.end, day.value, 'days') + 1;
          const gridColumnSpan = Math.min(durationInDays, rowLength - dayIndexInRow); // Don't exceed available columns
          const shouldRenderEvent =
            adapter.isSameDay(event.start, day.value) || dayIndexInRow === 0;

          return shouldRenderEvent ? (
            <EventPopoverTrigger
              key={`${event.id}-${day.key}`}
              event={event}
              render={
                <DayGridEvent
                  event={event}
                  eventResource={resourcesByIdMap.get(event.resource)}
                  variant="allDay"
                  ariaLabelledBy={`MonthViewHeaderCell-${day.key}`}
                  style={
                    {
                      '--grid-row': (event.eventRowIndex || 0) + 1,
                      '--grid-column-span': gridColumnSpan,
                    } as React.CSSProperties
                  }
                />
              }
            />
          ) : (
            <DayGridEvent
              key={`invisible-${event.id}-${day.key}`}
              event={event}
              eventResource={resourcesByIdMap.get(event.resource)}
              variant="invisible"
              ariaLabelledBy={`MonthViewHeaderCell-${day.key}`}
              aria-hidden="true"
              style={
                {
                  '--grid-row': (event.eventRowIndex || 0) + 1,
                } as React.CSSProperties
              }
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
                eventResource={resourcesByIdMap.get(event.resource)}
                variant="compact"
                ariaLabelledBy={`MonthViewHeaderCell-${day.key}`}
              />
            }
          />
        ))}
        {hiddenCount > 0 && day.regularEvents.length > 0 && (
          <p className="MonthViewMoreEvents">{translations.hiddenEvents(hiddenCount)}</p>
        )}
        {draggedEvent != null && (
          <div className="MonthViewDraggedEventContainer">
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
});

interface MonthViewCellProps {
  day: useEventOccurrencesWithRowIndex.DayData;
  maxEvents: number;
  dayIndexInRow: number;
  rowLength: number;
}
