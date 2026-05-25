import type { GridInitialState } from '@mui/x-data-grid';
import type {
  DataStudioChartConfig,
  DataStudioDataset,
  DataStudioView,
  DataStudioViewKind,
} from '../../DataStudio/DataStudio.types';
import type { DataStudioStateApi } from '../../DataStudio/useDataStudioState';

/**
 * Recording fake `DataStudioStateApi` used by command/reconciler tests.
 * Mutates internal state so a single test can drive the agent and read back
 * the resulting `views` / active selection without rendering a real Studio.
 */
export interface FakeStudioState {
  api: DataStudioStateApi<any>;
  /** Direct read-access to the internal views list for assertions. */
  readonly views: DataStudioView[];
  /** All method invocations, in order, with their arguments. */
  readonly calls: Array<{ method: string; args: ReadonlyArray<unknown> }>;
}

export interface CreateFakeStateApiOptions {
  datasets: ReadonlyArray<DataStudioDataset<any>>;
  initialViews?: DataStudioView[];
  initialActiveDatasetId?: string | null;
  initialActiveViewId?: string | null;
}

let viewSeq = 0;
function nextViewId() {
  viewSeq += 1;
  return `fake-view-${viewSeq}`;
}

export function createFakeStateApi(options: CreateFakeStateApiOptions): FakeStudioState {
  const { datasets, initialViews = [], initialActiveDatasetId = null, initialActiveViewId = null } =
    options;

  const views: DataStudioView[] = initialViews.slice();
  let activeDatasetId: string = initialActiveDatasetId ?? datasets[0]?.id ?? '';
  let activeViewId: string | null = initialActiveViewId;
  const calls: Array<{ method: string; args: ReadonlyArray<unknown> }> = [];

  function record(method: string, args: ReadonlyArray<unknown>) {
    calls.push({ method, args });
  }

  const api: DataStudioStateApi<any> = {
    get activeDatasetId() {
      return activeDatasetId;
    },
    get activeViewId() {
      return activeViewId;
    },
    get activeDataset() {
      return datasets.find((d) => d.id === activeDatasetId) ?? null;
    },
    get activeView() {
      return views.find((v) => v.id === activeViewId) ?? null;
    },
    get views() {
      return views;
    },
    selectDataset(datasetId) {
      record('selectDataset', [datasetId]);
      if (datasets.some((d) => d.id === datasetId)) {
        activeDatasetId = datasetId;
        activeViewId = null;
      }
    },
    selectView(viewId) {
      record('selectView', [viewId]);
      const target = views.find((v) => v.id === viewId);
      if (target) {
        activeViewId = viewId;
        activeDatasetId = target.datasetId;
      }
    },
    addView(input) {
      record('addView', [input]);
      const datasetId = input?.datasetId ?? activeDatasetId;
      if (!datasets.some((d) => d.id === datasetId)) {
        return null;
      }
      const kind: DataStudioViewKind = input?.kind ?? 'grid';
      const newView: DataStudioView = {
        id: nextViewId(),
        label: input?.label ?? `view-${views.length + 1}`,
        datasetId,
        ...(kind === 'chart' ? { kind } : {}),
        ...(input?.initialState && kind !== 'chart'
          ? { initialState: input.initialState as GridInitialState }
          : {}),
        ...(kind === 'chart' && input?.chartConfig
          ? { chartConfig: input.chartConfig as DataStudioChartConfig }
          : {}),
      };
      views.push(newView);
      activeViewId = newView.id;
      activeDatasetId = datasetId;
      return newView;
    },
    updateView(viewId, patch) {
      record('updateView', [viewId, patch]);
      const idx = views.findIndex((v) => v.id === viewId);
      if (idx === -1) {
        return;
      }
      const current = views[idx];
      views[idx] = {
        ...current,
        ...(patch.datasetId !== undefined ? { datasetId: patch.datasetId } : {}),
        ...(patch.chartConfig !== undefined ? { chartConfig: patch.chartConfig } : {}),
        ...(patch.initialState !== undefined ? { initialState: patch.initialState } : {}),
      };
    },
    renameView(viewId, label) {
      record('renameView', [viewId, label]);
      const idx = views.findIndex((v) => v.id === viewId);
      if (idx !== -1) {
        views[idx] = { ...views[idx], label };
      }
    },
    duplicateView(viewId) {
      record('duplicateView', [viewId]);
      const idx = views.findIndex((v) => v.id === viewId);
      if (idx === -1) {
        return null;
      }
      const copy: DataStudioView = {
        ...views[idx],
        id: nextViewId(),
        label: `${views[idx].label} (copy)`,
      };
      views.splice(idx + 1, 0, copy);
      activeViewId = copy.id;
      return copy;
    },
    deleteView(viewId) {
      record('deleteView', [viewId]);
      const idx = views.findIndex((v) => v.id === viewId);
      if (idx !== -1) {
        views.splice(idx, 1);
        if (activeViewId === viewId) {
          activeViewId = null;
        }
      }
    },
    moveView(viewId, delta) {
      record('moveView', [viewId, delta]);
      const idx = views.findIndex((v) => v.id === viewId);
      if (idx === -1) {
        return;
      }
      const targetIdx = idx + delta;
      if (targetIdx < 0 || targetIdx >= views.length) {
        return;
      }
      const [moved] = views.splice(idx, 1);
      views.splice(targetIdx, 0, moved);
    },
    invalidateDataset(datasetId) {
      record('invalidateDataset', [datasetId]);
    },
    invalidateAll() {
      record('invalidateAll', []);
    },
  };

  return {
    api,
    get views() {
      return views;
    },
    get calls() {
      return calls;
    },
  };
}
