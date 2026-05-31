import type { Guards } from '@mui/x-copilot';

/**
 * Default Charts Copilot guard flags. Reuses only built-in guard keys.
 *
 * - `chartsIntegration`: gates chart-shaping handlers (type, dimensions,
 *   values, configuration, the data-shaping transform). On → the agent can
 *   build and edit the chart.
 * - `annotate`: gates the annotation + computed-overlay handlers. On → the
 *   agent can add reference lines, bands, markers, and SMA/trend/forecast
 *   overlays.
 * - `mutations`: gates tier-3 (mutation-class) handlers. Off → the agent can
 *   read state and answer questions but cannot change anything destructive.
 */
export const DEFAULT_CHART_GUARDS = {
  chartsIntegration: true,
  annotate: true,
  mutations: false,
} satisfies Guards;

export function buildChartGuards(
  features?: Partial<Record<keyof typeof DEFAULT_CHART_GUARDS, boolean>>,
): Guards {
  return { ...DEFAULT_CHART_GUARDS, ...features };
}
