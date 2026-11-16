import type { SchedulerEvent, SchedulerEventUpdatedProperties } from '../../models';
import { resolveEventTimestamp } from '../../process-event/resolveEventTimestamp';
import { allDayBoundToEventString, timestampToEventString } from './date-utils';
import { snapAllDayBounds } from './plain-date-utils/date';
import { toPlainDate } from './plain-date-utils/timeZone';

export interface EventDateChangeStrings {
  start?: string;
  end?: string;
  exDates?: string[];
}

/**
 * Writes the date changes of an event as the strings of its model: the days of an all-day event
 * in the display timezone, the instants of a timed event in the format of its stored strings.
 * `bounds` are the instants written when the changes give none. A timed event made all-day gets
 * whole displayed days, and its exception dates move to their displayed days.
 */
export function stringifyEventDateChanges(
  changes: Pick<SchedulerEventUpdatedProperties, 'allDay' | 'start' | 'end' | 'exDates'>,
  model: SchedulerEvent,
  displayTimezone: string,
  bounds?: { start: number; end: number },
): EventDateChangeStrings {
  const dataTimezone = model.timezone ?? 'default';
  const allDay = changes.allDay ?? model.allDay ?? false;
  const result: EventDateChangeStrings = {};
  let start = changes.start?.getTime() ?? bounds?.start;
  let end = changes.end?.getTime() ?? bounds?.end;

  if (!allDay) {
    if (start != null) {
      result.start = timestampToEventString(start, model.start, dataTimezone);
    }
    if (end != null) {
      result.end = timestampToEventString(end, model.end, dataTimezone);
    }
    if (changes.exDates != null) {
      // A new exception date matches the format of the one it replaces, or of start.
      result.exDates = changes.exDates.map((exDate, index) =>
        timestampToEventString(
          exDate.getTime(),
          model.exDates?.[index] ?? model.start,
          dataTimezone,
        ),
      );
    }
    return result;
  }

  const becomesAllDay = !model.allDay;
  if (becomesAllDay && (changes.start == null || changes.end == null)) {
    const snapped = snapAllDayBounds(
      bounds?.start ?? resolveEventTimestamp(model.start, dataTimezone),
      bounds?.end ?? resolveEventTimestamp(model.end, dataTimezone),
      displayTimezone,
    );
    start = changes.start?.getTime() ?? snapped.start;
    end = changes.end?.getTime() ?? snapped.end;
  }
  if (start != null) {
    result.start = allDayBoundToEventString(start, displayTimezone);
  }
  if (end != null) {
    result.end = allDayBoundToEventString(end, displayTimezone);
  }
  if (changes.exDates != null) {
    result.exDates = changes.exDates.map((exDate) =>
      allDayBoundToEventString(exDate.getTime(), displayTimezone),
    );
  } else if (becomesAllDay && model.exDates != null) {
    result.exDates = model.exDates.map((exDate) =>
      toPlainDate(resolveEventTimestamp(exDate, dataTimezone), displayTimezone).toString(),
    );
  }
  return result;
}
