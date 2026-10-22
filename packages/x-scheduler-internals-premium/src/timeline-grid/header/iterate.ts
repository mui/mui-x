import type {
  TemporalAdapter,
  TemporalSupportedObject,
  TemporalTimezone,
} from '@base-ui/react/internals/temporal';
import type { WeekStartsOn } from '@mui/x-scheduler-internals/models';
import {
  addMonthsToDayNumber,
  createAdapterDate,
  FULL_DAY_MINUTES,
  getStartOfDayMs,
  getTimelineAxisOffsetMs,
  getWeekStartPlainDate,
  localToEpochMs,
  MS_PER_DAY,
  plainDateFromDayNumber,
  toLocalMs,
} from '@mui/x-scheduler-internals/internals';
import type { PlainDate, TimelineAxis } from '@mui/x-scheduler-internals/internals';
import type { IteratedCell, PresetHeaderUnit } from '../../models';

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;

type HourWindow = Pick<TimelineAxis, 'dayStartMinute' | 'dayEndMinute'>;

type ToAdapterDate = (localMs: number) => TemporalSupportedObject;

/**
 * The date of a wall-clock time.
 */
function toPlainDate(localMs: number): PlainDate {
  return plainDateFromDayNumber(Math.floor(localMs / MS_PER_DAY));
}

/**
 * Cells are walked on the wall clock of the timezone of `rangeStart`: their bounds are wall-clock
 * times, in milliseconds since 1970-01-01T00:00 of the wall clock, converted to adapter values at
 * the end. A wall-clock time skipped by a DST transition moves forward by the length of the gap,
 * and a repeated one resolves to its first instant, whatever the timezone of the system.
 */
export function iterate(
  adapter: TemporalAdapter,
  unit: PresetHeaderUnit,
  tickUnit: PresetHeaderUnit,
  rangeStart: TemporalSupportedObject,
  rangeEnd: TemporalSupportedObject,
  weekStartsOn?: WeekStartsOn,
  hourWindow?: HourWindow,
): IteratedCell[] {
  if (adapter.getTime(rangeEnd) < adapter.getTime(rangeStart)) {
    throw new Error(
      `MUI X Scheduler: TimelineGridHeader.iterate() received a range where rangeEnd is before rangeStart. ` +
        `The iteration would silently produce an empty header, masking the misconfiguration. ` +
        `Check the preset's \`getStartDate\` / \`getEndDate\` so they return ordered dates.`,
    );
  }

  const timezone = adapter.getTimezone(rangeStart);
  const toAdapterDate: ToAdapterDate = (localMs) =>
    createAdapterDate(adapter, localToEpochMs(localMs, timezone), timezone);
  const rangeStartLocalMs = getRangeStartLocalMs(adapter, rangeStart, timezone);

  // `rangeEnd` is inclusive (e.g. `endOfDay` = 23:59:59.999). Floor it to the
  // tick boundary and add one tick to get an exclusive end the loop can compare
  // against without depending on millisecond precision.
  const rangeEndExclusive = addUnit(
    startOf(adapter, rangeEnd, tickUnit, weekStartsOn, timezone),
    tickUnit,
    1,
  );
  const rangeEndExclusiveDate = toAdapterDate(rangeEndExclusive);

  // Hour ticks are a wall-clock grid: every day contributes the same columns whatever
  // its real hours are, so spans are measured on the axis rather than in elapsed hours.
  const appliedHourWindow =
    tickUnit === 'hour'
      ? (hourWindow ?? { dayStartMinute: 0, dayEndMinute: FULL_DAY_MINUTES })
      : undefined;

  // `appliedHourWindow` is only set when the ticks are hours, so this is the hour row.
  if (unit === 'hour' && appliedHourWindow) {
    return iterateHourCells(toAdapterDate, rangeStartLocalMs, rangeEndExclusive, appliedHourWindow);
  }

  const cells: IteratedCell[] = [];
  let cursor = startOf(adapter, rangeStart, unit, weekStartsOn, timezone);
  let cursorDate = toAdapterDate(cursor);
  let index = 0;

  while (cursor < rangeEndExclusive) {
    // Guard against runaway iteration from a misconfigured preset (e.g. hour ticks over a
    // 100-year range).
    if (index >= 10_000) {
      throwTooManyCells(unit, tickUnit);
    }
    const nextCursor = addUnit(cursor, unit, 1);
    const isLastCell = nextCursor >= rangeEndExclusive;
    const nextCursorDate = isLastCell ? rangeEndExclusiveDate : toAdapterDate(nextCursor);

    // First and last cells can extend past the visible range (e.g. a year cell
    // aligned to Jan 1 when the range starts mid-year). Clamp them so
    // `spanInTicks` reflects only the portion within `[rangeStart, rangeEndExclusive)`.
    const spanEnd = Math.min(nextCursor, rangeEndExclusive);
    const spanStart = Math.max(cursor, rangeStartLocalMs);
    cells.push({
      date: cursorDate,
      // Read from the wall clock: a date skipped by a transition keeps its own date.
      plainDate: toPlainDate(cursor),
      start: cursor < rangeStartLocalMs ? rangeStart : cursorDate,
      end: nextCursorDate,
      spanInTicks: appliedHourWindow
        ? countVisibleHours(spanEnd, spanStart, appliedHourWindow)
        : differenceInUnits(spanEnd, spanStart, tickUnit),
      // A date skipped by a transition resolves to the same instants as the next one, so
      // the key is built from the wall-clock time.
      key: String(cursor),
      index,
    });
    cursor = nextCursor;
    cursorDate = nextCursorDate;
    index += 1;
  }

  return cells;
}

