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
 * Finds the first index in `timestamps` where the value is >= `target`.
 * Returns 0 if all values are greater, or `timestamps.length - 1` if all are smaller.
 */
function findFirstIndexGte(timestamps: number[], target: number): number {
  for (let i = 0; i < timestamps.length; i += 1) {
    if (timestamps[i] >= target) {
      return i;
    }
  }
  return timestamps.length - 1;
}

/**
 * Finds the last index in `timestamps` where the value is <= `target`.
 * Returns `timestamps.length - 1` if all values are smaller, or 0 if all are greater.
 */
function findLastIndexLte(timestamps: number[], target: number): number {
  for (let i = timestamps.length - 1; i >= 0; i -= 1) {
    if (timestamps[i] <= target) {
      return i;
    }
  }
  return 0;
}

/**
 * Converts ordinal data to timestamps.
 * Returns `undefined` if fewer than 2 items can be converted.
 */
function toTimestampArray(data: readonly unknown[]): number[] | undefined {
  const timestamps: number[] = [];
  for (let i = 0; i < data.length; i += 1) {
    const ts = toTimestamp(data[i]);
    if (ts === undefined) {
      return undefined;
    }
    timestamps.push(ts);
  }
  return timestamps.length >= 2 ? timestamps : undefined;
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
 * @param params.zoomed The current zoomed-in bounds.
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
    return {
      start: Math.max(0, Math.min(100, result.start)),
      end: Math.max(0, Math.min(100, result.end)),
    };
  }

  const {
    domain: { min: domainMin, max: domainMax },
    data: ordinalData,
  } = params;

  // For ordinal axes with date-like data, resolve date ranges and intervals to matching indices.
  const timestamps = ordinalData ? toTimestampArray(ordinalData) : undefined;

  if (timestamps) {
    const itemCount = timestamps.length;
    const maxIndex = itemCount - 1;

    if (Array.isArray(value)) {
      const startIdx = findFirstIndexGte(timestamps, value[0].getTime());
      const endIdx = findLastIndexLte(timestamps, value[1].getTime());
      return {
        start: Math.max(0, (startIdx / maxIndex) * 100),
        end: Math.min(100, (endIdx / maxIndex) * 100),
      };
    }

    // Interval — compute target date from the last data point's timestamp.
    const lastTimestamp = timestamps[maxIndex];
    const targetStartMs = computeIntervalStart(value, lastTimestamp);
    const startIdx = findFirstIndexGte(timestamps, targetStartMs);
    return {
      start: Math.max(0, (startIdx / maxIndex) * 100),
      end: 100,
    };
  }

  const domainRange = domainMax - domainMin;
  if (domainRange <= 0) {
    return { start: 0, end: 100 };
  }

  // Absolute date range
  if (Array.isArray(value)) {
    const [rangeStart, rangeEnd] = value;
    const startPercent = ((rangeStart.getTime() - domainMin) / domainRange) * 100;
    const endPercent = ((rangeEnd.getTime() - domainMin) / domainRange) * 100;
    return {
      start: Math.max(0, Math.min(100, startPercent)),
      end: Math.max(0, Math.min(100, endPercent)),
    };
  }

  // Interval — subtract from the end of the domain
  const targetStartMs = computeIntervalStart(value, domainMax);
  const startPercent = Math.max(0, ((targetStartMs - domainMin) / domainRange) * 100);

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
