/**
 * Shared types for the deterministic client-side analysis functions.
 *
 * These describe the results of pure numeric computations that run in the
 * browser (no LLM). Each type pairs with an analysis function and a panel.
 */

/** Summary statistics for a single numeric series (nulls ignored). */
export interface SummaryStats {
  min: number;
  max: number;
  mean: number;
  median: number;
  stdDev: number;
  range: number;
  total: number;
  points: number;
  /** First-to-last percentage change; drives the +/- badge color. */
  changePct: number;
}

/** Pearson correlation between two series. */
export interface CorrelationResult {
  /** Label of the first series. */
  a: string;
  /** Label of the second series. */
  b: string;
  /** Pearson correlation coefficient, in the range [-1, 1]. */
  r: number;
  strength: 'strong' | 'moderate' | 'weak' | 'none';
  direction: 'positive' | 'negative';
}

/** A single anomalous point flagged by rate-of-change detection. */
export interface Anomaly {
  seriesId: string;
  index: number;
  value: number;
  /** Change versus the previous point. */
  delta: number;
  /** delta / mean(|delta|), e.g. "12.2x the average change". */
  ratio: number;
  kind: 'drop' | 'spike';
}

/** Result of a least-squares linear forecast over a series. */
export interface ForecastResult {
  /** Slope per step. */
  slope: number;
  intercept: number;
  /** Goodness of fit (coefficient of determination). */
  r2: number;
  fit: 'strong' | 'moderate' | 'weak';
  /** The next `steps` projected values. */
  projected: number[];
  startValue: number;
  endValue: number;
}

/** The kind of technical indicator to compute. */
export type IndicatorKind =
  | 'sma'
  | 'ema'
  | 'bollinger'
  | 'pivot'
  | 'linreg'
  | 'rsi'
  | 'macd';

/** Result of an indicator computation (some indicators produce multiple lines). */
export interface IndicatorResult {
  kind: IndicatorKind;
  period: number;
  /** One entry per output line (bollinger/macd produce multiple lines). */
  series: { id: string; data: (number | null)[] }[];
}
