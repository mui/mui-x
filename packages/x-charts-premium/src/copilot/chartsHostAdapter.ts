import type { HostAdapter } from '@mui/x-copilot';
import { snapshotState, type ChartCopilotState } from './chartState';
import type { ChartFocusState } from './chartFocusState';
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
  /** Live accessor for the ephemeral Focus view state (zoom + highlight). */
  getFocus(): ChartFocusState;
  /** Commit a new Focus view state (driven by the `focus.*` commands). */
  setFocus(next: ChartFocusState): void;
}

export interface ChartsHostAdapter extends HostAdapter<ChartCopilotState, ChartsCopilotApi> {}

interface CreateChartsHostAdapterOptions {
  /** Live accessor for the chart state. Wire this to a ref so re-renders keep the adapter identity stable. */
  getState(): ChartCopilotState;
  /** Commit a new chart state document. */
  setState(state: ChartCopilotState): void;
  /** Live accessor for the dataset the chart resolves against. */
  getDataset(): ChartCopilotDataset;
  /** Live accessor for the ephemeral Focus view state. */
  getFocus(): ChartFocusState;
  /** Commit a new Focus view state. */
  setFocus(focus: ChartFocusState): void;
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
  const { getState, setState, getDataset, getFocus, setFocus } = options;

  const api: ChartsCopilotApi = {
    getChartState: () => getState(),
    setChartState: (next) => setState(next),
    getDataset: () => getDataset(),
    getFocus: () => getFocus(),
    setFocus: (next) => setFocus(next),
  };

  return {
    id: 'charts-premium',
    api,
    snapshotState: () => snapshotState(getState()),
  };
}
