import { getTimeNumber, LAST_SUPPORTED_DAY, MS_PER_DAY } from '../../base-temporal/iso';
import type { PlainDate } from '../../base-temporal/PlainDate';
import type { PlainDateTime } from '../../base-temporal/PlainDateTime';
import type { ZonedDateTimeOptions } from '../../base-temporal/ZonedDateTime';

export const NS_PER_MS = 1_000_000n;

const MAX_CACHED_DAYS_PER_TIME_ZONE = 20_000;

// The last instant of `Date`, 100,000,000 days after 1970-01-01.
const MAX_EPOCH_MILLISECONDS = LAST_SUPPORTED_DAY * MS_PER_DAY;

const timeZoneFormats = new Map<
  string,
  {
    formatter: Intl.DateTimeFormat;
    canonicalId: string;
    /**
     * The offset of each UTC day without a transition, keyed by day number.
     */
    offsets: Map<number, string>;
  }
>();

export function fail(reason: string): never {
  throw new Error(
    'Base UI Plus: The zoned date-time could not be created or changed. ' +
      `Its date, clock time, offset or timezone could not be resolved: ${reason}. ` +
      'Pass a valid ISO date-time and timezone, and choose a disambiguation policy for skipped or repeated clock times.',
  );
}

export function normalizeTimeZone(timeZone: string): string {
  if (timeZone.startsWith('+') || timeZone.startsWith('-')) {
    const offset = readOffset(timeZone);
    if (timeZone.length !== 6) {
      fail('a fixed-offset timezone must use HH:mm precision');
    }
    return offset === 0 ? '+00:00' : timeZone;
  }
  let entry = timeZoneFormats.get(timeZone);
  if (!entry) {
    let formatter: Intl.DateTimeFormat;
    try {
      formatter = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' });
    } catch {
      return fail('unknown timezone');
    }
    entry = { formatter, canonicalId: formatter.resolvedOptions().timeZone, offsets: new Map() };
    timeZoneFormats.set(timeZone, entry);
    timeZoneFormats.set(entry.canonicalId, entry);
  }
  return entry.canonicalId;
}

/**
 * The offset of `timeZone` at the instant, formatted like `ZonedDateTime.offset`.
 */
export function getOffset(timeZone: string, milliseconds: number): string {
  const normalized = normalizeTimeZone(timeZone);
  if (normalized === 'UTC') {
    return '+00:00';
  }
  if (normalized.startsWith('+') || normalized.startsWith('-')) {
    return normalized;
  }
  try {
    const { formatter, offsets } = timeZoneFormats.get(normalized)!;
    // `longOffset` formats like `ZonedDateTime.offset`, with seconds when they aren't 0. The instants
    // around the first and last days of `Date` take its first and last offsets.
    const format = (instant: number) =>
      formatter
        .format(Math.min(Math.max(instant, -MAX_EPOCH_MILLISECONDS), MAX_EPOCH_MILLISECONDS))
        .split('GMT')[1] || '+00:00';
    // Formatting is slow and offsets only change at a few transitions a year, so a UTC day that
    // starts and ends with the same offset keeps it: no timezone has two transitions in a day that
    // cancel out.
    const day = Math.floor(milliseconds / MS_PER_DAY);
    let offset = offsets.get(day);
    if (offset === undefined) {
      offset = format(day * MS_PER_DAY);
      if (offset !== format(day * MS_PER_DAY + MS_PER_DAY - 1)) {
        return format(milliseconds);
      }
      if (offsets.size >= MAX_CACHED_DAYS_PER_TIME_ZONE) {
        offsets.clear();
      }
      offsets.set(day, offset);
    }
    return offset;
  } catch {
    return fail('unsupported instant');
  }
}

const offsetValues = new Map<string, number>();

export function offsetMilliseconds(timeZone: string, milliseconds: number): number {
  return readCachedOffset(getOffset(timeZone, milliseconds));
}

