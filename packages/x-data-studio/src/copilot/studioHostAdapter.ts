import type { HostAdapter, ToolStopContext, HostDataQueryProvider } from '@mui/x-copilot';
import type { DataStudioDataSource } from '../DataStudio/DataStudio.types';
import type { DataStudioStateApi } from '../DataStudio/useDataStudioState';
import { snapshotState, type StudioStateDocument } from './stateDocument';
import type { StudioGuards } from './guards';

/**
 * The host-side bundle the Studio command/reconciler handlers reach into at
 * runtime. Lives behind `HostAdapter.api`; x-copilot core never sees these
 * types directly.
 */
export interface StudioCopilotApi {
  readonly stateApi: DataStudioStateApi<any>;
  readonly dataSources: ReadonlyArray<DataStudioDataSource<any>>;
}

export type StudioHostAdapter = HostAdapter<StudioStateDocument, StudioCopilotApi>;

export type StudioToolStopContext = ToolStopContext<StudioStateDocument, StudioCopilotApi>;

interface CreateStudioHostAdapterOptions {
  /**
   * Live accessor for the Studio state API. Must always return the latest
   * value — the React hook wires this to a ref so re-renders don't invalidate
   * the adapter identity.
   */
  getStateApi: () => DataStudioStateApi<any>;
  /** Live accessor for the dataSources array. */
  getDataSources: () => ReadonlyArray<DataStudioDataSource<any>>;
  guards: StudioGuards;
  dataQuery?: HostDataQueryProvider<any, any>;
}

/**
 * Build a Studio host adapter that x-copilot can drive. v1 keeps the
 * lifecycle hooks as no-ops — Studio has no Grid-style auto-reconcile
 * cascades (pivot-on-model, pin-grouping, aggregation-reorder). The hooks
 * stay reserved so we can grow into them later.
 */
export function createStudioHostAdapter(
  options: CreateStudioHostAdapterOptions,
): StudioHostAdapter {
  const { getStateApi, getDataSources, dataQuery } = options;

  const api: StudioCopilotApi = {
    get stateApi() {
      return getStateApi();
    },
    get dataSources() {
      return getDataSources();
    },
  };

  return {
    id: 'data-studio',
    api,
    snapshotState: () => snapshotState(getStateApi(), getDataSources()),
    dataQuery,
    onPatchToolStop() {
      // No host-side reconciliation needed at setGridState tool stop today.
    },
    onCommandToolStop() {
      // No host-side reconciliation needed at runCommands tool stop today.
    },
    onAllToolsStop() {
      // No end-of-turn reconciliation needed today.
    },
    getCarryState: () => ({}),
    setCarryState: () => {
      // Reserved.
    },
  };
}
