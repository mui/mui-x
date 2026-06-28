import type { PatchHandler, ExecutorContext } from '@mui/x-copilot';
import { ok, invalid } from '@mui/x-copilot';
import { configurationOptions } from '../../ChartsRenderer/configuration';
import type { ChartCopilotState, ChartCopilotChartType, ChartItem } from '../chartState';
import type { ChartsHostAdapter } from '../chartsHostAdapter';
import type { ChartCopilotDataset, ChartCopilotDatasetColumn } from '../resolveForRenderer';
import type {
  TransformAggregation,
  TransformDateWindow,
  TransformFilter,
  TransformSpec,
  TransformTopN,
} from '../transform';
import type { AnnotationSpec, OverlaySpec } from '../annotations/types';

/** Chart types `ChartsRenderer` can actually render. */
const RENDERABLE_CHART_TYPES: ChartCopilotChartType[] = ['column', 'bar', 'line', 'area', 'pie'];

type ChartsContext = ExecutorContext<ChartsHostAdapter, ChartCopilotState>;
type ChartsPatchHandler = PatchHandler<ChartsHostAdapter, ChartCopilotState>;

/**
 * Commit the (already-patched) working document to the host.
 *
 * The executor applies the JSON-Patch op to its working doc *before* calling
 * `reconcile` (see `createExecutor.ts`: `doc = nextDoc; handler.reconcile(doc, …)`),
 * so each reconciler only needs to forward the finished document to the host.
 */
function commit(doc: ChartCopilotState, ctx: ChartsContext): void {
  ctx.adapter.api.setChartState(doc);
}

/** Collect the set of valid `configuration` keys for a given chart type. */
function configurationKeysForType(type: string): Set<string> {
  const keys = new Set<string>();
  const option = configurationOptions[type];
  if (!option) {
    return keys;
  }
  option.customization.forEach((section) => {
    Object.keys(section.controls).forEach((key) => keys.add(key));
  });
  return keys;
}

/** Read the trailing `<key>` token from a `/configuration/<key>` pointer. */
function configurationKeyFromPath(path: string): string | null {
  const tokens = path.split('/');
  // '/configuration/<key>'
  if (tokens[1] !== 'configuration' || !tokens[2]) {
    return null;
  }
  return tokens.slice(2).join('/').replace(/~1/g, '/').replace(/~0/g, '~');
}

function columnByField(
  dataset: ChartCopilotDataset,
  field: string,
): ChartCopilotDatasetColumn | undefined {
  return dataset.columns.find((column) => column.field === field);
}

function validateItems(
  items: unknown,
  dataset: ChartCopilotDataset,
  { requireNumeric }: { requireNumeric: boolean },
): { ok: true } | { ok: false; reason: string } {
  if (!Array.isArray(items)) {
    return invalid(`expected an array of chart items`);
  }
  for (const raw of items) {
    const item = raw as Partial<ChartItem> | null;
    if (!item || typeof item.field !== 'string') {
      return invalid(`each chart item must have a string 'field'`);
    }
    const column = columnByField(dataset, item.field);
    if (!column) {
      return invalid(`field '${item.field}' is not a column in the bound dataset`);
    }
    if (requireNumeric && column.type !== 'number') {
      return invalid(`value field '${item.field}' must reference a numeric column`);
    }
  }
  return ok();
}

/** `/type` — switch among the renderable chart types. */
export const chartTypeHandler: ChartsPatchHandler = {
  path: '/type',
  allowedOps: ['replace'],
  guard: 'chartsIntegration',
  phase: 'chart',
  tier: 1,
  plan: 'premium',
  validate: (op) => {
    if (!RENDERABLE_CHART_TYPES.includes(op.value as ChartCopilotChartType)) {
      return invalid(
        `chart type '${String(op.value)}' is not renderable — expected one of ${RENDERABLE_CHART_TYPES.join(', ')}`,
      );
    }
    return ok();
  },
  reconcile: (doc, _op, ctx) => commit(doc, ctx),
};

/** `/dimensions` — set the category/axis fields. */
export const chartDimensionsHandler: ChartsPatchHandler = {
  path: '/dimensions',
  allowedOps: ['replace', 'add', 'remove'],
  guard: 'chartsIntegration',
  phase: 'chart',
  tier: 2,
  plan: 'premium',
  validate: (_op, doc, ctx) =>
    validateItems(doc.dimensions, ctx.adapter.api.getDataset(), { requireNumeric: false }),
  reconcile: (doc, _op, ctx) => commit(doc, ctx),
};

