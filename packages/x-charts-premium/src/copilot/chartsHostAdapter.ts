import type { HostAdapter } from '@mui/x-copilot';
import { snapshotState, type ChartCopilotState } from './chartState';
import type { ChartCopilotDataset } from './resolveForRenderer';

/**
 * The host-side bundle the Charts Copilot command/reconciler handlers reach
 * into at runtime. Lives behind `HostAdapter.api`; x-copilot core never sees
 * these types directly.
 */
export interface ChartsCopilotApi {
  /** Live accessor for the current chart state document. */
  getChartState(): ChartCopilotState;
  /** Commit a new chart state document. */
  setChartState(next: ChartCopilotState): void;
  /** Live accessor for the dataset the chart is resolved against. */
  getDataset(): ChartCopilotDataset;
  // TODO(M4): chartApiRef — imperative ChartsRenderer API ref for low-level reads.
  // TODO(M3): runAnalysis — host-driven data-analysis hook for insight flows.
}

export interface ChartsHostAdapter extends HostAdapter<ChartCopilotState, ChartsCopilotApi> {}

interface CreateChartsHostAdapterOptions {
  /** Live accessor for the chart state. Wire this to a ref so re-renders keep the adapter identity stable. */
  getState(): ChartCopilotState;
  /** Commit a new chart state document. */
  setState(state: ChartCopilotState): void;
  /** Live accessor for the dataset the chart resolves against. */
  getDataset(): ChartCopilotDataset;
}

/**
 * Build a Charts host adapter that x-copilot can drive. Charts have no
 * cross-slice reconcile cascades (unlike the Grid's pivot-on-model /
 * pin-grouping / aggregation-reorder), so no lifecycle hooks are wired.
 *
 * Identity is stable as long as the caller passes ref-backed getters/setters.
 */
export function createChartsHostAdapter(
  options: CreateChartsHostAdapterOptions,
): ChartsHostAdapter {
  const { getState, setState, getDataset } = options;

  const api: ChartsCopilotApi = {
    getChartState: () => getState(),
    setChartState: (next) => setState(next),
    getDataset: () => getDataset(),
  };

  return {
    id: 'charts-premium',
    api,
    snapshotState: () => snapshotState(getState()),
  };
}
