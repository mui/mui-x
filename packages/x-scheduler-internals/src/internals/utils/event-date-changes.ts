import type { SchedulerEvent, SchedulerEventCreationProperties } from '../../models';
import { resolveEventTimestamp } from '../../process-event/resolveEventTimestamp';
import {
  allDayBoundToEventString,
  timestampToEventString,
  untilToEventString,
  getUntilReferenceString,
} from './date-utils';
import { isDateOnlyString, snapAllDayBounds } from './plain-date-utils/date';
import { moveTimestampToPlainDate, toEpochMs, toPlainDate } from './plain-date-utils/timeZone';
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
type EventDateInputs = Partial<
  Pick<SchedulerEventCreationProperties, EventDateKey | 'timezone' | 'allDay'>
>;
type WithEventDateStrings<TChanges> = {
  [K in keyof TChanges]: K extends EventDateKey ? SchedulerEvent[K] : TChanges[K];
};

/**
 * Writes timestamp edits in the event's format. All-day dates use the display timezone and an
 * exclusive end. A new event has no format to follow: its timed instants become ISO strings.
 * Strings are preserved. `bounds` supplies defaults when deriving an event from an occurrence.
 */
export function toEventDateStrings<TChanges extends EventDateInputs>(
  changes: TChanges,
  model: SchedulerEvent | null,
  displayTimezone = 'default',
  bounds?: { start: number; end: number },
): WithEventDateStrings<TChanges> & EventDateChangeStrings {
  const result: EventDateChangeStrings = {};
  const dataTimezone = model?.timezone ?? changes.timezone ?? 'default';
  const finish = () => {
    if (typeof changes.start === 'string') {
      result.start = changes.start;
    }
    if (typeof changes.end === 'string') {
      result.end = changes.end;
    }
    const rrule = changes.rrule;
    if (typeof rrule === 'object' && rrule.until != null && typeof rrule.until !== 'string') {
      result.rrule = {
        ...rrule,
        until: untilToEventString(
          rrule.until,
          model == null ? result.start! : getUntilReferenceString(model),
          result.timezone ?? changes.timezone ?? dataTimezone,
        ),
      };
    }
    return { ...changes, ...result } as WithEventDateStrings<TChanges> & EventDateChangeStrings;
  };
  if (model == null) {
    const formatNewDate = (value: string | number) => {
      if (typeof value === 'string') {
        return value;
      }
      return changes.allDay
        ? allDayBoundToEventString(value, displayTimezone)
        : new Date(value).toISOString();
    };
    if (changes.start != null) {
      result.start = formatNewDate(changes.start);
    }
    if (changes.end != null) {
      result.end = formatNewDate(changes.end);
    }
    if (changes.exDates != null) {
      result.exDates = changes.exDates.map(formatNewDate);
    }
    return finish();
  }
  const allDay = changes.allDay ?? model.allDay ?? false;
  const read = (value: string | number | undefined) =>
    typeof value === 'string'
      ? resolveEventTimestamp(value, allDay ? displayTimezone : dataTimezone)
      : value;
  let start = read(changes.start) ?? bounds?.start;
  let end = read(changes.end) ?? bounds?.end;

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
      result.start = timestampToEventString(start, model.start, timezone);
    }
    if (end != null) {
      result.end = timestampToEventString(end, model.end, timezone);
    }
    if (changes.exDates != null) {
      // A new exception date matches the format of the one it replaces, or of start.
      result.exDates = changes.exDates.map((exDate, index) =>
        typeof exDate === 'string'
          ? exDate
          : timestampToEventString(exDate, model.exDates?.[index] ?? model.start, timezone),
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
      start = read(changes.start) ?? snapped.start;
      end = read(changes.end) ?? snapped.end;
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
      typeof exDate === 'string' ? exDate : allDayBoundToEventString(exDate, displayTimezone),
    );
  } else if (becomesAllDay && model.exDates != null) {
    // An exception date keeps its day in the event timezone.
    result.exDates = model.exDates.map((exDate) =>
      toPlainDate(resolveEventTimestamp(exDate, dataTimezone), dataTimezone).toString(),
    );
  }
  return finish();
}
