import { getTimeNumber, LAST_SUPPORTED_DAY, MS_PER_DAY, padNumber } from '../../base-temporal/iso';
import type { PlainDate } from '../../base-temporal/PlainDate';
import type { PlainDateTime } from '../../base-temporal/PlainDateTime';
import type { ZonedDateTimeAssignmentOptions } from '../../base-temporal/ZonedDateTime';

export const NS_PER_MS = 1_000_000n;

const MAX_CACHED_DAYS_PER_TIME_ZONE = 20_000;

// The last instant of `Date`, 100,000,000 days after 1970-01-01.
export const MAX_EPOCH_MILLISECONDS = LAST_SUPPORTED_DAY * MS_PER_DAY;

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
    'MUI X Scheduler: The zoned date-time could not be created or changed. ' +
      `Its date, clock time, offset or timezone could not be resolved: ${reason}. ` +
      'Pass a valid ISO date-time and timezone, and choose a disambiguation policy for skipped or repeated clock times.',
  );
}

// Identifiers only ICU knows, which Temporal rejects as they aren't in the IANA database.
const ICU_LEGACY_TIME_ZONES =
  'ACT AET AGT ART AST BET BST CAT CNT CST CTT EAT ECT IET IST JST MIT NET NST PLT PNT PRT PST SST VST';

function getTimeZoneEntry(timeZone: string) {
  let entry = timeZoneFormats.get(timeZone);
  if (!entry) {
    if (timeZone.length === 3 && ICU_LEGACY_TIME_ZONES.includes(timeZone.toUpperCase())) {
      return fail('the timezone is a legacy identifier of ICU, not an IANA one');
    }
    let formatter: Intl.DateTimeFormat;
    try {
      formatter = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' });
    } catch {
      return fail('unknown timezone');
    }
    const canonicalId = formatter.resolvedOptions().timeZone;
    // Another spelling of a known timezone shares its offsets.
    entry = timeZoneFormats.get(canonicalId) ?? { formatter, canonicalId, offsets: new Map() };
    timeZoneFormats.set(timeZone, entry);
    timeZoneFormats.set(canonicalId, entry);
  }
  return entry;
}

function normalizeOffsetTimeZone(timeZone: string): string {
  const offset = readOffset(timeZone);
  if (timeZone.length !== 6) {
    fail('a fixed-offset timezone must use HH:mm precision');
  }
  return offset === 0 ? '+00:00' : timeZone;
}

function isOffsetTimeZone(timeZone: string) {
  return timeZone.startsWith('+') || timeZone.startsWith('-');
}

/**
 * Returns the identifier of a timezone, like Temporal: the identifier it receives, such as
 * `Asia/Kolkata` where an engine resolves `Asia/Calcutta`. An identifier the engine resolves to
 * itself takes its letter case, and an alias keeps the letter case it receives.
 */
export function normalizeTimeZone(timeZone: string): string {
  if (isOffsetTimeZone(timeZone)) {
    return normalizeOffsetTimeZone(timeZone);
  }
  const { canonicalId } = getTimeZoneEntry(timeZone);
  // Most identifiers are already canonical, which saves comparing their lowercase forms.
  return canonicalId === timeZone || canonicalId.toLowerCase() === timeZone.toLowerCase()
    ? canonicalId
    : timeZone;
}

/**
 * Returns the identifier the engine resolves a timezone to, which is the same for its aliases.
 */
function getCanonicalTimeZone(timeZone: string): string {
  return isOffsetTimeZone(timeZone)
    ? normalizeOffsetTimeZone(timeZone)
    : getTimeZoneEntry(timeZone).canonicalId;
}

/**
 * Whether two timezone identifiers name the same timezone, such as `Asia/Kolkata` and
 * `Asia/Calcutta`.
 */
export function isSameTimeZone(one: string, two: string): boolean {
  return one === two || getCanonicalTimeZone(one) === getCanonicalTimeZone(two);
}

/**
 * The offset of `timeZone` at the instant, formatted like `ZonedDateTime.offset`.
 */
