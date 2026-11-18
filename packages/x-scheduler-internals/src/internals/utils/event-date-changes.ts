import type {
  SchedulerEvent,
  SchedulerEventUpdatedProperties,
  SchedulerProcessedEvent,
} from '../../models';
import { resolveEventTimestamp } from '../../process-event/resolveEventTimestamp';
import {
  allDayBoundToEventString,
  timestampToEventString,
  resolveEditedBounds,
  untilToEventString,
  getUntilReferenceString,
} from './date-utils';
import { isDateOnlyString, snapAllDayBounds } from './plain-date-utils/date';
import { moveTimestampToPlainDate, toEpochMs, toPlainDate } from './plain-date-utils/timeZone';
import { getDayTimezone } from './event-utils';
import { BaseTemporal } from './base-temporal';

export interface EventDateChangeStrings {
  start?: string;
  end?: string;
  exDates?: string[];
  rrule?: SchedulerEvent['rrule'];
  timezone?: string;
}

/**
 * The rule of an all-day event made timed: a date-time `until`, read as its date in the event
 * timezone while the event is all-day, is written as that date.
 */
function getTimedRRule(
  rrule: NonNullable<SchedulerEvent['rrule']>,
  dataTimezone: string,
): NonNullable<SchedulerEvent['rrule']> {
  if (typeof rrule === 'object') {
    if (rrule.until == null || isDateOnlyString(rrule.until)) {
      return rrule;
    }
    const until = toPlainDate(resolveEventTimestamp(rrule.until, dataTimezone), dataTimezone);
    return { ...rrule, until: until.toString() };
  }
  // The date-time forms of UNTIL: `20250709T030000Z` (UTC) or `20250709T030000` (event timezone).
  return rrule.replace(
    /(UNTIL\s*=\s*)(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)/i,
    (match, prefix, year, month, day, hour, minute, second, utc) => {
      if (!utc) {
        return `${prefix}${year}${month}${day}`;
      }
      const instant = Date.UTC(+year, +month - 1, +day, +hour, +minute, +second);
      return `${prefix}${toPlainDate(instant, dataTimezone).toString().replaceAll('-', '')}`;
    },
  );
}

type EventDateKey = 'start' | 'end' | 'exDates' | 'rrule';
type WithEventDateStrings<TChanges> = {
  [K in keyof TChanges]: K extends EventDateKey ? SchedulerEvent[K] : TChanges[K];
};

/**
 * Writes edits in the event's format, resolving their wall-clock times in the timezone of the
 * original event. All-day dates use the display timezone and an exclusive end. Unchanged bounds
 * and exceptions retain their exact strings, including their offsets and milliseconds.
 * `bounds` supplies the defaults when deriving a new event from an occurrence.
 */
export function toEventDateStrings<
  TChanges extends Partial<
    Pick<SchedulerEventUpdatedProperties, EventDateKey | 'allDay' | 'timezone'>
  >,