/** `/values` — set the numeric series fields. */
export const chartValuesHandler: ChartsPatchHandler = {
  path: '/values',
  allowedOps: ['replace', 'add', 'remove'],
  guard: 'chartsIntegration',
  phase: 'chart',
  tier: 2,
  plan: 'premium',
  validate: (_op, doc, ctx) =>
    validateItems(doc.values, ctx.adapter.api.getDataset(), { requireNumeric: true }),
  reconcile: (doc, _op, ctx) => commit(doc, ctx),
};

/** `/label` — chart label/title. */
export const chartLabelHandler: ChartsPatchHandler = {
  path: '/label',
  allowedOps: ['add', 'replace', 'remove'],
  guard: 'chartsIntegration',
  phase: 'chart',
  tier: 2,
  plan: 'premium',
  validate: (op) => {
    if (op.op !== 'remove' && typeof op.value !== 'string') {
      return invalid(`chart label must be a string`);
    }
    return ok();
  },
  reconcile: (doc, _op, ctx) => commit(doc, ctx),
};

/** `/configuration/<key>` — any control key valid for the current chart type. */
export const chartConfigurationHandler: ChartsPatchHandler = {
  path: '/configuration/<key>',
  allowedOps: ['add', 'replace', 'remove'],
  guard: 'chartsIntegration',
  phase: 'chart',
  tier: 2,
  plan: 'premium',
  validate: (op, doc) => {
    const key = configurationKeyFromPath(op.path);
    if (!key) {
      return invalid(`malformed configuration path '${op.path}'`);
    }
    // Best-effort: warn (reject this op) when the key isn't known for the
    // current type, but never throw — other ops in the envelope still apply.
    const validKeys = configurationKeysForType(doc.type);
    if (validKeys.size > 0 && !validKeys.has(key)) {
      return invalid(`'${key}' is not a known configuration key for chart type '${doc.type}'`);
    }
    return ok();
  },
  reconcile: (doc, _op, ctx) => commit(doc, ctx),
};

// ---------------------------------------------------------------------------
// `/transform` — the declarative data layer (aggregation / topN / filter /
// dateWindow / transpose). Validated against the bound dataset's columns.
// ---------------------------------------------------------------------------

const TRANSFORM_KEYS = new Set(['filter', 'dateWindow', 'aggregation', 'topN', 'transpose']);

/** Read the `<key>` token from a `/transform/<key>` pointer. */
function transformKeyFromPath(path: string): string | null {
  const tokens = path.split('/');
  if (tokens[1] !== 'transform' || !tokens[2]) {
    return null;
  }
  return tokens[2];
}

type ValidationResult = { ok: true } | { ok: false; reason: string };

function fieldsExist(fields: string[], dataset: ChartCopilotDataset): string | null {
  for (const field of fields) {
    if (!columnByField(dataset, field)) {
      return `field '${field}' is not a column in the bound dataset`;
    }
  }
  return null;
}

/** Validate a single transform key's value against the dataset. */
function validateTransformValue(
  key: string,
  value: unknown,
  dataset: ChartCopilotDataset,
): ValidationResult {
  switch (key) {
    case 'aggregation': {
      const agg = value as TransformAggregation | null;
      if (!agg || !Array.isArray(agg.groupBy) || agg.groupBy.length === 0) {
        return invalid(`aggregation requires a non-empty 'groupBy'`);
      }
      const missing = fieldsExist(agg.groupBy, dataset);
      if (missing) {
        return invalid(missing);
      }
      if (!agg.measures || typeof agg.measures !== 'object') {
        return invalid(`aggregation requires a 'measures' map`);
      }
      for (const [field, fn] of Object.entries(agg.measures)) {
        const column = columnByField(dataset, field);
        if (!column) {
          return invalid(`measure field '${field}' is not a column in the bound dataset`);
        }
        if (fn !== 'count' && column.type !== 'number') {
          return invalid(`measure '${field}' must reference a numeric column for '${fn}'`);
        }
      }
      return ok();
    }
    case 'topN': {
      const topN = value as TransformTopN | null;
      if (!topN || typeof topN.measure !== 'string' || !columnByField(dataset, topN.measure)) {
        return invalid(`topN.measure must reference a dataset column`);
      }
      if (typeof topN.n !== 'number' || topN.n < 1) {
        return invalid(`topN.n must be a number >= 1`);
      }
      return ok();
    }
    case 'filter': {
      if (!Array.isArray(value)) {
        return invalid(`filter must be an array of predicates`);
      }
      for (const raw of value) {
        const filter = raw as Partial<TransformFilter> | null;
        if (!filter || typeof filter.field !== 'string' || !columnByField(dataset, filter.field)) {
          return invalid(`each filter must have a 'field' referencing a dataset column`);
        }
      }
      return ok();
    }
    case 'dateWindow': {
      const dateWindow = value as TransformDateWindow | null;
      if (
        !dateWindow ||
        typeof dateWindow.field !== 'string' ||
        !columnByField(dataset, dateWindow.field)
      ) {
        return invalid(`dateWindow.field must reference a dataset column`);
      }
      if (typeof dateWindow.last !== 'string') {
        return invalid(`dateWindow.last must be a string like '6M' or '30D'`);
      }
      return ok();
    }
    case 'transpose': {
      if (typeof value !== 'boolean') {
        return invalid(`transpose must be a boolean`);
      }
      return ok();
    }
    default:
      return invalid(`unknown transform key '${key}'`);
  }
}

