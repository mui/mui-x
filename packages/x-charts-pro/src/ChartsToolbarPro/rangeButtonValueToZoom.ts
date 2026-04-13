import { warnOnce } from '@mui/x-internals/warning';

/**
 * A calendar interval unit for range buttons.
 */
export type RangeButtonIntervalUnit =
  | 'microsecond'
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year';

/**
 * Parameters passed to a range button function value.
 */
export interface RangeButtonFunctionParams {
  /**
   * The scale type of the axis (e.g., `'time'`, `'band'`, `'linear'`).
   */
  scaleType: string;
  /**
   * The axis data values. Available for ordinal (band/point) axes.
   */
  data: readonly unknown[] | undefined;
  /**
   * The full domain bounds, ignoring any current zoom.
   * For time axes, these are timestamps. For ordinal axes, these are indices.
   */
  domain: { min: number; max: number };
}

/**
 * Defines the value of a range button.
 *
 * - `{ unit, step }` — A calendar interval from the end of the data.
 *   @example { unit: 'month', step: 3 } // Last 3 months
 *   @example { unit: 'year' } // Last year (step defaults to 1)
 * - `[start, end]` — An absolute date range.
 *   @example [new Date(2024, 0, 1), new Date(2024, 6, 1)] // Jan–Jul 2024
 * - `(params) => { start, end }` — A function that receives axis context (`scaleType`, `data`, `domain`) and returns zoom percentages (0-100).
 *   @example ({ domain }) => ({ start: 0, end: 50 }) // First half of data
 *   @example ({ data }) => {
 *     const lastFive = Math.max(0, data.length - 5);
 *     return { start: (lastFive / (data.length - 1)) * 100, end: 100 };
 *   } // Last 5 items on an ordinal axis
 * - `null` — Resets zoom to show all data.
 *   @example null // Show all data
 */
export type RangeButtonValue =
  | { unit: RangeButtonIntervalUnit; step?: number }
  | [Date, Date]
  | ((params: RangeButtonFunctionParams) => { start: number; end: number })
  | null;

/**
 * Attempts to convert a value to a timestamp.
 * Handles Date objects, numeric timestamps, and date-like strings.
 *
 * @returns The timestamp in milliseconds, or `undefined` if the value is not date-like.
 */
