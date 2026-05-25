import type { GridInitialState } from '@mui/x-data-grid';
import type {
  DataStudioChartConfig,
  DataStudioDataset,
  DataStudioView,
} from '../DataStudio/DataStudio.types';
import type { DataStudioStateApi } from '../DataStudio/useDataStudioState';

/**
 * Normalized representation of a DataStudio view as it appears in the copilot
 * state document. `kind` is always explicit (defaults to `'grid'` when the
 * source view omits it). `initialState` and `chartConfig` default to empty
 * objects so the agent can patch sub-paths without first creating the slot.
 */
export interface ViewDoc {
  id: string;
  label: string;
  datasetId: string;
  kind: 'grid' | 'chart';
  initialState: GridInitialState;
  chartConfig: DataStudioChartConfig;
}

export interface DatasetDoc {
  id: string;
  label: string;
}

export interface StudioStateDocument {
  active: {
    datasetId: string | null;
    viewId: string | null;
  };
  datasets: DatasetDoc[];
  /**
   * Views keyed by id so `/views/<id>/...` paths can be addressed by the
   * agent via plain JSON Patch (which has no ID-lookup for arrays).
   */
  views: Record<string, ViewDoc>;
  /** Display order. Mutated by view CRUD commands, not by direct patches. */
  viewOrder: string[];
}

function labelToString(label: unknown): string {
  return typeof label === 'string' ? label : String(label ?? '');
}

function normalizeView(view: DataStudioView): ViewDoc {
  const kind: 'grid' | 'chart' = view.kind === 'chart' ? 'chart' : 'grid';
  return {
    id: view.id,
    label: labelToString(view.label),
    datasetId: view.datasetId,
    kind,
    initialState: view.initialState ?? {},
    chartConfig: view.chartConfig ?? {},
  };
}

function normalizeDataset(dataset: DataStudioDataset): DatasetDoc {
  return {
    id: dataset.id,
    label: labelToString(dataset.label),
  };
}

/**
 * Snapshot the current Studio state into a serializable document the copilot
 * executor can operate on.
 */
export function snapshotState(
  stateApi: DataStudioStateApi<any>,
  datasets: ReadonlyArray<DataStudioDataset<any>>,
): StudioStateDocument {
  const views: Record<string, ViewDoc> = {};
  const viewOrder: string[] = [];
  stateApi.views.forEach((view) => {
    const normalized = normalizeView(view);
    views[normalized.id] = normalized;
    viewOrder.push(normalized.id);
  });
  return {
    active: {
      datasetId: stateApi.activeDatasetId || null,
      viewId: stateApi.activeViewId,
    },
    datasets: datasets.map(normalizeDataset),
    views,
    viewOrder,
  };
}