/**
 * The wall-clock time of `rangeStart`. A range starting on the first instant of a day
 * whose midnight is skipped by a DST transition (e.g. `startOfDay` of March 8th, 2026 in
 * America/Havana, at 01:00) starts at the midnight of that day, so its first day stays whole.
 */
function getRangeStartLocalMs(
  adapter: TemporalAdapter,
  rangeStart: TemporalSupportedObject,
  timezone: TemporalTimezone,
): number {
  const time = adapter.getTime(rangeStart);
  const localMs = toLocalMs(time, timezone);
  return getStartOfDayMs(time, timezone) === time
    ? Math.floor(localMs / MS_PER_DAY) * MS_PER_DAY
    : localMs;
}

/**
 * Guards against runaway iteration from a misconfigured preset (e.g. hour ticks over a
 * 100-year range).
 */
function throwTooManyCells(unit: PresetHeaderUnit, tickUnit: PresetHeaderUnit): never {
  throw new Error(
    `MUI X Scheduler: TimelineGridHeader.iterate() produced more than 10,000 cells ` +
      `for unit "${unit}" over a range ticked in "${tickUnit}". ` +
      `This usually means the preset's \`unitCount\`/\`timeResolution\` span an unreasonably large period. ` +
      `Reduce \`unitCount\` or pick a coarser \`timeResolution\`.`,
  );
}

/**
 * Emits one cell per displayed wall-clock hour of every day in the range, the same grid
 * the Event Calendar's time axis builds. The columns are decided by arithmetic on the
 * hour window, not by walking real time, so a day keeps its column count across a DST
 * transition: the hour skipped by spring-forward still gets a column and the hour
 * repeated by fall-back gets a single one. Events absorb the difference by stretching or
 * shrinking over the fixed grid.
 */
function iterateHourCells(
  toAdapterDate: ToAdapterDate,
  rangeStartLocalMs: number,
  rangeEndExclusive: number,
  hourWindow: HourWindow,
): IteratedCell[] {
  const startHour = Math.ceil(hourWindow.dayStartMinute / 60);
  const endHour = Math.ceil(hourWindow.dayEndMinute / 60);

  const firstDay = Math.floor(rangeStartLocalMs / MS_PER_DAY);
  // `rangeEndExclusive` lands on midnight when the range ends on a day boundary, in
  // which case that day contributes no cells.
  const dayCount = Math.ceil(rangeEndExclusive / MS_PER_DAY) - firstDay;

  // Same runaway guard as the generic walk, checked up front since the count is known.
  if (dayCount * Math.max(0, endHour - startHour) > 10_000) {
    throwTooManyCells('hour', 'hour');
  }

  const cells: IteratedCell[] = [];
  for (let dayIndex = 0; dayIndex < dayCount; dayIndex += 1) {
    const dayStartLocalMs = (firstDay + dayIndex) * MS_PER_DAY;
    const plainDate = plainDateFromDayNumber(firstDay + dayIndex);
    // On a spring-forward day the skipped hour has no instant, so `date` moves forward to
    // the next existing one. `wallClockHour` is what the column stands for and is what
    // labels must be built from.
    let date = toAdapterDate(dayStartLocalMs + startHour * HOUR_MS);
    for (let hour = startHour; hour < endHour; hour += 1) {
      // The end of the last hour of the day is the start of the next day.
      const end = toAdapterDate(dayStartLocalMs + (hour + 1) * HOUR_MS);
      cells.push({
        date,
        plainDate,
        start: date,
        end,
        spanInTicks: 1,
        key: `${dayStartLocalMs}:${hour}`,
        index: cells.length,
        wallClockHour: hour,
      });
      date = end;
    }
  }

  return cells;
}

/**
 * The wall-clock start of the unit containing `date`.
 */
