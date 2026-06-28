/**
 * The `/annotations` and `/overlays` chart-spec slices.
 *
 * Both hold **definitions only** — the computed values (overlay series data,
 * marker points) are derived at render time from the *currently transformed*
 * rows, never cached in the document, so they stay correct after a transform
 * change (e.g. a date-window refine). See `annotations/` and 04-annotate.md.
 */

/** A reference line / band / marker / text callout drawn over the chart. */
export interface AnnotationSpec {
  id: string;
  kind: 'refLine' | 'band' | 'marker' | 'callout';
  /** Axis a refLine/band binds to. */
  axis?: 'x' | 'y';
  /** Explicit refLine value (e.g. a target at 10_000). */
  value?: number | string;
  /** Band bounds (e.g. an SLA zone 95–100). */
  from?: number;
  to?: number;
  /** Marker anchor: a computed extreme/anomaly, or an explicit data index. */
  at?: 'max' | 'min' | 'anomaly' | number;
  /** Series field the marker/band is about. */
  target?: string;
  /** Callout / label text. */
  text?: string;
}

/** A computed overlay series kind (deterministic client math). */
export type OverlayKind = 'sma' | 'ema' | 'bollinger' | 'forecast' | 'trend' | 'cumulative';

/** A computed overlay series *definition*; data is derived at render. */
export interface OverlaySpec {
  id: string;
  kind: OverlayKind;
  /** Value field to compute over. */
  target: string;
  /** Window length for sma/ema/bollinger. */
  period?: number;
  /** Projection horizon for forecast. */
  steps?: number;
  label?: string;
}
