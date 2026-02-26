import { TemporalTimezone } from '../../../base-ui-copy/types';
import { Adapter } from '../../../use-adapter/useAdapter.types';
import {
  RecurringEventByDayValue,
  SchedulerProcessedEventRecurrenceRule,
  SchedulerEventRecurrenceRule,
} from '../../../models';
import { resolveEventDate } from '../../../process-event/resolveEventDate';
import { getAdapterCache, NOT_LOCALIZED_WEEK_DAYS_INDEXES, tokenizeByDay } from './internal-utils';

const SUPPORTED_RRULE_KEYS = new Set([
  'FREQ',
  'INTERVAL',
  'BYDAY',
  'BYMONTHDAY',
  'BYMONTH',
  'UNTIL',
  'COUNT',
]);

/**
 * Parses and validates a RRULE string (RFC5545) into a canonical
 * `SchedulerProcessedEventRecurrenceRule`.
 *
 * The resulting rule is expressed in the provided timezone
 * (typically the event data timezone).
 */
export function parseRRule(
  adapter: Adapter,
  input: string | SchedulerEventRecurrenceRule,
  timezone: TemporalTimezone,
): SchedulerProcessedEventRecurrenceRule {
  if (typeof input === 'object') {
    if (input.until != null) {
      return {
        ...input,
        until: resolveEventDate(input.until, timezone, adapter),
      };
    }
    return input as SchedulerProcessedEventRecurrenceRule;
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
      throw new Error(`MUI: Invalid RRULE part: "${part}"`);
    }

    if (!SUPPORTED_RRULE_KEYS.has(key)) {
      throw new Error(`MUI: Unsupported RRULE property: "${key}"`);
    }

    rruleObject[key] = value;
  }

  if (!rruleObject.FREQ) {
    throw new Error('MUI: RRULE must include a FREQ property.');
  }

  const rrule: SchedulerProcessedEventRecurrenceRule = {
    freq: rruleObject.FREQ as SchedulerProcessedEventRecurrenceRule['freq'],
  };

  if (rruleObject.INTERVAL) {
    const interval = Number(rruleObject.INTERVAL);
    if (Number.isNaN(interval) || interval < 1) {
      throw new Error(`MUI: Invalid INTERVAL value: "${rruleObject.INTERVAL}"`);
    }
    rrule.interval = interval;
  }

  if (rruleObject.BYDAY) {
    const tokens = rruleObject.BYDAY.split(',').map((v) => v.trim()) as RecurringEventByDayValue[];
    rrule.byDay = sortByDayValues(tokens);
  }

  if (rruleObject.BYMONTHDAY) {
    const days = rruleObject.BYMONTHDAY.split(',').map((d) => Number(d.trim()));
    if (days.some((d) => Number.isNaN(d) || d < 1 || d > 31)) {
      throw new Error(`MUI: Invalid BYMONTHDAY values: "${rruleObject.BYMONTHDAY}"`);
    }
    rrule.byMonthDay = days.toSorted((a, b) => a - b);
  }

  if (rruleObject.BYMONTH) {
    const months = rruleObject.BYMONTH.split(',').map((m) => Number(m.trim()));
    if (months.some((m) => Number.isNaN(m) || m < 1 || m > 12)) {
      throw new Error(`MUI: Invalid BYMONTH values: "${rruleObject.BYMONTH}"`);
    }
    rrule.byMonth = months.toSorted((a, b) => a - b);
  }

  if (rruleObject.COUNT) {
    const count = Number(rruleObject.COUNT);
    if (Number.isNaN(count) || count < 1) {
      throw new Error(`MUI: Invalid COUNT value: "${rruleObject.COUNT}"`);
    }
    rrule.count = count;
  }

  if (rruleObject.UNTIL) {
    const parsed = adapter.parse(rruleObject.UNTIL, getAdapterCache(adapter).untilFormat, timezone);

    if (!adapter.isValid(parsed)) {
      throw new Error(`MUI: Invalid UNTIL date: "${rruleObject.UNTIL}"`);
    }

    rrule.until = parsed;
  }

  return rrule;
}

/**
 * Serializes a SchedulerProcessedEventRecurrenceRule object
 * into a RRULE string (RFC5545).
 */
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
