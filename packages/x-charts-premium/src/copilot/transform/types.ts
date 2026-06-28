/**
 * The `/transform` chart-spec slice: a declarative, serializable description of
 * the data operations applied to the bound dataset rows *before* they are
 * resolved into chart series.
 *
 * This is the data layer the renderer never had — `resolveForRenderer` plots
 * rows verbatim, so without aggregation "revenue by region" draws one bar per
 * row. The slice is patched by the copilot (e.g. `{ aggregation: { groupBy:
 * ['region'], measures: { revenue: 'sum' } } }`) and applied by `applyTransform`.
 */

/** Supported group-by aggregation functions. */
export type AggFn = 'sum' | 'avg' | 'count' | 'min' | 'max';

/** Group rows by one or more fields and reduce each numeric measure. */
export interface TransformAggregation {
  /** Dimension fields to group on. One output row per distinct combination. */
  groupBy: string[];
  /** Value field → reducer. e.g. `{ revenue: 'sum', orders: 'count' }`. */
  measures: Record<string, AggFn>;
}

/** Keep the `n` rows with the largest `measure`, optionally bucketing the rest. */
export interface TransformTopN {
  /** Field to rank by (descending). */
  measure: string;
  /** Number of rows to keep. */
  n: number;
  /** When true, collapse the remaining rows into a single "Other" row. */
  otherBucket?: boolean;
}

/** Row-level filter operators. */
export type FilterOp = 'eq' | 'neq' | 'gt' | 'lt' | 'in' | 'between';

/** A single row predicate; multiple filters combine with AND. */
export interface TransformFilter {
  field: string;
  op: FilterOp;
  /** Scalar for eq/neq/gt/lt; array for `in`; `[min, max]` for `between`. */
  value: unknown;
}

/**
 * Keep only rows whose date falls in the last `last` window, measured relative
 * to the **maximum date present in the column** (not the wall clock) so the
 * result is deterministic for static/historical datasets. `last` is
 * `<number><unit>` with unit D/W/M/Y, e.g. `"6M"`, `"30D"`.
 */
export interface TransformDateWindow {
  field: string;
  last: string;
}

export interface TransformSpec {
  filter?: TransformFilter[];
  dateWindow?: TransformDateWindow;
  aggregation?: TransformAggregation;
  topN?: TransformTopN;
  /**
   * Swap dimension/value roles. NOTE: transpose reshapes the *resolved*
   * dimensions/values, not the raw rows, so it is applied by
   * `resolveForRenderer`, not `applyTransform`.
   */
  transpose?: boolean;
}
