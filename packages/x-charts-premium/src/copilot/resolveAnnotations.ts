import {
  computeCumulative,
  computeForecast,
  computeIndicator,
  computeTrend,
  detectAnomalies,
} from './analysis';
import type { AnnotationSpec, OverlaySpec } from './annotations/types';
import type { RenderedItem } from './chartState';
import type { RenderedValueItem } from './resolveForRenderer';

/**
 * A reference line resolved from an annotation, ready to render as a
 * `ChartsReferenceLine`. `axis: 'y'` binds to a value, `axis: 'x'` to a category.
 */
export interface ResolvedAnnotation {
  id: string;
  axis: 'x' | 'y';
  value: string | number;
  label?: string;
}

const MARKER_WORDS: Record<string, string> = { max: 'Peak', min: 'Low', anomaly: 'Anomaly' };

function overlayLabel(overlay: OverlaySpec, targetLabel: string, lineId?: string): string {
  if (overlay.label) {
    return lineId ? `${overlay.label} (${lineId})` : overlay.label;
  }
  const period = overlay.period ? ` ${overlay.period}` : '';
  const suffix = lineId ? ` (${lineId})` : '';
  return `${overlay.kind.toUpperCase()}${period} · ${targetLabel}${suffix}`;
}

/**
 * Computes the overlay line series for the current chart from the *transformed*
 * value series — so a moving average or trend recomputes after a data-shaping
 * change rather than reading a cached array. Overlays whose target is missing
 * are skipped. Returns extra series to append to the chart's `values`.
 */
export function resolveOverlaySeries(
  overlays: Record<string, OverlaySpec> | undefined,
  values: RenderedValueItem[],
): RenderedValueItem[] {
  if (!overlays) {
    return [];
  }
  const byField = new Map(values.map((value) => [value.id, value]));
  const out: RenderedValueItem[] = [];

  for (const overlay of Object.values(overlays)) {
    const target = byField.get(overlay.target);
    if (!target) {
      continue;
    }
    const data = target.data;

    if (overlay.kind === 'sma' || overlay.kind === 'ema' || overlay.kind === 'bollinger') {
      const result = computeIndicator(overlay.kind, data, { period: overlay.period });
      const multi = result.series.length > 1;
      for (const line of result.series) {
        out.push({
          id: `${overlay.id}:${line.id}`,
          label: overlayLabel(overlay, target.label, multi ? line.id : undefined),
          data: line.data,
        });
      }
    } else if (overlay.kind === 'trend') {
      out.push({ id: overlay.id, label: overlayLabel(overlay, target.label), data: computeTrend(data) });
    } else if (overlay.kind === 'cumulative') {
      out.push({
        id: overlay.id,
        label: overlayLabel(overlay, target.label),
        data: computeCumulative(data),
      });
    } else if (overlay.kind === 'forecast') {
      const forecast = computeForecast(data, 0);
      const fitted = data.map((_value, index) => forecast.slope * index + forecast.intercept);
      out.push({ id: overlay.id, label: overlayLabel(overlay, target.label), data: fitted });
    }
  }

  return out;
}

/** Find the index of the extreme/anomaly an `at` marker refers to. */
function resolveMarkerIndex(
  at: AnnotationSpec['at'],
  data: (number | null)[],
): number | null {
  if (typeof at === 'number') {
    return at >= 0 && at < data.length ? at : null;
  }
  if (at === 'anomaly') {
    const anomalies = detectAnomalies(data);
    if (anomalies.length === 0) {
      return null;
    }
    // The most significant anomaly (largest relative change).
    return anomalies.reduce((best, a) => (Math.abs(a.ratio) > Math.abs(best.ratio) ? a : best)).index;
  }
  // max / min
  let bestIndex = -1;
  let best = at === 'max' ? -Infinity : Infinity;
  for (let i = 0; i < data.length; i += 1) {
    const v = data[i];
    if (v == null || !Number.isFinite(v)) {
      continue;
    }
    if ((at === 'max' && v > best) || (at === 'min' && v < best)) {
      best = v;
      bestIndex = i;
    }
  }
  return bestIndex >= 0 ? bestIndex : null;
}

/**
 * Resolves annotation definitions into reference lines, computing marker
 * positions (max/min/anomaly) against the *transformed* series at render time.
 *
 * @param annotations The annotation definitions from the chart spec.
 * @param dimensions The resolved category dimensions (the first is the x-axis).
 * @param values The resolved value series (markers resolve against their target).
 */
export function resolveAnnotations(
  annotations: Record<string, AnnotationSpec> | undefined,
  dimensions: RenderedItem[],
  values: RenderedValueItem[],
): ResolvedAnnotation[] {
  if (!annotations) {
    return [];
  }
  const categories = dimensions[0]?.data ?? [];
  const byField = new Map(values.map((value) => [value.id, value]));
  const out: ResolvedAnnotation[] = [];

  for (const annotation of Object.values(annotations)) {
    switch (annotation.kind) {
      case 'refLine':
      case 'callout': {
        if (annotation.value !== undefined) {
          out.push({
            id: annotation.id,
            axis: annotation.axis ?? 'y',
            value: annotation.value,
            label: annotation.text ?? String(annotation.value),
          });
        }
        break;
      }
      case 'band': {
        if (typeof annotation.from === 'number') {
          out.push({ id: `${annotation.id}:from`, axis: 'y', value: annotation.from, label: annotation.text });
        }
        if (typeof annotation.to === 'number') {
          out.push({ id: `${annotation.id}:to`, axis: 'y', value: annotation.to });
        }
        break;
      }
      case 'marker': {
        const target = annotation.target ? byField.get(annotation.target) : values[0];
        if (!target) {
          break;
        }
        const index = resolveMarkerIndex(annotation.at, target.data);
        if (index == null) {
          break;
        }
        const category = categories[index];
        if (category == null) {
          break;
        }
        const value = target.data[index];
        const word = typeof annotation.at === 'string' ? MARKER_WORDS[annotation.at] ?? 'Point' : 'Point';
        out.push({
          id: annotation.id,
          axis: 'x',
          value: category as string | number,
          label: annotation.text ?? `${word}: ${value}`,
        });
        break;
      }
      default:
        break;
    }
  }

  return out;
}
