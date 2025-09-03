import {
  SchedulerValidDate,
  CalendarEvent,
  CalendarEventOccurrencesWithRowPlacement,
  CalendarEventOccurrence,
  CalendarProcessedDate,
} from '../models';
import { Adapter } from './adapter/types';
import { diffIn } from './date-utils';

/**
 *  Returns the largest `eventRowIndex` among all-day occurrences.
 *  Useful to know how many stacked rows are already used for a given day.
 *  @returns Highest row index found, or 0 if none.
 */
export function getEventWithLargestRowIndex(events: CalendarEventOccurrencesWithRowPlacement[]) {
  return (
    events.reduce(
      (maxEvent, event) =>
        event.placement.rowIndex > (maxEvent.placement.rowIndex ?? 0) ? event : maxEvent,
      { placement: { rowIndex: 0 } } as CalendarEventOccurrencesWithRowPlacement,
    ).placement.rowIndex || 0
  );
}

export function isDayWithinRange(
  day: SchedulerValidDate,
  eventFirstDay: SchedulerValidDate,
  eventLastDay: SchedulerValidDate,
  adapter: Adapter,
) {
  return (
    adapter.isSameDay(day, eventFirstDay) ||
    adapter.isSameDay(day, eventLastDay) ||
    (adapter.isAfter(day, eventFirstDay) && adapter.isBefore(day, eventLastDay))
  );
}

/**
 *  Computes the row index and the column span of an all-day occurrence when rendered in a given day.
 *  If the event is present in the previous day of the same row, reuses its row index and marks the occurrence as invisible in the current day.
 *  Otherwise, assigns the first free row index in that day’s all-day stack and compute how many days is should span across.
 *  @returns 1-based row index.
 */
export function getEventOccurrenceRowPlacement(
  parameters: GetEventOccurrenceRowPlacementParameters,
): GetEventOccurrenceRowPlacementReturnValue {
  const { adapter, rowIndexLookup, occurrence, day, previousDay, daysBeforeRowEnd } = parameters;

  // If the event is present in the previous day, we keep the same row index
  const occurrenceRowIndexInPreviousDay =
    previousDay == null
      ? null
      : rowIndexLookup[previousDay.key]?.occurrencesRowIndex[occurrence.key];

  if (occurrenceRowIndexInPreviousDay != null) {
    return { rowIndex: occurrenceRowIndexInPreviousDay, columnSpan: 0 };
  }

  // Otherwise, we just render the event on the first available row in the column
  const usedIndexes = rowIndexLookup[day.key]?.usedRowIndexes;
  let i = 1;
  if (usedIndexes) {
    while (usedIndexes.has(i)) {
      i += 1;
    }
  }

  const durationInDays = diffIn(adapter, occurrence.end, day.value, 'days') + 1;
  const columnSpan = Math.min(durationInDays, daysBeforeRowEnd); // Don't exceed available columns

  return { rowIndex: i, columnSpan };
}

export interface GetEventOccurrenceRowPlacementParameters {
  adapter: Adapter;
  occurrence: CalendarEventOccurrence;
  daysBeforeRowEnd: number;
  day: CalendarProcessedDate;
  previousDay: CalendarProcessedDate | null;
  rowIndexLookup: {
    [dayKey: string]: {
      occurrencesRowIndex: { [occurrenceKey: string]: number };
      usedRowIndexes: Set<number>;
    };
  };
}

export interface GetEventOccurrenceRowPlacementReturnValue {
  /**
   * The 1-based index of the row the event should be rendered in.
   */
  rowIndex: number;
  /**
   * The number of days the event should span across.
   * If 0, the event will be rendered as invisible.
   */
  columnSpan: number;
}

/**
 *  Returns the list of visible days an event should render on.
 *  When `shouldOnlyRenderEventInOneCell` is true, collapses multi-day to a single cell
 *  (first visible day, or the event’s start if it is inside the range).
 */
export function getEventDays(
  event: CalendarEvent,
  days: CalendarProcessedDate[],
  adapter: Adapter,
  eventPlacement: 'first-day' | 'every-day',
) {
  const eventFirstDay = adapter.startOfDay(event.start);
  const eventLastDay = adapter.endOfDay(event.end);

  if (eventPlacement === 'first-day') {
    if (adapter.isBefore(eventFirstDay, days[0].value)) {
      return [days[0].value];
    }
    return [eventFirstDay];
  }
  return days
    .filter((day) => isDayWithinRange(day.value, eventFirstDay, eventLastDay, adapter))
    .map((day) => day.value);
}

export function processDate(date: SchedulerValidDate, adapter: Adapter): CalendarProcessedDate {
  return {
    value: date,
    key: getDateKey(date, adapter),
  };
}

export function getDateKey(day: SchedulerValidDate, adapter: Adapter): string {
  return adapter.format(day, 'keyboardDate');
}