/** `/transform` — replace/remove the whole data-layer slice. */
export const chartTransformHandler: ChartsPatchHandler = {
  path: '/transform',
  allowedOps: ['add', 'replace', 'remove'],
  guard: 'chartsIntegration',
  phase: 'chart',
  tier: 2,
  plan: 'premium',
  validate: (op, _doc, ctx) => {
    if (op.op === 'remove') {
      return ok();
    }
    const value = op.value as TransformSpec | null;
    if (!value || typeof value !== 'object') {
      return invalid(`transform must be an object`);
    }
    const dataset = ctx.adapter.api.getDataset();
    for (const key of Object.keys(value)) {
      if (!TRANSFORM_KEYS.has(key)) {
        return invalid(`unknown transform key '${key}'`);
      }
      const result = validateTransformValue(key, (value as Record<string, unknown>)[key], dataset);
      if (!result.ok) {
        return result;
      }
    }
    return ok();
  },
  reconcile: (doc, _op, ctx) => commit(doc, ctx),
};

/** `/transform/<key>` — patch one transform key (aggregation, topN, filter, …). */
export const chartTransformKeyHandler: ChartsPatchHandler = {
  path: '/transform/<key>',
  allowedOps: ['add', 'replace', 'remove'],
  guard: 'chartsIntegration',
  phase: 'chart',
  tier: 2,
  plan: 'premium',
  validate: (op, _doc, ctx) => {
    const key = transformKeyFromPath(op.path);
    if (!key || !TRANSFORM_KEYS.has(key)) {
      return invalid(`malformed or unknown transform path '${op.path}'`);
    }
    if (op.op === 'remove') {
      return ok();
    }
    return validateTransformValue(key, op.value, ctx.adapter.api.getDataset());
  },
  reconcile: (doc, _op, ctx) => commit(doc, ctx),
};

// ---------------------------------------------------------------------------
// `/annotations/<id>` and `/overlays/<id>` — the Annotate slices. Validate-only:
// overlay series data and marker points are computed at *render* time from the
// current transform (see `resolveAnnotations`), never cached in the document.
// ---------------------------------------------------------------------------

const ANNOTATION_KINDS = new Set(['refLine', 'band', 'marker', 'callout']);
const OVERLAY_KINDS = new Set(['sma', 'ema', 'bollinger', 'forecast', 'trend', 'cumulative']);
/** Overlays are line series, so they only make sense on line/area charts. */
const OVERLAY_CHART_TYPES = new Set<ChartCopilotChartType>(['line', 'area']);

function validateAnnotationValue(value: unknown, dataset: ChartCopilotDataset): ValidationResult {
  const spec = value as Partial<AnnotationSpec> | null;
  if (!spec || typeof spec !== 'object') {
    return invalid(`annotation must be an object`);
  }
  if (!spec.kind || !ANNOTATION_KINDS.has(spec.kind)) {
    return invalid(
      `annotation kind '${String(spec.kind)}' is not one of refLine, band, marker, callout`,
    );
  }
  if (spec.target !== undefined && !columnByField(dataset, spec.target)) {
    return invalid(`annotation target '${spec.target}' is not a column in the bound dataset`);
  }
  if (spec.kind === 'band' && (typeof spec.from !== 'number' || typeof spec.to !== 'number')) {
    return invalid(`a band annotation requires numeric 'from' and 'to' bounds`);
  }
  if (spec.kind === 'marker' && spec.at === undefined) {
    return invalid(`a marker annotation requires 'at' (max, min, anomaly, or an index)`);
  }
  return ok();
}

