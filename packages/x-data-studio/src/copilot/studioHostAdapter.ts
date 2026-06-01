import type { HostAdapter, ToolStopContext, HostDataQueryProvider } from '@mui/x-copilot';
import type {
  DataStudioDataSource,
  DataStudioJointSourceConfig,
} from '../DataStudio/DataStudio.types';
import type { DataStudioJoinDefinition } from '../models';
import type { DataStudioStateApi } from '../DataStudio/useDataStudioState';
import { snapshotState, type StudioStateDocument } from './stateDocument';
import type { StudioGuards } from './guards';

/**
 * Joint-source mutations the copilot can drive. Sits alongside `stateApi`
 * because joint sources live in a separate hook (`useDataStudioJointSources`),
 * not on `DataStudioStateApi`.
 */
export interface StudioCopilotJointSourcesApi {
  readonly configs: ReadonlyArray<DataStudioJointSourceConfig>;
  create: (input: { label: string; definition: DataStudioJoinDefinition }) => string;
  update: (id: string, input: { label: string; definition: DataStudioJoinDefinition }) => void;
  remove: (id: string) => void;
}

/**
 * The host-side bundle the Studio command/reconciler handlers reach into at
 * runtime. Lives behind `HostAdapter.api`; x-copilot core never sees these
 * types directly.
 */
export interface StudioCopilotApi {
  readonly stateApi: DataStudioStateApi<any>;
  readonly dataSources: ReadonlyArray<DataStudioDataSource<any>>;
  readonly jointSources: StudioCopilotJointSourcesApi;
}

export type StudioHostAdapter = HostAdapter<StudioStateDocument, StudioCopilotApi>;

export type StudioToolStopContext = ToolStopContext<StudioStateDocument, StudioCopilotApi>;

interface CreateStudioHostAdapterOptions {
  /**
   * Live accessor for the Studio state API. Must always return the latest
   * value — the React hook wires this to a ref so re-renders don't invalidate
   * the adapter identity.
   * @returns {DataStudioStateApi} The current Studio state API.
   */
  getStateApi: () => DataStudioStateApi<any>;
  /**
   * Live accessor for the dataSources array.
   * @returns {ReadonlyArray<DataStudioDataSource>} The current data sources.
   */
  getDataSources: () => ReadonlyArray<DataStudioDataSource<any>>;
  /**
   * Live accessor for the joint-source management API.
   * @returns {StudioCopilotJointSourcesApi} The joint-source management API.
   */
  getJointSources: () => StudioCopilotJointSourcesApi;
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
  const { getStateApi, getDataSources, getJointSources, dataQuery } = options;

  const api: StudioCopilotApi = {
    get stateApi() {
      return getStateApi();
    },
    get dataSources() {
      return getDataSources();
    },
    get jointSources() {
      return getJointSources();
    },
  };

  return {
    id: 'data-studio',
    api,
    snapshotState: () => snapshotState(getStateApi(), getDataSources(), getJointSources().configs),
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
