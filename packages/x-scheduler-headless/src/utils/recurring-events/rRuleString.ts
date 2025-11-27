import { TemporalTimezone } from '../../base-ui-copy/types';
import { Adapter } from '../../use-adapter/useAdapter.types';
import { RecurringEventByDayValue, RecurringEventRecurrenceRule } from '../../models';
import { NOT_LOCALIZED_WEEK_DAYS, tokenizeByDay } from './internal-utils';

const SUPPORTED_RRULE_KEYS = [
  'FREQ',
  'INTERVAL',
  'BYDAY',
  'BYMONTHDAY',
  'BYMONTH',
  'UNTIL',
  'COUNT',
] as const;

/**
 * Parses a string RRULE (e.g. "FREQ=DAILY;COUNT=5;INTERVAL=2")
 * into a RecurringEventRecurrenceRule object.
 * Also validates unsupported or malformed properties.
 *
 * @param adapter The date adapter used to parse and convert dates.
 * @param input The RRULE value. Can be a string or an RecurringEventRecurrenceRule object.
 * @param timezone The data timezone in which RRULE dates (like UNTIL) should be interpreted
 */
export function parseRRuleString(
  adapter: Adapter,
  input: string | RecurringEventRecurrenceRule,
  timezone: TemporalTimezone,
): RecurringEventRecurrenceRule {
  if (typeof input === 'object') {
    if (!input.until) {
      return input;
    }

    return {
      ...input,
      until: adapter.setTimezone(input.until, timezone),
    };
  }

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
      throw new Error(`Scheduler: Invalid RRULE part: "${part}"`);
    }

    if (!SUPPORTED_RRULE_KEYS.includes(key as any)) {
      throw new Error(`Scheduler: Unsupported RRULE property: "${key}"`);
    }

    rruleObject[key] = value;
  }

  if (!rruleObject.FREQ) {
    throw new Error('Scheduler: RRULE must include a FREQ property.');
  }

  const rrule: RecurringEventRecurrenceRule = {
    freq: rruleObject.FREQ as RecurringEventRecurrenceRule['freq'],
  };

  if (rruleObject.INTERVAL) {
    const interval = Number(rruleObject.INTERVAL);
    if (Number.isNaN(interval) || interval < 1) {
      throw new Error(`Scheduler: Invalid INTERVAL value: "${rruleObject.INTERVAL}"`);
    }
    rrule.interval = interval;
  }

  if (rruleObject.BYDAY) {
    rrule.byDay = rruleObject.BYDAY.split(',').map((v) => v.trim()) as RecurringEventByDayValue[];
  }

  if (rruleObject.BYDAY) {
    const tokens = rruleObject.BYDAY.split(',').map((v) => v.trim()) as RecurringEventByDayValue[];
    rrule.byDay = tokens
      .map((t) => tokenizeByDay(t))
      .sort(
        (a, b) => NOT_LOCALIZED_WEEK_DAYS.indexOf(a.code) - NOT_LOCALIZED_WEEK_DAYS.indexOf(b.code),
      )
      .map((t) => (t.ord != null ? (`${t.ord}${t.code}` as RecurringEventByDayValue) : t.code));
  }

  if (rruleObject.BYMONTHDAY) {
    const days = rruleObject.BYMONTHDAY.split(',').map((d) => Number(d.trim()));
    if (days.some((d) => Number.isNaN(d) || d < 1 || d > 31)) {
      throw new Error(`Scheduler: Invalid BYMONTHDAY values: "${rruleObject.BYMONTHDAY}"`);
    }
    rrule.byMonthDay = days.toSorted((a, b) => a - b);
  }

  if (rruleObject.BYMONTH) {
    const months = rruleObject.BYMONTH.split(',').map((m) => Number(m.trim()));
    if (months.some((m) => Number.isNaN(m) || m < 1 || m > 12)) {
      throw new Error(`Scheduler: Invalid BYMONTH values: "${rruleObject.BYMONTH}"`);
    }
    rrule.byMonth = months.toSorted((a, b) => a - b);
  }

  if (rruleObject.COUNT) {
    const count = Number(rruleObject.COUNT);
    if (Number.isNaN(count) || count < 1) {
      throw new Error(`Scheduler: Invalid COUNT value: "${rruleObject.COUNT}"`);
    }
    rrule.count = count;
  }

  if (rruleObject.UNTIL) {
    const parsed = adapter.parse(rruleObject.UNTIL, getUntilFormat(adapter), timezone);

    if (!adapter.isValid(parsed)) {
      throw new Error(`Scheduler: Invalid UNTIL date: "${rruleObject.UNTIL}"`);
    }

    rrule.until = parsed;
  }

  return rrule;
}

/**
 * Serializes a RecurringEventRecurrenceRule object
 * into a RRULE string (RFC5545).
 */
export function serializeRRule(adapter: Adapter, rule: RecurringEventRecurrenceRule): string {
  const parts: string[] = [];

  parts.push(`FREQ=${rule.freq}`);

  const interval = rule.interval ?? 1;
  if (interval !== 1) {
    parts.push(`INTERVAL=${interval}`);
  }

  if (rule.byDay?.length) {
    const normalized = [...rule.byDay]
      .map((t) => tokenizeByDay(t))
      .sort(
        (a, b) => NOT_LOCALIZED_WEEK_DAYS.indexOf(a.code) - NOT_LOCALIZED_WEEK_DAYS.indexOf(b.code),
      )
      .map((t) => (t.ord != null ? (`${t.ord}${t.code}` as RecurringEventByDayValue) : t.code));
    parts.push(`BYDAY=${normalized.join(',')}`);
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
    const untilIso = adapter.formatByString(utcDate, getUntilFormat(adapter));

    parts.push(`UNTIL=${untilIso}`);
  }

  return parts.join(';');
}

/**
 * Builds the date format string for UNTIL serialization (RFC5545 format: YYYYMMDDTHHmmssZ)
 */
function getUntilFormat(adapter: Adapter): string {
  const f = adapter.formats;
  const dateFormat = `${f.yearPadded}${f.monthPadded}${f.dayOfMonthPadded}`;
  const dateTimeSeparator = `${adapter.escapedCharacters.start}T${adapter.escapedCharacters.end}`;
  const timeFormat = `${f.hours24hPadded}${f.minutesPadded}${f.secondsPadded}`;
  const timezoneSuffix = `${adapter.escapedCharacters.start}Z${adapter.escapedCharacters.end}`;
  return `${dateFormat}${dateTimeSeparator}${timeFormat}${timezoneSuffix}`;
}