>(
  changes: TChanges,
  event: SchedulerProcessedEvent,
  displayTimezone = 'default',
  bounds?: { start: number; end: number },
): WithEventDateStrings<TChanges> & EventDateChangeStrings {
  const model = event.modelInBuiltInFormat;
  const dataTimezone = model.timezone ?? 'default';
  const inputTimezone = getDayTimezone(event, displayTimezone);
  const allDay = changes.allDay ?? model.allDay ?? false;
  const result: EventDateChangeStrings = {};
  const resolved = resolveEditedBounds(
    changes,
    bounds ?? {
      start: event.start.timestamp,
      end: event.end.timestamp,
    },
    inputTimezone,
  );
  let start = resolved.start ?? bounds?.start;
  let end = resolved.end ?? bounds?.end;
  const readException = (date: BaseTemporal.PlainDateTime) => toEpochMs(date, inputTimezone);

  const finish = () => {
    if (changes.rrule?.until != null) {
      result.rrule = {
        ...changes.rrule,
        until: untilToEventString(
          changes.rrule.until,
          getUntilReferenceString(model),
          result.timezone ?? dataTimezone,
        ),
      };
    }
    return { ...changes, ...result } as WithEventDateStrings<TChanges> & EventDateChangeStrings;
  };

  if (!allDay) {
    const becomesTimed = model.allDay === true;
    const timezone = becomesTimed ? displayTimezone : dataTimezone;
    if (becomesTimed) {
      // A timezone given with the changes applies on top, like any timezone change.
      if (timezone !== dataTimezone && !Object.prototype.hasOwnProperty.call(changes, 'timezone')) {
        result.timezone = timezone;
      }
      start ??= toEpochMs(BaseTemporal.PlainDate.from(model.start), timezone);
      end ??= toEpochMs(BaseTemporal.PlainDate.from(model.end), timezone);
    }
    if (start != null) {
      result.start =
        !becomesTimed && start === event.start.timestamp
          ? model.start
          : timestampToEventString(start, model.start, timezone);
    }
    if (end != null) {
      result.end =
        !becomesTimed && end === event.end.timestamp
          ? model.end
          : timestampToEventString(end, model.end, timezone);
    }
    if (changes.exDates != null) {
      // A new exception date matches the format of the one it replaces, or of start.
      result.exDates = changes.exDates.map((exDate, index) =>
        event.exDates?.[index]?.equals(exDate) && !becomesTimed
          ? model.exDates![index]
          : timestampToEventString(
              readException(exDate),
              model.exDates?.[index] ?? model.start,
              timezone,
            ),
      );
    } else if (becomesTimed && model.exDates != null && start != null) {
      const timedStart = start;
      result.exDates = model.exDates.map((exDate) =>
        timestampToEventString(
          moveTimestampToPlainDate(timedStart, BaseTemporal.PlainDate.from(exDate), timezone),
          model.start,
          timezone,
        ),
      );
    }
    if (
      becomesTimed &&
      model.rrule != null &&
      !Object.prototype.hasOwnProperty.call(changes, 'rrule')
    ) {
      const rrule = getTimedRRule(model.rrule, dataTimezone);
      if (rrule !== model.rrule) {
        result.rrule = rrule;
      }
    }
    return finish();
  }

  const becomesAllDay = !model.allDay;
  const ownStart = bounds?.start ?? resolveEventTimestamp(model.start, dataTimezone);
  const ownEnd = bounds?.end ?? resolveEventTimestamp(model.end, dataTimezone);
  if (becomesAllDay && changes.start == null && changes.end == null) {
    // Without a day given, a timed event made all-day keeps the days of its own timezone, like
    // its rule.
    const snapped = snapAllDayBounds(ownStart, ownEnd, dataTimezone);
    result.start = toPlainDate(snapped.start, dataTimezone).toString();
    result.end = toPlainDate(snapped.end, dataTimezone).toString();
  } else {
    if (becomesAllDay && (changes.start == null || changes.end == null)) {
      // With one bound given, the other is snapped to the displayed days like it.
      const snapped = snapAllDayBounds(ownStart, ownEnd, displayTimezone);
      start = resolved.start ?? snapped.start;
      end = resolved.end ?? snapped.end;
    }
    if (start != null) {
      result.start = allDayBoundToEventString(start, displayTimezone);
    }
    if (end != null) {
      result.end = allDayBoundToEventString(end, displayTimezone);
    }
  }
  if (changes.exDates != null) {
    result.exDates = changes.exDates.map((exDate) =>
      allDayBoundToEventString(readException(exDate), displayTimezone),
    );
  } else if (becomesAllDay && model.exDates != null) {
    // An exception date keeps its day in the event timezone.
    result.exDates = model.exDates.map((exDate) =>
      toPlainDate(resolveEventTimestamp(exDate, dataTimezone), dataTimezone).toString(),
    );
  }
  return finish();
}