function validateOverlayValue(
  value: unknown,
  doc: ChartCopilotState,
  dataset: ChartCopilotDataset,
): ValidationResult {
  const spec = value as Partial<OverlaySpec> | null;
  if (!spec || typeof spec !== 'object') {
    return invalid(`overlay must be an object`);
  }
  if (!spec.kind || !OVERLAY_KINDS.has(spec.kind)) {
    return invalid(`overlay kind '${String(spec.kind)}' is not a known overlay`);
  }
  if (!OVERLAY_CHART_TYPES.has(doc.type)) {
    return invalid(
      `overlays are only supported on line and area charts, not '${doc.type}' — switch the chart type first`,
    );
  }
  const column = spec.target ? columnByField(dataset, spec.target) : undefined;
  if (!column) {
    return invalid(`overlay target '${String(spec.target)}' is not a column in the bound dataset`);
  }
  if (column.type !== 'number') {
    return invalid(`overlay target '${spec.target}' must reference a numeric column`);
  }
  if (spec.period !== undefined && (typeof spec.period !== 'number' || spec.period < 1)) {
    return invalid(`overlay period must be a number >= 1`);
  }
  return ok();
}

// Validate each entry of a whole `/annotations` or `/overlays` map.
function validateSlice(
  value: unknown,
  validateEntry: (entry: unknown) => ValidationResult,
): ValidationResult {
  if (!value || typeof value !== 'object') {
    return invalid(`expected a map of definitions keyed by id`);
  }
  for (const entry of Object.values(value as Record<string, unknown>)) {
    const result = validateEntry(entry);
    if (!result.ok) {
      return result;
    }
  }
  return ok();
}

/** `/annotations/<id>` — one reference line / band / marker / callout. */
export const chartAnnotationHandler: ChartsPatchHandler = {
  path: '/annotations/<id>',
  allowedOps: ['add', 'replace', 'remove'],
  guard: 'annotate',
  phase: 'chart',
  tier: 2,
  plan: 'premium',
  validate: (op, _doc, ctx) =>
    op.op === 'remove' ? ok() : validateAnnotationValue(op.value, ctx.adapter.api.getDataset()),
  reconcile: (doc, _op, ctx) => commit(doc, ctx),
};

/** `/annotations` — replace/add the whole annotation map (works from empty). */
export const chartAnnotationsHandler: ChartsPatchHandler = {
  path: '/annotations',
  allowedOps: ['add', 'replace', 'remove'],
  guard: 'annotate',
  phase: 'chart',
  tier: 2,
  plan: 'premium',
  validate: (op, _doc, ctx) => {
    if (op.op === 'remove') {
      return ok();
    }
    const dataset = ctx.adapter.api.getDataset();
    return validateSlice(op.value, (entry) => validateAnnotationValue(entry, dataset));
  },
  reconcile: (doc, _op, ctx) => commit(doc, ctx),
};

/** `/overlays/<id>` — one computed line overlay (SMA/EMA/forecast/trend/…). */
export const chartOverlayHandler: ChartsPatchHandler = {
  path: '/overlays/<id>',
  allowedOps: ['add', 'replace', 'remove'],
  guard: 'annotate',
  phase: 'chart',
  tier: 2,
  plan: 'premium',
  validate: (op, doc, ctx) =>
    op.op === 'remove' ? ok() : validateOverlayValue(op.value, doc, ctx.adapter.api.getDataset()),
  reconcile: (doc, _op, ctx) => commit(doc, ctx),
};

/** `/overlays` — replace/add the whole overlay map (works from empty). */
export const chartOverlaysHandler: ChartsPatchHandler = {
  path: '/overlays',
  allowedOps: ['add', 'replace', 'remove'],
  guard: 'annotate',
  phase: 'chart',
  tier: 2,
  plan: 'premium',
  validate: (op, doc, ctx) => {
    if (op.op === 'remove') {
      return ok();
    }
    const dataset = ctx.adapter.api.getDataset();
    return validateSlice(op.value, (entry) => validateOverlayValue(entry, doc, dataset));
  },
  reconcile: (doc, _op, ctx) => commit(doc, ctx),
};

/** All Charts Copilot patch handlers, in registration order. */
export const ALL_CHART_PATCH_HANDLERS: ChartsPatchHandler[] = [
  chartTypeHandler,
  chartDimensionsHandler,
  chartValuesHandler,
  chartLabelHandler,
  chartConfigurationHandler,
  chartTransformHandler,
  chartTransformKeyHandler,
  chartAnnotationsHandler,
  chartAnnotationHandler,
  chartOverlaysHandler,
  chartOverlayHandler,
];
