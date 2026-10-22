import type { TemporalSupportedObject, TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import type {
  RecurringEventByDayValue,
  RecurringEventFrequency,
  SchedulerProcessedEventRecurrenceRule,
  SchedulerEventRecurrenceRule,
} from '@mui/x-scheduler-internals/models';
import { resolveEventDate } from '@mui/x-scheduler-internals/process-event';
import {
  getAdapterCache,
  NOT_LOCALIZED_WEEK_DAYS_INDEXES,
  parsesByDayForMonthlyFrequency,
  parsesByDayForWeeklyFrequency,
  tokenizeByDay,
} from './internal-utils';

// `yyyyMMddTHHmmssZ`, the UTC date-time form of `UNTIL`.
const UNTIL_UTC_REGEX = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/;

/**
 * Reads a UTC `UNTIL` without going through the host timezone, whose daylight saving gap
 * would shift some times. Returns `null` for a malformed value or a date that does not
 * exist: the date setters roll them over (February 31st becomes March 3rd).
 */
function parseUntilUtc(adapter: Adapter, value: string): TemporalSupportedObject | null {
  const match = UNTIL_UTC_REGEX.exec(value);
  if (!match) {
    return null;
  }
  const [year, month, day, hours, minutes, seconds] = match.slice(1).map(Number);
  // Not `Date.UTC`, which maps the years 0 to 99 to 1900 to 1999.
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(hours, minutes, seconds);
  const exists =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    date.getUTCHours() === hours &&
    date.getUTCMinutes() === minutes &&
    date.getUTCSeconds() === seconds;
  return exists ? adapter.date(date.toISOString(), 'default') : null;
}

const SUPPORTED_RRULE_KEYS = new Set([
  'FREQ',
  'INTERVAL',
  'BYDAY',
  'BYMONTHDAY',
  'BYMONTH',
  'UNTIL',
  'COUNT',
]);

// Fails to compile if `RecurringEventFrequency` gains or loses a member, keeping the runtime check in sync with the type.
const SUPPORTED_FREQUENCIES: Record<RecurringEventFrequency, true> = {
  DAILY: true,
  WEEKLY: true,
  MONTHLY: true,
  YEARLY: true,
};

function validateFreq(freq: string): RecurringEventFrequency {
  if (!freq) {
    throw new Error(
      'MUI X Scheduler: The recurrence rule must include a FREQ value. ' +
        'The frequency (DAILY, WEEKLY, MONTHLY, or YEARLY) is required for recurrence rules. ' +
        'Provide a freq value.',
    );
  }
  if (!Object.prototype.hasOwnProperty.call(SUPPORTED_FREQUENCIES, freq)) {
    throw new Error(
      `MUI X Scheduler: Invalid FREQ value "${freq}". ` +
        'The frequency must be one of DAILY, WEEKLY, MONTHLY, or YEARLY. ' +
        'Provide a supported frequency value.',
    );
  }
  return freq as RecurringEventFrequency;
}

function throwInvalidInterval(value: string | number): never {
  throw new Error(
    `MUI X Scheduler: Invalid INTERVAL value "${value}". ` +
      'INTERVAL must be a positive integer (1 or greater). ' +
      'Provide a valid interval value.',
  );
}

function throwInvalidByMonthDay(value: string): never {
  throw new Error(
    `MUI X Scheduler: Invalid BYMONTHDAY values "${value}". ` +
      'BYMONTHDAY values must be integers between 1 and 31. ' +
      'Provide valid day of month values.',
  );
}

function isValidMonthDay(day: number): boolean {
  return Number.isInteger(day) && day >= 1 && day <= 31;
}

/**
 * Rejects the rules whose occurrences can't be computed, for the string and object forms.
 */
function validateRule(rule: SchedulerProcessedEventRecurrenceRule): void {
  const hasCount = typeof rule.count === 'number' && rule.count > 0;
  if (hasCount && rule.until) {
    throw new Error(
      'MUI X Scheduler: The recurring rule cannot have both count and until properties. ' +
        'A recurrence rule should specify either a count (number of occurrences) or an until date, but not both. ' +
        'Remove one of these properties from the recurrence rule.',
    );
  }

  switch (rule.freq) {
    case 'WEEKLY': {
      parsesByDayForWeeklyFrequency(rule.byDay);
      break;
    }
    case 'MONTHLY': {
      if (rule.byDay?.length && rule.byMonthDay?.length) {
        throw new Error(
          'MUI X Scheduler: Monthly recurrences cannot have both byDay and byMonthDay properties. ' +
            'Specify either specific weekdays (byDay) or specific dates (byMonthDay), but not both. ' +
            'Remove one of these properties from the recurrence rule.',
        );
      }
      if (rule.byDay?.length) {
        parsesByDayForMonthlyFrequency(rule.byDay);
      }
      // Without COUNT, only the first value is used.
      if (hasCount && (rule.byMonthDay?.length ?? 0) > 1) {
        throw new Error(
          'MUI X Scheduler: Monthly recurrences only support a single byMonthDay value. ' +
            'Multiple byMonthDay values are not supported. ' +
            'Provide only one day of the month value.',
        );
      }
      break;
    }
    case 'YEARLY': {
      // Only exact "same month + same day" recurrence is supported.
      if (rule.byMonth?.length || rule.byMonthDay?.length || rule.byDay?.length) {
        throw new Error(
          'MUI X Scheduler: Yearly recurrences only support exact same date recurrence. ' +
            'The yearly frequency repeats on the same month and day as DTSTART. ' +
            'Remove byMonth, byMonthDay, and byDay properties for yearly recurrence.',
        );
      }
      break;
    }
    default:
      break;
  }
}

/**
 * Reads a rule object. Its INTERVAL is truncated, and an INTERVAL below 1 counts as 1.
 * Its BYMONTHDAY values are validated like the ones of an RRULE string.
 */
function readRuleObject(
  adapter: Adapter,
  input: SchedulerEventRecurrenceRule,
  timezone: TemporalTimezone,
): SchedulerProcessedEventRecurrenceRule {
  // The typed object API validates `freq` as-is; unlike the RRULE string below, it is not normalized.
  validateFreq(input.freq);
  let rule = input as SchedulerProcessedEventRecurrenceRule;
  if (input.interval != null) {
    if (!Number.isFinite(input.interval)) {
      throwInvalidInterval(input.interval);
    }
    const interval = Math.max(1, Math.trunc(input.interval));
    if (interval !== input.interval) {
      rule = { ...rule, interval };
    }
  }
  if (input.byMonthDay != null && !input.byMonthDay.every(isValidMonthDay)) {
    throwInvalidByMonthDay(input.byMonthDay.join(','));
  }
  if (input.until != null) {
    rule = { ...rule, until: resolveEventDate(input.until, timezone, adapter) };
  }
  return rule;
}

/**
 * Reads and validates a recurrence rule, from an RRULE string or a rule object.
 * The occurrences of the rules it returns can be computed.
 */
export function parseRRule(
  adapter: Adapter,
  input: string | SchedulerEventRecurrenceRule,
  timezone: TemporalTimezone,
): SchedulerProcessedEventRecurrenceRule {
  const rule =
    typeof input === 'object'
      ? readRuleObject(adapter, input, timezone)
      : readRuleString(adapter, input, timezone);
  validateRule(rule);
  return rule;
}

function readRuleString(
  adapter: Adapter,
  input: string,
  timezone: TemporalTimezone,
): SchedulerProcessedEventRecurrenceRule {
  const rruleObject: Record<string, string> = {};
  const parts = input
    .split(';')
    .map((p) => p.trim())
    .filter(Boolean);

  for (const part of parts) {
    const [rawKey, rawValue] = part.split('=');
    const key = rawKey?.trim().toUpperCase();
    const value = rawValue?.trim().toUpperCase();

    if (!key || !value) {
      throw new Error(
        `MUI X Scheduler: Invalid RRULE part "${part}". ` +
          'Each RRULE part must be in the format "KEY=VALUE". ' +
          'Check the recurrence rule string format.',
      );
    }

    if (!SUPPORTED_RRULE_KEYS.has(key)) {
      throw new Error(
        `MUI X Scheduler: Unsupported RRULE property "${key}". ` +
          `Supported properties are: ${Array.from(SUPPORTED_RRULE_KEYS).join(', ')}. ` +
          'Remove or replace the unsupported property.',
      );
    }

    rruleObject[key] = value;
  }

  if (!rruleObject.FREQ) {
    throw new Error(
      'MUI X Scheduler: RRULE must include a FREQ property. ' +
        'The frequency (DAILY, WEEKLY, MONTHLY, or YEARLY) is required for recurrence rules. ' +
        'Add a FREQ property to the RRULE string.',
    );
  }

  const rrule: SchedulerProcessedEventRecurrenceRule = {
    freq: validateFreq(rruleObject.FREQ),
  };

  if (rruleObject.INTERVAL) {
    const interval = Number(rruleObject.INTERVAL);
    if (!Number.isInteger(interval) || interval < 1) {
      throwInvalidInterval(rruleObject.INTERVAL);
    }
    rrule.interval = interval;
  }

  if (rruleObject.BYDAY) {
    const tokens = rruleObject.BYDAY.split(',').map((v) => v.trim()) as RecurringEventByDayValue[];
    rrule.byDay = sortByDayValues(tokens);
  }

  if (rruleObject.BYMONTHDAY) {
    const days = rruleObject.BYMONTHDAY.split(',').map((d) => Number(d.trim()));
    if (!days.every(isValidMonthDay)) {
      throwInvalidByMonthDay(rruleObject.BYMONTHDAY);
    }
    rrule.byMonthDay = days.toSorted((a, b) => a - b);
  }

  if (rruleObject.BYMONTH) {
    const months = rruleObject.BYMONTH.split(',').map((m) => Number(m.trim()));
    if (months.some((m) => Number.isNaN(m) || m < 1 || m > 12)) {
      throw new Error(
        `MUI X Scheduler: Invalid BYMONTH values "${rruleObject.BYMONTH}". ` +
          'BYMONTH values must be integers between 1 and 12. ' +
          'Provide valid month values.',
      );
    }
    rrule.byMonth = months.toSorted((a, b) => a - b);
  }

  if (rruleObject.COUNT) {
    const count = Number(rruleObject.COUNT);
    if (Number.isNaN(count) || count < 1) {
      throw new Error(
        `MUI X Scheduler: Invalid COUNT value "${rruleObject.COUNT}". ` +
          'COUNT must be a positive integer (1 or greater). ' +
          'Provide a valid count value.',
      );
    }
    rrule.count = count;
  }

  if (rruleObject.UNTIL) {
    // The trailing `Z` makes the value a UTC instant (RFC 5545).
    const parsed = parseUntilUtc(adapter, rruleObject.UNTIL);

    if (parsed === null) {
      throw new Error(
        `MUI X Scheduler: Invalid UNTIL date "${rruleObject.UNTIL}". ` +
          'The UNTIL value must be a valid date in ISO format. ' +
          'Provide a valid date string.',
      );
    }

    rrule.until = adapter.setTimezone(parsed, timezone);
  }

  return rrule;
}

export function serializeRRule(
  adapter: Adapter,
  rule: SchedulerProcessedEventRecurrenceRule,
): string {
  const parts: string[] = [];

  parts.push(`FREQ=${rule.freq}`);

  const interval = rule.interval ?? 1;
  if (interval !== 1) {
    parts.push(`INTERVAL=${interval}`);
  }

  if (rule.byDay?.length) {
    parts.push(`BYDAY=${sortByDayValues(rule.byDay).join(',')}`);
  }

  if (rule.byMonthDay?.length) {
    parts.push(`BYMONTHDAY=${rule.byMonthDay.toSorted((a, b) => a - b).join(',')}`);
  }

  if (rule.byMonth?.length) {
    parts.push(`BYMONTH=${rule.byMonth.toSorted((a, b) => a - b).join(',')}`);
  }

  if (typeof rule.count === 'number') {
    parts.push(`COUNT=${rule.count}`);
  }

  if (rule.until) {
    const utcDate = adapter.setTimezone(rule.until, 'UTC');
    const untilIso = adapter.formatByString(utcDate, getAdapterCache(adapter).untilFormat);

    parts.push(`UNTIL=${untilIso}`);
  }

  return parts.join(';');
}

export function isSameRRule(
  adapter: Adapter,
  rruleA: SchedulerProcessedEventRecurrenceRule | undefined,
  rruleB: SchedulerProcessedEventRecurrenceRule | undefined,
): boolean {
  if (!rruleA && !rruleB) {
    return true;
  }
  if (!rruleA || !rruleB) {
    return false;
  }
  return serializeRRule(adapter, rruleA) === serializeRRule(adapter, rruleB);
}

/**
 * Sort the values provided to the BYDAY property of an RRULE by their order in the week.
 */
function sortByDayValues(temp: RecurringEventByDayValue[]): RecurringEventByDayValue[] {
  return temp
    .map((t) => tokenizeByDay(t))
    .sort(
      (a, b) =>
        NOT_LOCALIZED_WEEK_DAYS_INDEXES.get(a.code)! - NOT_LOCALIZED_WEEK_DAYS_INDEXES.get(b.code)!,
    )
    .map((t) => (t.ord != null ? (`${t.ord}${t.code}` as RecurringEventByDayValue) : t.code));
}
