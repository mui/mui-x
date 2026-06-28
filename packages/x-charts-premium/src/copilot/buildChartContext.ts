import { type ChartCopilotState, snapshotState } from './chartState';
import { resolveForRenderer, type ChartCopilotDataset } from './resolveForRenderer';
import { computeForecast, computeSummaryStats, detectAnomalies } from './analysis';
import { ALL_CHART_PATCH_HANDLERS } from './reconcilers';
import { ALL_CHART_COMMAND_HANDLERS } from './chartsPacks';

const round = (value: number): number => Math.round(value * 1000) / 1000;

/**
 * Computes the grounding summary the model narrates from (PRD "Explain"): the
 * visible categories plus, per series, the resolved data and deterministic
 * client statistics (summary stats, trend, anomalies). The model cites these
 * numbers rather than guessing — "summary, never the dataset". Small-data only.
 */
function buildChartSummary(state: ChartCopilotState, dataset: ChartCopilotDataset) {
  const resolved = resolveForRenderer(state, dataset);
  const categories = resolved.dimensions[0]?.data ?? [];
  return {
    categories,
    series: resolved.values.map((value) => {
      const stats = computeSummaryStats(value.data);
      const forecast = computeForecast(value.data, 0);
      const anomalies = detectAnomalies(value.data);
      return {
        id: value.id,
        label: value.label,
        data: value.data,
        stats: {
          min: stats.min,
          max: stats.max,
          mean: round(stats.mean),
          median: stats.median,
          total: stats.total,
          changePct: round(stats.changePct),
          points: stats.points,
        },
        trend: { slope: round(forecast.slope), r2: round(forecast.r2), fit: forecast.fit },
        anomalies: anomalies.map((anomaly) => ({
          index: anomaly.index,
          value: anomaly.value,
          kind: anomaly.kind,
          ratio: round(anomaly.ratio),
        })),
      };
    }),
  };
}

/**
 * Builds a Charts Copilot context payload the backend can feed into the system
 * prompt. Mirrors `buildStudioContext` from the Data Studio demo but exposes
 * the charts surface — the bound dataset's columns, the `charts` command /
 * state-path catalog, and a computed `summary` the model narrates from.
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
    summary: buildChartSummary(state, dataset),
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
