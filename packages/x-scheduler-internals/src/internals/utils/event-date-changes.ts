import type { SchedulerEvent, SchedulerEventUpdatedProperties } from '../../models';
import { resolveEventTimestamp } from '../../process-event/resolveEventTimestamp';
import {
  allDayBoundToEventString,
  getAllDayUntil,
  timestampToEventString,
  untilToEventString,
} from './date-utils';
import { isDateOnlyString, snapAllDayBounds } from './plain-date-utils/date';
import {
  moveTimestampToPlainDate,
  toEpochMs,
  toPlainDate,
  toPlainDateTime,
} from './plain-date-utils/timeZone';
import { BaseTemporal } from './base-temporal';

export interface EventDateChangeStrings {
  start?: string;
  end?: string;
  exDates?: string[];
  rrule?: SchedulerEvent['rrule'];
  timezone?: string;
}

// The date-time forms of UNTIL: `20250709T030000Z` (UTC) or `20250709T030000` (event timezone).
const UNTIL_DATE_TIME_REGEX = /(UNTIL\s*=\s*)(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)/i;

/**
 * Rewrites the date-time UNTIL of an RRULE string, read on the wall clock of `dataTimezone`, as a
 * date.
 */
function replaceDateTimeUntil(
  rrule: string,
  dataTimezone: string,
  getDate: (until: BaseTemporal.PlainDateTime) => BaseTemporal.PlainDate,
): string {
  return rrule.replace(
    UNTIL_DATE_TIME_REGEX,
    (match, prefix, year, month, day, hour, minute, second, utc) => {
      const wallTime = BaseTemporal.PlainDateTime.from({
        year: +year,
        month: +month,
        day: +day,
        hour: +hour,
        minute: +minute,
        second: +second,
      });
      const until = utc ? toPlainDateTime(toEpochMs(wallTime, 'UTC'), dataTimezone) : wallTime;
      return `${prefix}${getDate(until).toString().replaceAll('-', '')}`;
    },
  );
}

// The date form of UNTIL, like `20250708`, not followed by a time.
const UNTIL_DATE_REGEX = /(UNTIL\s*=\s*)(\d{4})(\d{2})(\d{2})(?![T\d])/i;

// The time parts an all-day rule may carry, which a timed rule does not support.
const ALL_DAY_IGNORED_RRULE_KEYS = new Set(['BYHOUR', 'BYMINUTE', 'BYSECOND']);

/**
 * The rule of an all-day event made timed: a date `until` is written as the last instant of that
 * date in `timezone`, the timezone the event is written in, and the time parts an all-day RRULE
 * string ignores are dropped.
 */
function getTimedRRule(
  rrule: NonNullable<SchedulerEvent['rrule']>,
  start: string,
  timezone: string,
): NonNullable<SchedulerEvent['rrule']> {
  if (typeof rrule === 'object') {
    if (rrule.until == null || !isDateOnlyString(rrule.until)) {
      return rrule;
    }
    const until = BaseTemporal.PlainDate.from(rrule.until);
    return { ...rrule, until: untilToEventString(until, start, timezone, false) };
  }
  const parts = rrule.split(';');
  const timedParts = parts.filter(
    (part) => !ALL_DAY_IGNORED_RRULE_KEYS.has(part.split('=')[0].trim().toUpperCase()),
  );
  const timedRRule = timedParts.length === parts.length ? rrule : timedParts.join(';');
  return timedRRule.replace(UNTIL_DATE_REGEX, (match, prefix, year, month, day) => {
    const until = BaseTemporal.PlainDate.from({ year: +year, month: +month, day: +day });
    const lastSecond = Math.floor((toEpochMs(until.add({ days: 1 }), timezone) - 1) / 1000);
    // The UTC date-time form, like `20250708T145959Z`.
    const utc = new Date(lastSecond * 1000).toISOString().replace(/[-:]|\.000/g, '');
    return `${prefix}${utc}`;
  });
}

/**
 * The rule of a timed event made all-day: a date-time `until` is written as the last date it
 * covers in the event timezone.
 */
function getAllDayRRule(
  rrule: NonNullable<SchedulerEvent['rrule']>,
  start: string,
  dataTimezone: string,
): NonNullable<SchedulerEvent['rrule']> {
  const seriesStart = toPlainDateTime(resolveEventTimestamp(start, dataTimezone), dataTimezone);
  if (typeof rrule === 'object') {
    if (rrule.until == null || isDateOnlyString(rrule.until)) {
      return rrule;
    }
    const until = toPlainDateTime(resolveEventTimestamp(rrule.until, dataTimezone), dataTimezone);
    return { ...rrule, until: getAllDayUntil(until, seriesStart, dataTimezone).toString() };
  }
  return replaceDateTimeUntil(rrule, dataTimezone, (until) =>
    getAllDayUntil(until, seriesStart, dataTimezone),
  );
}

/**
 * Writes the date changes of an event as the strings of its model: the days of an all-day event
 * in the display timezone, the instants of a timed event in the format of its stored strings.
 * `bounds` are the instants written when the changes give none. A timed event made all-day without
 * bounds gets the whole days of its timezone, and so do its exception dates and the `until` of its
 * rule. An all-day event made timed moves to the display timezone, from 00:00 of its days when the
 * changes give no bounds, excludes its occurrences at its new time, and the date of its `until`
 * becomes the last instant of that date.
 */
export function stringifyEventDateChanges(
  changes: Pick<
    SchedulerEventUpdatedProperties,
    'allDay' | 'start' | 'end' | 'exDates' | 'rrule' | 'timezone'
  >,
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
      // A new exception date matches the format of the one it replaces, or of start. A string is
      // written as is.
      result.exDates = changes.exDates.map((exDate, index) =>
        typeof exDate === 'string'
          ? exDate
          : timestampToEventString(
              exDate.getTime(),
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
      // In the timezone the written wall times are read in, a given one included.
      const rrule = getTimedRRule(model.rrule, model.start, changes.timezone ?? timezone);
      if (rrule !== model.rrule) {
        result.rrule = rrule;
      }
    }
    return result;
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
      start = changes.start?.getTime() ?? snapped.start;
      end = changes.end?.getTime() ?? snapped.end;
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
      typeof exDate === 'string'
        ? exDate
        : allDayBoundToEventString(exDate.getTime(), displayTimezone),
    );
  } else if (becomesAllDay && model.exDates != null) {
    // An exception date keeps its day in the event timezone.
    result.exDates = model.exDates.map((exDate) =>
      toPlainDate(resolveEventTimestamp(exDate, dataTimezone), dataTimezone).toString(),
    );
  }
  if (
    becomesAllDay &&
    model.rrule != null &&
    !Object.prototype.hasOwnProperty.call(changes, 'rrule')
  ) {
    const rrule = getAllDayRRule(model.rrule, model.start, dataTimezone);
    if (rrule !== model.rrule) {
      result.rrule = rrule;
    }
  }
  return result;
}