function toTimestamp(val: unknown): number | undefined {
  if (val instanceof Date) {
    return val.getTime();
  }
  if (typeof val === 'number') {
    return val;
  }
  if (typeof val === 'string') {
    const parsed = Date.parse(val);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

/**
 * Converts ordinal data to timestamps.
 * Items that cannot be converted are kept as `NaN` so their index is preserved.
 * Returns `undefined` if fewer than 2 items could be converted.
 */
function toTimestampArray(data: readonly unknown[]): number[] | undefined {
  const timestamps: number[] = new Array(data.length);
  let convertedItems = 0;
  for (let i = 0; i < data.length; i += 1) {
    const ts = toTimestamp(data[i]);
    if (ts !== undefined) {
      convertedItems += 1;
      timestamps[i] = ts;
    } else {
      timestamps[i] = Number.NaN;
    }
  }
  return convertedItems >= 2 ? timestamps : undefined;
}

/**
 * Converts a range button value to zoom start/end percentages.
 *
 * The range is calculated from the end of the axis domain.
 * For example, `{ unit: 'month', step: 3 }` will zoom to show the last 3 months of data.
 *
 * @param value The range button value.
 * @param params The axis context passed to function values.
 * @param params.scaleType The scale type of the axis.
 * @param params.data The axis data values (for ordinal axes).
 * @param params.domain The full domain bounds.
 * @returns The zoom start and end percentages (0-100).
 */
export function rangeButtonValueToZoom(
  value: RangeButtonValue,
  params: RangeButtonFunctionParams,
): { start: number; end: number } {
  if (value === null) {
    return { start: 0, end: 100 };
  }

  if (typeof value === 'function') {
    const result = value(params);
    if (process.env.NODE_ENV !== 'production' && result.end < result.start) {
      warnOnce([
        `MUI X Charts: Range button function returned an end value (${result.end}) lower than the start value (${result.start}).`,
        'This likely produces an unexpected zoom range.',
      ]);
    }
    return { start: result.start, end: result.end };
  }

  const {
    domain: { min: domainMin, max: domainMax },
    data: ordinalData,
  } = params;

  // For ordinal axes with date-like data, resolve date ranges and intervals to matching indices.
  const timestamps = ordinalData ? toTimestampArray(ordinalData) : undefined;

  if (timestamps) {
    const maxIndex = timestamps.length - 1;

    if (Array.isArray(value)) {
      const startTarget = value[0].getTime();
      const endTarget = value[1].getTime();
      if (process.env.NODE_ENV !== 'production' && endTarget < startTarget) {
        warnOnce([
          'MUI X Charts: Range button received a date range whose end is before its start.',
          'This produces an empty zoom range.',
        ]);
      }
      const firstGte = timestamps.findIndex((ts) => !Number.isNaN(ts) && ts >= startTarget);
      const lastLte = timestamps.findLastIndex((ts) => !Number.isNaN(ts) && ts <= endTarget);
      const startIndex = firstGte === -1 ? maxIndex : firstGte;
      const endIndex = lastLte === -1 ? 0 : lastLte;
      return {
        start: (startIndex / maxIndex) * 100,
        end: (endIndex / maxIndex) * 100,
      };
    }

    // Interval — compute target date from the last valid data point's timestamp.
    const lastValidIndex = timestamps.findLastIndex((ts) => !Number.isNaN(ts));
    const lastTimestamp = timestamps[lastValidIndex];
    const targetStartMs = computeIntervalStart(value, lastTimestamp);
    const firstGte = timestamps.findIndex((ts) => !Number.isNaN(ts) && ts >= targetStartMs);
    const startIndex = firstGte === -1 ? maxIndex : firstGte;
    return {
      start: (startIndex / maxIndex) * 100,
      end: 100,
    };
  }

  if (process.env.NODE_ENV !== 'production' && ordinalData !== undefined) {
    warnOnce([
      'MUI X Charts: Range button received a date value for an ordinal axis whose data could not be parsed as dates.',
      'The zoom range may not match the intended selection. Provide date-like axis data or use a function value.',
    ]);
  }

  const domainRange = domainMax - domainMin;
  if (domainRange <= 0) {
    return { start: 0, end: 100 };
  }

  // Absolute date range
  if (Array.isArray(value)) {
    const [rangeStart, rangeEnd] = value;
    if (process.env.NODE_ENV !== 'production' && rangeEnd.getTime() < rangeStart.getTime()) {
      warnOnce([
        'MUI X Charts: Range button received a date range whose end is before its start.',
        'This produces an empty zoom range.',
      ]);
    }
    const startPercent = ((rangeStart.getTime() - domainMin) / domainRange) * 100;
    const endPercent = ((rangeEnd.getTime() - domainMin) / domainRange) * 100;
    return { start: startPercent, end: endPercent };
  }

  // Interval — subtract from the end of the domain
  const targetStartMs = computeIntervalStart(value, domainMax);
  const startPercent = ((targetStartMs - domainMin) / domainRange) * 100;

  return { start: startPercent, end: 100 };
}

/**
 * Computes the start timestamp for a calendar interval subtracted from a reference point.
 */
function computeIntervalStart(
  interval: { unit: RangeButtonIntervalUnit; step?: number },
  referenceMs: number,
): number {
  const { unit, step = 1 } = interval;

  switch (unit) {
    case 'year': {
      const d = new Date(referenceMs);
      d.setFullYear(d.getFullYear() - step);
      return d.getTime();
    }
    case 'month': {
      const d = new Date(referenceMs);
      d.setMonth(d.getMonth() - step);
      return d.getTime();
    }
    case 'week':
      return referenceMs - step * 7 * 24 * 60 * 60 * 1000;
    case 'day':
      return referenceMs - step * 24 * 60 * 60 * 1000;
    case 'hour':
      return referenceMs - step * 60 * 60 * 1000;
    case 'minute':
      return referenceMs - step * 60 * 1000;
    case 'second':
      return referenceMs - step * 1000;
    case 'millisecond':
      return referenceMs - step;
    case 'microsecond':
      return referenceMs - step / 1000;
    default:
      return 0;
  }
}