export function readCachedOffset(offset: string): number {
  // Timezones use few offsets, so each one is parsed once.
  let value = offsetValues.get(offset);
  if (value === undefined) {
    value = readOffset(offset);
    offsetValues.set(offset, value);
  }
  return value;
}

export function readOffset(offset: string): number {
  const match = /^([+-])(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(offset);
  if (!match || Number(match[2]) > 23 || Number(match[3]) > 59 || Number(match[4] ?? 0) > 59) {
    return fail('unsupported offset');
  }
  return (
    (match[1] === '-' ? -1 : 1) *
    (Number(match[2]) * 3600 + Number(match[3]) * 60 + Number(match[4] ?? 0)) *
    1000
  );
}

export function epochMilliseconds(nanoseconds: bigint): number {
  const whole = nanoseconds / NS_PER_MS;
  return Number(nanoseconds % NS_PER_MS < 0n ? whole - 1n : whole);
}

export function localNanoseconds(value: PlainDateTime): bigint {
  return (
    BigInt((value.toPlainDate() as PlainDate).dayNumber * MS_PER_DAY) * NS_PER_MS +
    BigInt(getTimeNumber(value))
  );
}

export function resolve(
  value: PlainDateTime,
  timeZone: string,
  offset: string | undefined,
  options: ZonedDateTimeOptions = {},
  matchMinute = false,
): bigint {
  const disambiguation = options.disambiguation ?? 'compatible';
  const offsetPolicy = options.offset ?? 'reject';
  if (
    !['compatible', 'earlier', 'later', 'reject'].includes(disambiguation) ||
    !['use', 'prefer', 'ignore', 'reject'].includes(offsetPolicy)
  ) {
    return fail('unsupported disambiguation or offset policy');
  }
  const local = localNanoseconds(value);
  if (offsetPolicy !== 'ignore' && (offset === 'Z' || (offset != null && offsetPolicy === 'use'))) {
    return local - BigInt(offset === 'Z' ? 0 : readOffset(offset)) * NS_PER_MS;
  }
  const preferred = offset != null && offsetPolicy !== 'ignore' ? readOffset(offset) : undefined;
  if (preferred !== undefined) {
    const instant = local - BigInt(preferred) * NS_PER_MS;
    if (offsetMilliseconds(timeZone, epochMilliseconds(instant)) === preferred) {
      return instant;
    }
  }
  const milliseconds = epochMilliseconds(local);
  // Look on both sides of a transition, including a skipped or repeated whole day.
  const offsets = new Set([
    offsetMilliseconds(timeZone, milliseconds - 2 * MS_PER_DAY),
    offsetMilliseconds(timeZone, milliseconds),
    offsetMilliseconds(timeZone, milliseconds + 2 * MS_PER_DAY),
  ]);
  const candidates = [...offsets]
    .map((candidateOffset) => ({
      instant: local - BigInt(candidateOffset) * NS_PER_MS,
      offset: candidateOffset,
    }))
    .sort((a, b) => (a.instant < b.instant ? -1 : 1));
  const possible = candidates.filter(
    (candidate) =>
      offsetMilliseconds(timeZone, epochMilliseconds(candidate.instant)) === candidate.offset,
  );
  if (preferred !== undefined) {
    const match = possible.find(
      (candidate) =>
        candidate.offset === preferred ||
        (matchMinute &&
          Math.sign(candidate.offset) * Math.round(Math.abs(candidate.offset) / 60000) * 60000 ===
            preferred),
    );
    if (match) {
      return match.instant;
    }
    if (offsetPolicy === 'reject') {
      return fail('the offset does not match the timezone at this clock time');
    }
  }
  if (possible.length === 1) {
    return possible[0].instant;
  }
  if (disambiguation === 'reject') {
    return fail('the clock time was skipped or repeated');
  }
  const choices = possible.length ? possible : candidates;
  const chooseLast =
    disambiguation === 'later' || (possible.length === 0 && disambiguation === 'compatible');
  return choices[chooseLast ? choices.length - 1 : 0].instant;
}
