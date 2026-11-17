import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { schedulerEventSelectors, schedulerOtherSelectors } from '../../scheduler-selectors';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { useCalendarGridDayRowContext } from '../day-row/CalendarGridDayRowContext';
import type { useEventOccurrencesWithDayGridPosition } from '../../use-event-occurrences-with-day-grid-position';
import { eventCalendarOccurrencePlaceholderSelectors } from '../../event-calendar-selectors';
import { isInternalDragOrResizePlaceholder } from '../../internals/utils/drag-utils';
import {
  getPlaceholderOccurrence,
  getPlaceholderOccurrenceKey,
} from '../../internals/utils/placeholder-occurrence';
import { toLocalDayNumber } from '../../internals/utils/plain-date-utils/timeZone';
import { getDayGridCellSpan } from '../../use-event-occurrences-with-day-grid-position';

export function useCalendarGridPlaceholderInDay(
  day: useEventOccurrencesWithDayGridPosition.DayData,
  row: useEventOccurrencesWithDayGridPosition.ReturnValue,
  maxEvents?: number,
): useEventOccurrencesWithDayGridPosition.EventOccurrencePlaceholderWithPosition | null {
  const store = useEventCalendarStoreContext();
  const { start: rowStart, end: rowEnd } = useCalendarGridDayRowContext().axis;

  const rawPlaceholder = useStore(
    store,
    eventCalendarOccurrencePlaceholderSelectors.placeholderInDayCell,
    day,
    rowStart,
  );

  const originalEventId = isInternalDragOrResizePlaceholder(rawPlaceholder)
    ? rawPlaceholder.eventId
    : null;
  const originalEvent = useStore(store, schedulerEventSelectors.processedEvent, originalEventId);
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);

  return React.useMemo(() => {
    if (!rawPlaceholder) {
      return null;
    }

    // The placeholder can run past the week row: the next rows render their own piece.
    const endInRow = Math.min(rawPlaceholder.end, rowEnd);
    // A creation renders its piece of this row, from the day of the cell.
    const placeholder =
      rawPlaceholder.type === 'creation'
        ? { ...rawPlaceholder, start: day.timestamp, end: endInRow }
        : rawPlaceholder;
    // The placeholder covers the cells of every date up to its end, like the occurrences.
    const daySpan = getDayGridCellSpan(
      row.days,
      row.days.indexOf(day),
      toLocalDayNumber(endInRow, displayTimezone),
    );

    // The first row of the day that no other occurrence uses, capped to the rows the cell shows.
    const occurrenceKey = getPlaceholderOccurrenceKey(rawPlaceholder);
    const usedIndexes = new Set(
      day.withPosition
        .filter((occurrence) => occurrence.key !== occurrenceKey)
        .map((occurrence) => occurrence.position.index),
    );
    let index = 1;
    while (usedIndexes.has(index)) {
      index += 1;
    }
    if (maxEvents != null && index > maxEvents) {
      index = maxEvents;
    }

    return {
      ...getPlaceholderOccurrence(placeholder, originalEvent, displayTimezone),
      position: { index, daySpan },
    };
  }, [day, displayTimezone, maxEvents, originalEvent, rawPlaceholder, row.days, rowEnd]);
}