export function getOffset(timeZone: string, milliseconds: number): string {
  if (isOffsetTimeZone(timeZone)) {
    return normalizeOffsetTimeZone(timeZone);
  }
  const { canonicalId, formatter, offsets } = getTimeZoneEntry(timeZone);
  if (canonicalId === 'UTC') {
    return '+00:00';
  }
  try {
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

function offsetMilliseconds(timeZone: string, milliseconds: number): number {
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

function readOffset(offset: string): number {
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

/**
 * Reads and checks the `disambiguation` and `offset` options, with the defaults of `from()`.
 */
export function readZonedOptions(options: ZonedDateTimeAssignmentOptions = {}) {
  const disambiguation = options.disambiguation ?? 'compatible';
  const offsetPolicy = options.offset ?? 'reject';
  if (
    !['compatible', 'earlier', 'later', 'reject'].includes(disambiguation) ||
    !['use', 'prefer', 'ignore', 'reject'].includes(offsetPolicy)
  ) {
    return fail('unsupported disambiguation or offset policy');
  }
  return { disambiguation, offsetPolicy };
}

/**
 * Rounds an offset in milliseconds to the minute, half away from zero, like Temporal.
 */
function roundToMinute(milliseconds: number): number {
  return Math.sign(milliseconds) * Math.round(Math.abs(milliseconds) / 60_000) * 60_000;
}

/**
 * Formats an offset rounded to the minute, as `ZonedDateTime.prototype.toString()` prints it.
 */
export function formatRoundedOffset(offset: string): string {
  if (offset.length === 6) {
    return offset;
  }
  const minutes = roundToMinute(readCachedOffset(offset)) / 60_000;
  const absolute = Math.abs(minutes);
  return `${minutes < 0 ? '-' : '+'}${padNumber(Math.floor(absolute / 60))}:${padNumber(absolute % 60)}`;
}

/**
 * Returns the instant of a date-time in a timezone, in milliseconds since 1970-01-01T00:00Z,
 * rounded down. Offsets are whole milliseconds, so the nanoseconds after the milliseconds are those
 * of the date-time.
 */
export function resolve(
  value: PlainDateTime,
  timeZone: string,
  offset: string | undefined,
  options: ZonedDateTimeAssignmentOptions = {},
  matchMinute = false,
): number {
  if (offset !== undefined && typeof offset !== 'string') {
    throw new TypeError(
      `MUI X Scheduler: The \`offset\` field of the zoned date-time is ${String(offset)}, which isn't a string. ` +
        'The offset cannot be compared with the offsets of the timezone. ' +
        "Pass an offset such as `'+02:00'`, or leave the field out.",
    );
  }
  const { disambiguation, offsetPolicy } = readZonedOptions(options);
  // The clock time, in milliseconds since 1970-01-01T00:00 of the wall clock.
  const local =
    (value.toPlainDate() as PlainDate).dayNumber * MS_PER_DAY +
    Math.floor(getTimeNumber(value) / 1e6);
  if (
    offsetPolicy !== 'ignore' &&
    (offset === 'Z' || (offset !== undefined && offsetPolicy === 'use'))
  ) {
    return local - (offset === 'Z' ? 0 : readOffset(offset));
  }
  const preferred =
    offset !== undefined && offsetPolicy !== 'ignore' ? readOffset(offset) : undefined;
  if (preferred !== undefined && offsetMilliseconds(timeZone, local - preferred) === preferred) {
    return local - preferred;
  }
  // Each offset on both sides of a transition, including a skipped or repeated whole day, gives an
  // instant of the clock time. The instants the timezone shows it at are possible: a repeated
  // clock time has two, a skipped one none.
  const candidates: number[] = [];
  const possible: number[] = [];
  let match: number | undefined;
  for (const day of [-2, 0, 2]) {
    const candidateOffset = offsetMilliseconds(timeZone, local + day * MS_PER_DAY);
    const instant = local - candidateOffset;
    if (!candidates.includes(instant)) {
      candidates.push(instant);
      if (offsetMilliseconds(timeZone, instant) === candidateOffset) {
        possible.push(instant);
        if (
          (candidateOffset === preferred ||
            (matchMinute && roundToMinute(candidateOffset) === preferred)) &&
          (match === undefined || instant < match)
        ) {
          match = instant;
        }
      }
    }
  }
  if (preferred !== undefined) {
    if (match !== undefined) {
      return match;
    }
    if (offsetPolicy === 'reject') {
      return fail('the offset does not match the timezone at this clock time');
    }
  }
  if (possible.length === 1) {
    return possible[0];
  }
  if (disambiguation === 'reject') {
    return fail('the clock time was skipped or repeated');
  }
  // The earliest instant, or the latest one for `'later'` and for a skipped clock time in
  // `'compatible'`, which moves it forward.
  const choices = possible.length ? possible : candidates;
  return disambiguation === 'later' || (possible.length === 0 && disambiguation === 'compatible')
    ? Math.max(...choices)
    : Math.min(...choices);
}
