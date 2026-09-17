import type { TemporalAdapter, TemporalSupportedObject } from '@base-ui/react/internals/temporal';
import type { WeekStartsOn } from '@mui/x-scheduler-internals/models';
import {
  getStartOfWeek,
  dateToTimelineAxisOffsetMs,
  FULL_DAY_MINUTES,
} from '@mui/x-scheduler-internals/internals';
import type { TimelineAxis } from '@mui/x-scheduler-internals/internals';
import type { IteratedCell, PresetHeaderUnit } from '../../models';

const HOUR_MS = 3_600_000;

type HourWindow = Pick<TimelineAxis, 'dayStartMinute' | 'dayEndMinute'>;

export function iterate(
  adapter: TemporalAdapter,
  unit: PresetHeaderUnit,
  tickUnit: PresetHeaderUnit,
  rangeStart: TemporalSupportedObject,
  rangeEnd: TemporalSupportedObject,
  weekStartsOn?: WeekStartsOn,
  hourWindow?: HourWindow,
): IteratedCell[] {
  if (adapter.isBefore(rangeEnd, rangeStart)) {
    throw new Error(
      `MUI X Scheduler: TimelineGridHeader.iterate() received a range where rangeEnd is before rangeStart. ` +
        `The iteration would silently produce an empty header, masking the misconfiguration. ` +
        `Check the preset's \`getStartDate\` / \`getEndDate\` so they return ordered dates.`,
    );
  }

  // `rangeEnd` is inclusive (e.g. `endOfDay` = 23:59:59.999). Floor it to the
  // tick boundary and add one tick to get an exclusive end the loop can compare
  // against without depending on millisecond precision.
  const rangeEndExclusive = addUnit(
    adapter,
    startOf(adapter, rangeEnd, tickUnit, weekStartsOn),
    tickUnit,
    1,
  );

  // Hour ticks are a wall-clock grid: every day contributes the same columns whatever
  // its real hours are, so spans are measured on the axis rather than in elapsed hours.
  const appliedHourWindow =
    tickUnit === 'hour'
      ? (hourWindow ?? { dayStartMinute: 0, dayEndMinute: FULL_DAY_MINUTES })
      : undefined;

  // `appliedHourWindow` is only set when the ticks are hours, so this is the hour row.
  if (unit === 'hour' && appliedHourWindow) {
    return iterateHourCells(adapter, rangeStart, rangeEndExclusive, appliedHourWindow);
  }

  const cells: IteratedCell[] = [];
  let cursor = startOf(adapter, rangeStart, unit, weekStartsOn);
  let index = 0;

  while (adapter.isBefore(cursor, rangeEndExclusive)) {
    // Guard against runaway iteration from a misconfigured preset (e.g. hour ticks over a
    // 100-year range).
    if (index >= 10_000) {
      throwTooManyCells(unit, tickUnit);
    }
    const nextCursor = addUnit(adapter, cursor, unit, 1);

    // First and last cells can extend past the visible range (e.g. a year cell
    // aligned to Jan 1 when the range starts mid-year). Clamp them so
    // `spanInTicks` reflects only the portion within `[rangeStart, rangeEndExclusive)`.
    const clampedStart = adapter.isBefore(cursor, rangeStart) ? rangeStart : cursor;
    const clampedEnd = adapter.isBefore(rangeEndExclusive, nextCursor)
      ? rangeEndExclusive
      : nextCursor;
    cells.push({
      date: cursor,
      start: clampedStart,
      end: clampedEnd,
      spanInTicks: appliedHourWindow
        ? countVisibleHours(adapter, clampedEnd, clampedStart, rangeStart, appliedHourWindow)
        : differenceInUnits(adapter, clampedEnd, clampedStart, tickUnit),
      key: String(adapter.getTime(cursor)),
      index,
    });
    cursor = nextCursor;
    index += 1;
  }

  return cells;
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
  adapter: TemporalAdapter,
  rangeStart: TemporalSupportedObject,
  rangeEndExclusive: TemporalSupportedObject,
  hourWindow: HourWindow,
): IteratedCell[] {
  const startHour = Math.ceil(hourWindow.dayStartMinute / 60);
  const endHour = Math.ceil(hourWindow.dayEndMinute / 60);

  const firstDay = adapter.startOfDay(rangeStart);
  const dayCount =
    adapter.differenceInDays(adapter.startOfDay(rangeEndExclusive), firstDay) +
    // `rangeEndExclusive` lands on midnight when the range ends on a day boundary, in
    // which case that day contributes no cells.
    (adapter.isEqual(adapter.startOfDay(rangeEndExclusive), rangeEndExclusive) ? 0 : 1);

  // Same runaway guard as the generic walk, checked up front since the count is known.
  if (dayCount * Math.max(0, endHour - startHour) > 10_000) {
    throwTooManyCells('hour', 'hour');
  }

  const cells: IteratedCell[] = [];
  for (let dayIndex = 0; dayIndex < dayCount; dayIndex += 1) {
    const dayStart = adapter.startOfDay(adapter.addDays(firstDay, dayIndex));
    for (let hour = startHour; hour < endHour; hour += 1) {
      // On a spring-forward day the skipped hour has no instant, so `date` normalizes to
      // the next existing one. `wallClockHour` is what the column stands for and is what
      // labels must be built from.
      const date = adapter.setHours(dayStart, hour);
      cells.push({
        date,
        start: date,
        end:
          hour + 1 < 24
            ? adapter.setHours(dayStart, hour + 1)
            : adapter.startOfDay(adapter.addDays(dayStart, 1)),
        spanInTicks: 1,
        key: `${adapter.getTime(dayStart)}:${hour}`,
        index: cells.length,
        wallClockHour: hour,
      });
    }
  }

  return cells;
}

