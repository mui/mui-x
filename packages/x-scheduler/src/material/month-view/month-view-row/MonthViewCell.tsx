'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { useAdapter } from '../../../primitives/utils/adapter/useAdapter';
import { DayGrid } from '../../../primitives/day-grid';
import { useEventCalendarStoreContext } from '../../../primitives/utils/useEventCalendarStoreContext';
import { DayGridEvent } from '../../internals/components/event/day-grid-event/DayGridEvent';
import { diffIn, isWeekend } from '../../../primitives/utils/date-utils';
import { useTranslations } from '../../internals/utils/TranslationsContext';
import { EventPopoverTrigger } from '../../internals/components/event-popover';
import { selectors } from '../../../primitives/use-event-calendar';
import { useEventOccurrencesWithDayGridPosition } from '../../../primitives/use-event-occurrences-with-day-grid-position';
import './MonthViewWeekRow.css';

export const MonthViewCell = React.forwardRef(function MonthViewCell(
  props: MonthViewCellProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { day, row, maxEvents } = props;
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const translations = useTranslations();
  const placeholder = DayGrid.usePlaceholderInDay(day.value);
  const hasDayView = useStore(store, selectors.hasDayView);
  const visibleDate = useStore(store, selectors.visibleDate);
  const initialDraggedEvent = useStore(store, selectors.event, placeholder?.eventId ?? null);

  const isCurrentMonth = adapter.isSameMonth(day.value, visibleDate);
  const isFirstDayOfMonth = adapter.isSameDay(day.value, adapter.startOfMonth(day.value));
  const isToday = React.useMemo(() => adapter.isSameDay(day.value, adapter.date()), [adapter, day]);

  const draggedOccurrence = React.useMemo(() => {
    if (!initialDraggedEvent || !placeholder) {
      return null;
    }

    let positionIndex = 1;
    for (const rowDay of row.days) {
      const found = rowDay.withPosition.find((o) => o.id === initialDraggedEvent.id);
      if (found) {
        positionIndex = found.position.index;
        break;
      }
    }

    return {
      ...initialDraggedEvent,
      start: placeholder.start,
      end: placeholder.end,
      key: `dragged-${initialDraggedEvent.id}`,
      position: {
        index: positionIndex,
        daySpan: diffIn(adapter, placeholder.end, day.value, 'days') + 1,
      },
    };
  }, [adapter, day.value, initialDraggedEvent, placeholder, row.days]);

  const visibleOccurrences =
    day.withPosition.length > maxEvents
      ? day.withPosition.slice(0, maxEvents - 1)
      : day.withPosition;
  const hiddenCount = day.withPosition.length - visibleOccurrences.length;

  const cellNumberContent = (
    <span className="MonthViewCellNumber">
      {isFirstDayOfMonth
        ? adapter.formatByString(day.value, adapter.formats.shortDate)
        : adapter.formatByString(day.value, adapter.formats.dayOfMonth)}
    </span>
  );

  // Day number header + max events
  const rowCount = 1 + maxEvents;

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
      style={{ '--row-count': rowCount } as React.CSSProperties}
    >
      {hasDayView ? (
        <button
          type="button"
          className="MonthViewCellNumberButton"
          onClick={(event) => store.switchToDay(day.value, event)}
          tabIndex={0}
        >
          {cellNumberContent}
        </button>
      ) : (
        cellNumberContent
      )}
      <div className="MonthViewCellEvents">
        {visibleOccurrences.map((occurrence) => {
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
                  variant={occurrence.allDay ? 'allDay' : 'compact'}
                  ariaLabelledBy={`MonthViewHeaderCell-${day.key}`}
                />
              }
            />
          );
        })}
        {hiddenCount > 0 && (
          <p className="MonthViewMoreEvents">{translations.hiddenEvents(hiddenCount)}</p>
        )}
        {draggedOccurrence != null && (
          <div className="MonthViewDraggedEventContainer">
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
});

interface MonthViewCellProps {
  day: useEventOccurrencesWithDayGridPosition.DayData;
  row: useEventOccurrencesWithDayGridPosition.ReturnValue;
  maxEvents: number;
}
