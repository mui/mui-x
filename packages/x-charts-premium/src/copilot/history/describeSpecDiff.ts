import type { ChartCopilotState, ChartItem } from '../chartState';
import type { ChartCopilotDatasetColumn } from '../resolveForRenderer';
import type { TransformAggregation } from '../transform';
import type { ReceiptClause } from './types';

type ColumnLike = Pick<ChartCopilotDatasetColumn, 'field' | 'headerName'>;

const eq = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

const CHART_TYPE_LABELS: Record<string, string> = {
  column: 'Column',
  bar: 'Bar',
  line: 'Line',
  area: 'Area',
  pie: 'Pie',
};

const AGG_WORDS: Record<string, string> = {
  sum: 'summed',
  avg: 'averaged',
  count: 'counted',
  min: 'min',
  max: 'max',
};

const WINDOW_UNITS: Record<string, string> = {
  D: 'days',
  W: 'weeks',
  M: 'months',
  Y: 'years',
};

function makeFieldLabel(columns?: ColumnLike[]): (field: string) => string {
  const byField = new Map((columns ?? []).map((c) => [c.field, c.headerName]));
  return (field: string) => byField.get(field) ?? field;
}

function itemFields(items: ChartItem[] | undefined): string[] {
  return (items ?? []).filter((item) => !item.hidden).map((item) => item.field);
}

function describeAggregation(
  agg: TransformAggregation,
  fieldLabel: (f: string) => string,
): string {
  const groups = agg.groupBy.map(fieldLabel).join(', ');
  const [firstMeasure, firstFn] = Object.entries(agg.measures)[0] ?? [];
  if (!firstMeasure) {
    return `grouped by ${groups}`;
  }
  const word = AGG_WORDS[firstFn] ?? firstFn;
  return `${fieldLabel(firstMeasure)} ${word} by ${groups}`;
}

function describeWindow(last: string): string {
  const match = /^(\d+)\s*([dwmy])$/i.exec(last.trim());
  if (!match) {
    return `last ${last}`;
  }
  return `last ${match[1]} ${WINDOW_UNITS[match[2].toUpperCase()] ?? match[2]}`;
}

function describeAnnotationKind(spec: {
  kind: 'refLine' | 'band' | 'marker' | 'callout';
  axis?: 'x' | 'y';
  value?: number | string;
  at?: 'max' | 'min' | 'anomaly' | number;
}): string {
  switch (spec.kind) {
    case 'refLine': {
      const orientation = spec.axis === 'x' ? 'Vertical' : 'Reference';
      return spec.value !== undefined ? `${orientation} line at ${spec.value}` : `${orientation} line`;
    }
    case 'band':
      return 'Band';
    case 'marker':
      return `Marked ${typeof spec.at === 'string' ? spec.at : 'point'}`;
    default:
      return 'Callout';
  }
}

function describeConfigKey(key: string, value: unknown): string {
  switch (key) {
    case 'stacked':
      return value ? 'Stacked' : 'Unstacked';
    case 'colorMap':
      return 'Conditional color';
    case 'colors':
      return `Palette: ${String(value)}`;
    case 'grid':
      return value === 'none' || value === false ? 'Gridlines off' : 'Gridlines';
    default:
      return value === false ? `${key} off` : `${key}`;
  }
}

/** Diff two records by key, returning keys that were added or changed. */
function changedKeys(
  before: Record<string, unknown> | undefined,
  after: Record<string, unknown> | undefined,
): string[] {
  const keys = new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]);
  const out: string[] = [];
  for (const key of keys) {
    if (!eq(before?.[key], after?.[key])) {
      out.push(key);
    }
  }
  return out;
}

/**
 * Derives the human-readable receipt clauses for a single turn by diffing the
 * before/after chart spec. Deterministic and LLM-free. Column metadata, when
 * supplied, is used to label fields by their header name.
 */
export function describeSpecDiff(
  before: ChartCopilotState,
  after: ChartCopilotState,
  columns?: ColumnLike[],
): ReceiptClause[] {
  const fieldLabel = makeFieldLabel(columns);
  const clauses: ReceiptClause[] = [];

  if (before.type !== after.type) {
    clauses.push({
      id: 'type',
      kind: 'type',
      label: CHART_TYPE_LABELS[after.type] ?? after.type,
    });
  }

  if (!eq(itemFields(before.dimensions), itemFields(after.dimensions))) {
    const fields = itemFields(after.dimensions);
    if (fields.length > 0) {
      clauses.push({ id: 'dimensions', kind: 'dimension', label: `by ${fields.map(fieldLabel).join(', ')}` });
    }
  }

  if (!eq(itemFields(before.values), itemFields(after.values))) {
    const fields = itemFields(after.values);
    if (fields.length > 0) {
      clauses.push({ id: 'values', kind: 'series', label: fields.map(fieldLabel).join(', ') });
    }
  }

  if (before.label !== after.label && after.label) {
    clauses.push({ id: 'label', kind: 'label', label: `"${after.label}"` });
  }

  // Transform sub-slices.
  const bt = before.transform ?? {};
  const at = after.transform ?? {};
  if (!eq(bt.aggregation, at.aggregation) && at.aggregation) {
    clauses.push({ id: 'aggregation', kind: 'aggregation', label: describeAggregation(at.aggregation, fieldLabel) });
  }
  if (!eq(bt.topN, at.topN) && at.topN) {
    const other = at.topN.otherBucket ? ' (+Other)' : '';
    clauses.push({ id: 'topN', kind: 'topN', label: `Top ${at.topN.n}${other}` });
  }
  if (!eq(bt.filter, at.filter) && at.filter && at.filter.length > 0) {
    const label = at.filter.length === 1
      ? `Filtered ${fieldLabel(at.filter[0].field)}`
      : `Filtered (${at.filter.length})`;
    clauses.push({ id: 'filter', kind: 'filter', label });
  }
  if (!eq(bt.dateWindow, at.dateWindow) && at.dateWindow) {
    clauses.push({ id: 'dateWindow', kind: 'window', label: describeWindow(at.dateWindow.last) });
  }

  // Display configuration keys.
  for (const key of changedKeys(before.configuration, after.configuration)) {
    clauses.push({ id: `config:${key}`, kind: 'config', label: describeConfigKey(key, after.configuration?.[key]) });
  }

  // Annotations / overlays (definitions added or changed).
  for (const id of changedKeys(before.annotations as any, after.annotations as any)) {
    const spec = after.annotations?.[id];
    if (spec) {
      const target = spec.target ? ` of ${fieldLabel(spec.target)}` : '';
      clauses.push({
        id: `annotation:${id}`,
        kind: 'annotation',
        label: `${describeAnnotationKind(spec)}${target}`,
      });
    }
  }
  for (const id of changedKeys(before.overlays as any, after.overlays as any)) {
    const spec = after.overlays?.[id];
    if (spec) {
      const period = spec.period ? ` ${spec.period}` : '';
      clauses.push({
        id: `overlay:${id}`,
        kind: 'overlay',
        label: `${spec.kind.toUpperCase()}${period} of ${fieldLabel(spec.target)}`,
      });
    }
  }

  return clauses;
}