function startOf(
  adapter: TemporalAdapter,
  date: TemporalSupportedObject,
  unit: PresetHeaderUnit,
  weekStartsOn?: WeekStartsOn,
): TemporalSupportedObject {
  switch (unit) {
    case 'hour':
      return adapter.startOfHour(date);
    case 'day':
      return adapter.startOfDay(date);
    case 'week':
      return getStartOfWeek(adapter, date, weekStartsOn);
    case 'month':
      return adapter.startOfMonth(date);
    case 'year':
      return adapter.startOfYear(date);
    default:
      throw new Error(
        `MUI X Scheduler: Unsupported header unit "${unit}". ` +
          `TimelineGridHeader cannot iterate cells for an unknown unit, so the header would render incorrectly. ` +
          `Use one of: 'hour', 'day', 'week', 'month', 'year'.`,
      );
  }
}

function addUnit(
  adapter: TemporalAdapter,
  date: TemporalSupportedObject,
  unit: PresetHeaderUnit,
  amount: number,
): TemporalSupportedObject {
  switch (unit) {
    case 'hour':
      return adapter.addHours(date, amount);
    case 'day':
      return adapter.addDays(date, amount);
    case 'week':
      return adapter.addWeeks(date, amount);
    case 'month':
      return adapter.addMonths(date, amount);
    case 'year':
      return adapter.addYears(date, amount);
    default:
      throw new Error(
        `MUI X Scheduler: Unsupported header unit "${unit}". ` +
          `TimelineGridHeader cannot iterate cells for an unknown unit, so the header would render incorrectly. ` +
          `Use one of: 'hour', 'day', 'week', 'month', 'year'.`,
      );
  }
}

/**
 * Counts the hour ticks within `[earlier, later)` that fall inside the visible hour
 * window: the axis distance between the two bounds, in hours. Closed form (no
 * hour-by-hour walk), consistent with the pinned tick count of the grid.
 */
function countVisibleHours(
  adapter: TemporalAdapter,
  later: TemporalSupportedObject,
  earlier: TemporalSupportedObject,
  rangeStart: TemporalSupportedObject,
  hourWindow: HourWindow,
): number {
  const axis = { start: rangeStart, end: later, ...hourWindow };
  return Math.round(
    (dateToTimelineAxisOffsetMs(adapter, axis, later) -
      dateToTimelineAxisOffsetMs(adapter, axis, earlier)) /
      HOUR_MS,
  );
}

function differenceInUnits(
  adapter: TemporalAdapter,
  later: TemporalSupportedObject,
  earlier: TemporalSupportedObject,
  unit: PresetHeaderUnit,
): number {
  switch (unit) {
    case 'hour':
      return adapter.differenceInHours(later, earlier);
    case 'day':
      return adapter.differenceInDays(later, earlier);
    case 'week':
      return adapter.differenceInWeeks(later, earlier);
    case 'month':
      return adapter.differenceInMonths(later, earlier);
    case 'year':
      return adapter.differenceInYears(later, earlier);
    default:
      throw new Error(
        `MUI X Scheduler: Unsupported header unit "${unit}". ` +
          `TimelineGridHeader cannot iterate cells for an unknown unit, so the header would render incorrectly. ` +
          `Use one of: 'hour', 'day', 'week', 'month', 'year'.`,
      );
  }
}
