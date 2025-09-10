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
import { useEventOccurrencesPlacement } from '../../../primitives/use-event-occurrences-placement';
import './MonthViewWeekRow.css';

export const MonthViewCell = React.forwardRef(function MonthViewCell(
  props: MonthViewCellProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { day, maxEvents } = props;
  const adapter = useAdapter();
  const { store, instance } = useEventCalendarContext();
  const translations = useTranslations();
  const placeholder = DayGrid.usePlaceholderInDay(day.value);
  const hasDayView = useStore(store, selectors.hasDayView);
  const visibleDate = useStore(store, selectors.visibleDate);
  const initialDraggedEvent = useStore(store, selectors.event, placeholder?.eventId ?? null);

  const isCurrentMonth = adapter.isSameMonth(day.value, visibleDate);
  const isFirstDayOfMonth = adapter.isSameDay(day.value, adapter.startOfMonth(day.value));
  const isToday = React.useMemo(() => adapter.isSameDay(day.value, adapter.date()), [adapter, day]);

  const draggedEvent = React.useMemo(() => {
    if (!initialDraggedEvent || !placeholder) {
      return null;
    }

    return { ...initialDraggedEvent, start: placeholder.start, end: placeholder.end };
  }, [initialDraggedEvent, placeholder]);

  const visibleEvents = day.withPlacement.slice(0, maxEvents);
  const hiddenCount = day.withPlacement.length - maxEvents;

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
          // TODO: Fix, should be 1 + ... but the day number row takes too much space
          '--row-count': 2 + day.maxConcurrentEvents + (hiddenCount > 0 ? 1 : 0),
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
        {visibleEvents.map((event) => {
          if (event.placement.span > 0) {
            return (
              <EventPopoverTrigger
                key={`${event.id}-${day.key}`}
                event={event}
                render={
                  <DayGridEvent
                    event={event}
                    variant={event.allDay ? 'allDay' : 'compact'}
                    ariaLabelledBy={`MonthViewHeaderCell-${day.key}`}
                    gridRow={event.placement.index}
                    columnSpan={event.placement.span}
                  />
                }
              />
            );
          }

          return (
            <DayGridEvent
              key={`${event.id}-${day.key}`}
              event={event}
              variant="invisible"
              ariaLabelledBy={`MonthViewHeaderCell-${day.key}`}
              gridRow={event.placement.index}
            />
          );
        })}
        {hiddenCount > 0 && (
          <p className="MonthViewMoreEvents">{translations.hiddenEvents(hiddenCount)}</p>
        )}
        {draggedEvent != null && (
          <div className="MonthViewDraggedEventContainer">
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
});

interface MonthViewCellProps {
  day: useEventOccurrencesPlacement.DayData;
  maxEvents: number;
}