function startOf(
  adapter: TemporalAdapter,
  date: TemporalSupportedObject,
  unit: PresetHeaderUnit,
  weekStartsOn: WeekStartsOn | undefined,
  timezone: TemporalTimezone,
): number {
  const localMs = toLocalMs(adapter.getTime(date), timezone);
  switch (unit) {
    case 'hour':
      return Math.floor(localMs / HOUR_MS) * HOUR_MS;
    case 'day':
      return Math.floor(localMs / MS_PER_DAY) * MS_PER_DAY;
    case 'week':
      return getWeekStartPlainDate(adapter, date, weekStartsOn).dayNumber * MS_PER_DAY;
    case 'month':
      return toPlainDate(localMs).with({ day: 1 }).dayNumber * MS_PER_DAY;
    case 'year':
      return toPlainDate(localMs).with({ month: 1, day: 1 }).dayNumber * MS_PER_DAY;
    default:
      throw new Error(
        `MUI X Scheduler: Unsupported header unit "${unit}". ` +
          `TimelineGridHeader cannot iterate cells for an unknown unit, so the header would render incorrectly. ` +
          `Use one of: 'hour', 'day', 'week', 'month', 'year'.`,
      );
  }
}

/**
 * Adds units to a wall-clock time. Months and years clamp the day to the last day of the
 * target month.
 */
function addUnit(localMs: number, unit: PresetHeaderUnit, amount: number): number {
  switch (unit) {
    case 'hour':
      return localMs + amount * HOUR_MS;
    case 'day':
      return localMs + amount * MS_PER_DAY;
    case 'week':
      return localMs + amount * 7 * MS_PER_DAY;
    case 'month':
      return addMonths(localMs, amount);
    case 'year':
      return addMonths(localMs, amount * 12);
    default:
      throw new Error(
        `MUI X Scheduler: Unsupported header unit "${unit}". ` +
          `TimelineGridHeader cannot iterate cells for an unknown unit, so the header would render incorrectly. ` +
          `Use one of: 'hour', 'day', 'week', 'month', 'year'.`,
      );
  }
}

/**
 * Adds months to a wall-clock time. Unlike `PlainDate.add()`, it doesn't throw past the last
 * supported day, which the exclusive end of a range ending in December 9999 reaches.
 */
function addMonths(localMs: number, months: number): number {
  const dayNumber = Math.floor(localMs / MS_PER_DAY);
  return addMonthsToDayNumber(dayNumber, months) * MS_PER_DAY + (localMs - dayNumber * MS_PER_DAY);
}

/**
 * Counts the hour ticks within `[earlier, later)`, two wall-clock times, that fall inside
 * the visible hour window: the axis distance between the two bounds, in hours. Closed form
 * (no hour-by-hour walk), consistent with the pinned tick count of the grid.
 */
function countVisibleHours(later: number, earlier: number, hourWindow: HourWindow): number {
  const toAxisMs = (localMs: number) => {
    const dayNumber = Math.floor(localMs / MS_PER_DAY);
    return getTimelineAxisOffsetMs(hourWindow, dayNumber, localMs - dayNumber * MS_PER_DAY);
  };
  return Math.round((toAxisMs(later) - toAxisMs(earlier)) / HOUR_MS);
}

/**
 * The number of whole months from `earlier` to `later`, two wall-clock times.
 */
function differenceInMonths(later: number, earlier: number): number {
  const laterPlainDate = toPlainDate(later);
  const earlierPlainDate = toPlainDate(earlier);
  const months =
    (laterPlainDate.year - earlierPlainDate.year) * 12 +
    (laterPlainDate.month - earlierPlainDate.month);
  // A month is whole once the day and the time of `earlier` are reached in it.
  const getTimeInMonth = (localMs: number, day: number) =>
    (day - 1) * MS_PER_DAY + (localMs - Math.floor(localMs / MS_PER_DAY) * MS_PER_DAY);
  const comparison =
    getTimeInMonth(later, laterPlainDate.day) - getTimeInMonth(earlier, earlierPlainDate.day);
  if (months > 0 && comparison < 0) {
    return months - 1;
  }
  if (months < 0 && comparison > 0) {
    return months + 1;
  }
  return months;
}

/**
 * The number of whole units from `earlier` to `later`, two wall-clock times.
 */
function differenceInUnits(later: number, earlier: number, unit: PresetHeaderUnit): number {
  switch (unit) {
    case 'hour':
      return Math.trunc((later - earlier) / HOUR_MS);
    case 'day':
      return Math.trunc((later - earlier) / MS_PER_DAY);
    case 'week':
      return Math.trunc((later - earlier) / (7 * MS_PER_DAY));
    case 'month':
      return differenceInMonths(later, earlier);
    case 'year':
      return Math.trunc(differenceInMonths(later, earlier) / 12);
    default:
      throw new Error(
        `MUI X Scheduler: Unsupported header unit "${unit}". ` +
          `TimelineGridHeader cannot iterate cells for an unknown unit, so the header would render incorrectly. ` +
          `Use one of: 'hour', 'day', 'week', 'month', 'year'.`,
      );
  }
}
