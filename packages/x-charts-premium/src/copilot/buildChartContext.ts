import { type ChartCopilotState, snapshotState } from './chartState';
import type { ChartCopilotDataset } from './resolveForRenderer';
import { ALL_CHART_PATCH_HANDLERS } from './reconcilers';
import { ALL_CHART_COMMAND_HANDLERS } from './chartsPacks';

/**
 * Builds a Charts Copilot context payload the backend can feed into the system
 * prompt. Mirrors `buildStudioContext` from the Data Studio demo but exposes
 * the charts surface — the bound dataset's columns and the `charts` command /
 * state-path catalog.
 */
export function buildChartContext(state: ChartCopilotState, dataset: ChartCopilotDataset) {
  return {
    version: 1 as const,
    host: 'charts' as const,
    state: snapshotState(state),
    dataset: {
      id: dataset.id,
      columns: dataset.columns.map((column) => ({
        field: column.field,
        type: column.type ?? 'string',
      })),
    },
    catalog: {
      version: 1 as const,
      commands: ALL_CHART_COMMAND_HANDLERS.map((handler) => ({
        type: handler.type,
        namespace: handler.namespace,
        tier: handler.tier,
        plan: handler.plan,
        guard: handler.guard,
      })),
      statePaths: ALL_CHART_PATCH_HANDLERS.map((handler) => ({
        path: handler.path,
        allowedOps: handler.allowedOps,
        guard: handler.guard,
      })),
    },
  };
}
