// Shared value-binning helpers used by the Chart and Dashboard views to group a
// date or numeric column into readable buckets (Metabase-style date binning +
// numeric histogram brackets).

export type DateGranularity = 'day' | 'month' | 'quarter' | 'year';

export const DATE_GRANULARITIES: ReadonlyArray<{ value: DateGranularity; label: string }> = [
  { value: 'day', label: 'Day' },
  { value: 'month', label: 'Month' },
  { value: 'quarter', label: 'Quarter' },
  { value: 'year', label: 'Year' },
];

export const NUMERIC_BIN_OPTIONS: ReadonlyArray<number> = [5, 10, 20, 50];
export const DEFAULT_NUMERIC_BINS = 10;

function pad2(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

/**
 * Bucket a date-ish value into a sortable label at the given granularity (so
 * grouping by a date column produces e.g. one point per month instead of one per
 * timestamp). Returns `null` for unparseable values. Bucket strings are designed
 * to sort lexically in chronological order.
 */
export function dateBucket(value: unknown, granularity: DateGranularity): string | null {
  if (value == null || value === '') {
    return null;
  }
  const date = value instanceof Date ? value : new Date(value as string | number);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  const year = date.getFullYear();
  const month = date.getMonth();
  switch (granularity) {
    case 'year':
      return `${year}`;
    case 'quarter':
      return `${year}-Q${Math.floor(month / 3) + 1}`;
    case 'day':
      return `${year}-${pad2(month + 1)}-${pad2(date.getDate())}`;
    case 'month':
    default:
      return `${year}-${pad2(month + 1)}`;
  }
}

/** Decimal places to show for a bracket bound given the bin width. */
function boundDecimals(width: number): number {
  return width >= 1 ? 0 : Math.min(4, Math.ceil(-Math.log10(width)) + 1);
}

function roundBound(value: number, width: number): number {
  const factor = 10 ** boundDecimals(width);
  return Math.round(value * factor) / factor;
}

/**
 * Bucket a numeric value into the lower bound of one of `bins` equal-width brackets
 * spanning [min, max]. Returns a number (the bracket's lower bound) so the grid sorts
 * the buckets numerically and the axis reads as a histogram. `null` for non-finite.
 */
export function numericBucket(
  value: number,
  min: number,
  max: number,
  bins: number,
): number | null {
  if (!Number.isFinite(value)) {
    return null;
  }
  if (max <= min || bins <= 1) {
    return min;
  }
  const width = (max - min) / bins;
  let index = Math.floor((value - min) / width);
  if (index >= bins) {
    index = bins - 1;
  }
  if (index < 0) {
    index = 0;
  }
  return roundBound(min + index * width, width);
}

/** A human range label ("217 – 348") for a numeric bucket's lower bound. */
export function numericBucketLabel(
  lowerBound: number,
  min: number,
  max: number,
  bins: number,
): string {
  if (max <= min || bins <= 1) {
    return `${lowerBound}`;
  }
  const width = (max - min) / bins;
  const upper = roundBound(lowerBound + width, width);
  return `${lowerBound} – ${upper}`;
}

/** Min/max of a numeric field across rows (for histogram bracketing). */
export function numericExtent(
  rows: ReadonlyArray<Record<string, unknown>>,
  field: string,
): { min: number; max: number } | null {
  let min = Infinity;
  let max = -Infinity;
  for (const row of rows) {
    const value = Number(row[field]);
    if (Number.isFinite(value)) {
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
  }
  return Number.isFinite(min) && Number.isFinite(max) ? { min, max } : null;
}
