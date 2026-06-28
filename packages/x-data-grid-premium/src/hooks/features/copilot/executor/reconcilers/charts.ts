import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import {
  gridVisibleRowsSelector,
  gridColumnGroupsUnwrappedModelSelector,
} from '@mui/x-data-grid-pro';
import type { PatchHandler, ExecutorContext, JsonPatchOp } from '../types';
import { ok, invalid } from '../types';
import type { ChartSlice } from '../stateDocument';
import type { GridChartsIntegrationItem } from '../../../chartsIntegration/gridChartsIntegrationInterfaces';

/** Hard cap on chart data points — ports `MAX_CHART_DATA_POINTS` from useGridAiAssistant.tsx:40. */
const MAX_CHART_DATA_POINTS = 1000;

function extractChartId(path: string): string | null {
  const tokens = path.split('/');
  // '/charts/<id>' or '/charts/<id>/...'
  if (tokens[1] !== 'charts' || !tokens[2]) {
    return null;
  }
  return tokens[2];
}

function applyChart(chartId: string, slice: ChartSlice, ctx: ExecutorContext) {
  ctx.apiRef.current.setActiveChartId(chartId);
  if (slice.type) {
    ctx.apiRef.current.setChartType(chartId, slice.type);
  }
  ctx.apiRef.current.updateChartDimensionsData(chartId, slice.dimensions);
  ctx.apiRef.current.updateChartValuesData(chartId, slice.values);
  if (typeof slice.synced === 'boolean') {
    ctx.apiRef.current.setChartSynchronizationState(chartId, slice.synced);
  }
}

/**
 * Defers chart updates until the post-pivot `rowsSet` event fires and the
 * unwrapped grouping model stabilises — porting the behaviour at
 * `useGridAiAssistant.tsx:314–345`.
 */
function deferChartApply(chartId: string, slice: ChartSlice, ctx: ExecutorContext) {
  let previousUnwrapped: string[] = [];
  const off = ctx.apiRef.current.subscribeEvent('rowsSet', () => {
    const unwrapped = Object.keys(gridColumnGroupsUnwrappedModelSelector(ctx.apiRef));
    if (unwrapped.length === 0 || isDeepEqual(previousUnwrapped, unwrapped)) {
      return;
    }
    previousUnwrapped = unwrapped;
    const visibleRowsCount = Math.max(gridVisibleRowsSelector(ctx.apiRef).rows.length, 1);
    const maxColumns = Math.floor(MAX_CHART_DATA_POINTS / visibleRowsCount);
    const sliced: GridChartsIntegrationItem[] = unwrapped
      .slice(0, Math.max(maxColumns, 0))
      .map((field) => ({ field }));
    ctx.apiRef.current.setActiveChartId(chartId);
    if (slice.type) {
      ctx.apiRef.current.setChartType(chartId, slice.type);
    }
    ctx.apiRef.current.updateChartDimensionsData(chartId, slice.dimensions);
    ctx.apiRef.current.updateChartValuesData(chartId, sliced);
    if (typeof slice.synced === 'boolean') {
      ctx.apiRef.current.setChartSynchronizationState(chartId, slice.synced);
    }
    off();
  });
}

function reconcileChart(doc: any, op: JsonPatchOp, ctx: ExecutorContext) {
  const chartId = extractChartId(op.path);
  if (!chartId) {
    return;
  }
  const slice: ChartSlice | undefined = doc.charts?.[chartId];
  if (!slice) {
    // `remove` op on the chart — clear by passing empty arrays.
    ctx.apiRef.current.updateChartDimensionsData(chartId, []);
    ctx.apiRef.current.updateChartValuesData(chartId, []);
    return;
  }
  const pivotJustActivated =
    ctx.appliedSlices.has('/pivot') || ctx.appliedSlices.has('/pivot/active');
  if (pivotJustActivated && doc.pivot?.active) {
    deferChartApply(chartId, slice, ctx);
  } else {
    applyChart(chartId, slice, ctx);
  }
}

export const chartHandler: PatchHandler = {
  path: '/charts/<id>',
  allowedOps: ['replace', 'add', 'remove'],
  guard: 'chartsIntegration',
  phase: 'chart',
  tier: 1,
  plan: 'premium',
  validate: (op) => {
    const id = extractChartId(op.path);
    if (!id) {
      return invalid(`malformed chart path '${op.path}'`);
    }
    return ok();
  },
  reconcile: reconcileChart,
};

export const chartTypeHandler: PatchHandler = {
  path: '/charts/<id>/type',
  allowedOps: ['replace'],
  guard: 'chartsIntegration',
  phase: 'chart',
  tier: 2,
  plan: 'premium',
  reconcile: (doc, op, ctx) => {
    const id = extractChartId(op.path);
    if (!id) {
      return;
    }
    const type = doc.charts?.[id]?.type;
    if (typeof type === 'string') {
      ctx.apiRef.current.setChartType(id, type);
    }
  },
};

export const chartDimensionsHandler: PatchHandler = {
  path: '/charts/<id>/dimensions',
  allowedOps: ['replace', 'add', 'remove'],
  guard: 'chartsIntegration',
  phase: 'chart',
  tier: 2,
  plan: 'premium',
  reconcile: (doc, op, ctx) => {
    const id = extractChartId(op.path);
    if (!id) {
      return;
    }
    ctx.apiRef.current.updateChartDimensionsData(id, doc.charts?.[id]?.dimensions ?? []);
  },
};

export const chartValuesHandler: PatchHandler = {
  path: '/charts/<id>/values',
  allowedOps: ['replace', 'add', 'remove'],
  guard: 'chartsIntegration',
  phase: 'chart',
  tier: 2,
  plan: 'premium',
  reconcile: (doc, op, ctx) => {
    const id = extractChartId(op.path);
    if (!id) {
      return;
    }
    ctx.apiRef.current.updateChartValuesData(id, doc.charts?.[id]?.values ?? []);
  },
};

export const chartSyncedHandler: PatchHandler = {
  path: '/charts/<id>/synced',
  allowedOps: ['replace'],
  guard: 'chartsIntegration',
  phase: 'chart',
  tier: 2,
  plan: 'premium',
  reconcile: (doc, op, ctx) => {
    const id = extractChartId(op.path);
    if (!id) {
      return;
    }
    const synced = doc.charts?.[id]?.synced;
    if (typeof synced === 'boolean') {
      ctx.apiRef.current.setChartSynchronizationState(id, synced);
    }
  },
};
