'use client';
import * as React from 'react';
import type { GridInitialState, GridValidRowModel } from '@mui/x-data-grid';
import type {
  DataStudioChartConfig,
  DataStudioDataset,
  DataStudioProps,
  DataStudioView,
  DataStudioViewKind,
} from './DataStudio.types';
import type { DataStudioSessionCache } from './sessionCache';

export interface DataStudioStateApi<R extends GridValidRowModel = any> {
  activeDatasetId: string;
  activeViewId: string | null;
  activeDataset: DataStudioDataset<R> | null;
  activeView: DataStudioView | null;
  views: DataStudioView[];
  selectDataset: (datasetId: string) => void;
  selectView: (viewId: string) => void;
  addView: (input?: {
    datasetId?: string;
    label?: string;
    initialState?: GridInitialState;
    kind?: DataStudioViewKind;
    chartConfig?: DataStudioChartConfig;
  }) => DataStudioView | null;
  updateView: (
    viewId: string,
    patch: {
      datasetId?: string;
      chartConfig?: DataStudioChartConfig;
      initialState?: GridInitialState;
    },
  ) => void;
  renameView: (viewId: string, label: string) => void;
  duplicateView: (viewId: string) => DataStudioView | null;
  deleteView: (viewId: string) => void;
  moveView: (viewId: string, delta: number) => void;
  /**
   * Drop every cached page for the given dataset.
   * No-op unless `cacheStrategy === 'shared'`.
   * @param {string} datasetId The dataset id to invalidate.
   */
  invalidateDataset: (datasetId: string) => void;
  /**
   * Drop every cached page across all datasets in this `<DataStudio>`.
   * No-op unless `cacheStrategy === 'shared'`.
   */
  invalidateAll: () => void;
}

function getDatasetById<R extends GridValidRowModel>(
  datasets: readonly DataStudioDataset<R>[],
  datasetId: string | null | undefined,
) {
  if (datasetId == null) {
    return undefined;
  }
  return datasets.find((dataset) => dataset.id === datasetId);
}

function getViewById(views: readonly DataStudioView[], viewId: string | null | undefined) {
  if (viewId == null) {
    return undefined;
  }
  return views.find((view) => view.id === viewId);
}

let nextViewSeq = 0;

function createViewId() {
  nextViewSeq += 1;
  return `view-${Date.now().toString(36)}-${nextViewSeq.toString(36)}`;
}

function getDefaultViewLabel(views: readonly DataStudioView[]) {
  // Grid views auto-label as "Sheet N" using the global view count so the
  // numbering matches the user's tab order.
  let index = views.length + 1;
  const existing = new Set(views.map((view) => String(view.label)));
  while (existing.has(`Sheet ${index}`)) {
    index += 1;
  }
  return `Sheet ${index}`;
}

function getDefaultChartLabel(views: readonly DataStudioView[]) {
  // Charts get their own counter so "Chart 1, Chart 2, ..." stays continuous
  // even when grid views are interleaved in the tab strip.
  const chartCount = views.filter((view) => view.kind === 'chart').length;
  let index = chartCount + 1;
  const existing = new Set(views.map((view) => String(view.label)));
  while (existing.has(`Chart ${index}`)) {
    index += 1;
  }
  return `Chart ${index}`;
}

export function useDataStudioState<R extends GridValidRowModel = any>(
  props: Pick<
    DataStudioProps<R>,
    | 'datasets'
    | 'activeDatasetId'
    | 'initialDatasetId'
    | 'onActiveDatasetChange'
    | 'views'
    | 'defaultViews'
    | 'onViewsChange'
    | 'activeViewId'
    | 'initialActiveViewId'
    | 'onActiveViewChange'
  > & {
    sessionCache?: DataStudioSessionCache | null;
    /**
     * One-shot loader called on mount when `views` is uncontrolled. Returning a
     * non-null array replaces the seeded uncontrolled views without firing
     * `onViewsChange` (it's a hydration, not a user action).
     * @returns {DataStudioView[] | null} The persisted views to hydrate, or
     *   `null` to keep the initial `defaultViews`.
     */
    hydrateViews?: () => DataStudioView[] | null;
  },
): DataStudioStateApi<R> {
  const {
    datasets,
    activeDatasetId: activeDatasetIdProp,
    initialDatasetId,
    onActiveDatasetChange,
    views: viewsProp,
    defaultViews,
    onViewsChange,
    activeViewId: activeViewIdProp,
    initialActiveViewId,
    onActiveViewChange,
    sessionCache,
    hydrateViews,
  } = props;

  const isDatasetControlled = activeDatasetIdProp !== undefined;
  const isViewsControlled = viewsProp !== undefined;
  const isActiveViewControlled = activeViewIdProp !== undefined;

  const [uncontrolledDatasetId, setUncontrolledDatasetId] = React.useState(
    () => initialDatasetId ?? datasets[0]?.id ?? '',
  );
  const [uncontrolledViews, setUncontrolledViews] = React.useState<DataStudioView[]>(
    () => defaultViews ?? [],
  );
  const [uncontrolledActiveViewId, setUncontrolledActiveViewId] = React.useState<string | null>(
    () => initialActiveViewId ?? null,
  );

  const views = isViewsControlled ? viewsProp! : uncontrolledViews;

  // Resolve the requested active view id and fall back to null if it points at a missing view.
  const requestedActiveViewId = isActiveViewControlled
    ? (activeViewIdProp ?? null)
    : uncontrolledActiveViewId;
  const activeView = getViewById(views, requestedActiveViewId) ?? null;
  const activeViewId = activeView?.id ?? null;

  // Active dataset: prefer the view's datasetId when a view is active.
  const requestedDatasetId = isDatasetControlled
    ? activeDatasetIdProp
    : (activeView?.datasetId ?? uncontrolledDatasetId);
  const activeDataset = getDatasetById(datasets, requestedDatasetId) ?? datasets[0] ?? null;
  const activeDatasetId = activeDataset?.id ?? '';

  const selectDataset = React.useCallback(
    (datasetId: string) => {
      const nextDataset = getDatasetById(datasets, datasetId);
      if (!nextDataset) {
        return;
      }
      if (!isDatasetControlled) {
        setUncontrolledDatasetId(datasetId);
      }
      if (!isActiveViewControlled) {
        setUncontrolledActiveViewId(null);
      }
      onActiveDatasetChange?.(datasetId, nextDataset);
      // A view tab can only be active alongside a dataset, so picking a dataset
      // tab implicitly clears the active view.
      onActiveViewChange?.(null, null);
    },
    [
      datasets,
      isDatasetControlled,
      isActiveViewControlled,
      onActiveDatasetChange,
      onActiveViewChange,
    ],
  );

  const selectView = React.useCallback(
    (viewId: string) => {
      const nextView = getViewById(views, viewId);
      if (!nextView) {
        return;
      }
      const nextDataset = getDatasetById(datasets, nextView.datasetId);
      if (!isActiveViewControlled) {
        setUncontrolledActiveViewId(viewId);
      }
      if (!isDatasetControlled && nextDataset) {
        setUncontrolledDatasetId(nextDataset.id);
      }
      onActiveViewChange?.(viewId, nextView);
      if (nextDataset) {
        onActiveDatasetChange?.(nextDataset.id, nextDataset);
      }
    },
    [
      datasets,
      views,
      isActiveViewControlled,
      isDatasetControlled,
      onActiveViewChange,
      onActiveDatasetChange,
    ],
  );

  // One-shot hydration: when uncontrolled and a loader is provided, replace the
  // initially seeded views with the persisted list. Runs after first render so
  // server-rendered markup matches the first client render (no hydration
  // mismatch on `defaultViews`); persisted views then appear on commit.
  // `onViewsChange` is intentionally NOT fired — this is a hydration, not a
  // user mutation, and re-emitting would loop back through the same persistence
  // adapter that just produced the value.
  const hasHydratedViewsRef = React.useRef(false);
  React.useEffect(() => {
    if (hasHydratedViewsRef.current || isViewsControlled || !hydrateViews) {
      return;
    }
    hasHydratedViewsRef.current = true;
    const hydrated = hydrateViews();
    if (hydrated == null) {
      return;
    }
    setUncontrolledViews(hydrated);
  }, [isViewsControlled, hydrateViews]);

  const commitViews = React.useCallback(
    (nextViews: DataStudioView[]) => {
      if (!isViewsControlled) {
        setUncontrolledViews(nextViews);
      }
      onViewsChange?.(nextViews);
    },
    [isViewsControlled, onViewsChange],
  );

  const addView = React.useCallback<DataStudioStateApi<R>['addView']>(
    (input) => {
      const datasetId = input?.datasetId ?? activeDatasetId;
      const nextDataset = getDatasetById(datasets, datasetId);
      if (!nextDataset) {
        return null;
      }
      const kind: DataStudioViewKind = input?.kind ?? 'grid';
      const label =
        input?.label ?? (kind === 'chart' ? getDefaultChartLabel(views) : getDefaultViewLabel(views));
      const newView: DataStudioView = {
        id: createViewId(),
        label,
        datasetId: nextDataset.id,
        ...(kind === 'chart' ? { kind } : {}),
        ...(input?.initialState && kind !== 'chart' ? { initialState: input.initialState } : {}),
        ...(kind === 'chart' && input?.chartConfig ? { chartConfig: input.chartConfig } : {}),
      };
      const nextViews = [...views, newView];
      commitViews(nextViews);
      if (!isActiveViewControlled) {
        setUncontrolledActiveViewId(newView.id);
      }
      if (!isDatasetControlled) {
        setUncontrolledDatasetId(nextDataset.id);
      }
      onActiveViewChange?.(newView.id, newView);
      onActiveDatasetChange?.(nextDataset.id, nextDataset);
      return newView;
    },
    [
      activeDatasetId,
      datasets,
      views,
      commitViews,
      isActiveViewControlled,
      isDatasetControlled,
      onActiveViewChange,
      onActiveDatasetChange,
    ],
  );

  const updateView = React.useCallback<DataStudioStateApi<R>['updateView']>(
    (viewId, patch) => {
      const index = views.findIndex((view) => view.id === viewId);
      if (index === -1) {
        return;
      }
      const current = views[index];
      const nextDatasetId = patch.datasetId ?? current.datasetId;
      const hasDatasetChange = patch.datasetId !== undefined && patch.datasetId !== current.datasetId;
      const hasChartConfigChange = patch.chartConfig !== undefined;
      const hasInitialStateChange = patch.initialState !== undefined;
      if (!hasDatasetChange && !hasChartConfigChange && !hasInitialStateChange) {
        return;
      }
      // Only allow chartConfig on chart views; silently drop otherwise.
      const nextChartConfig =
        hasChartConfigChange && current.kind === 'chart' ? patch.chartConfig : current.chartConfig;
      // Only allow initialState on grid views; silently drop otherwise.
      const nextInitialState =
        hasInitialStateChange && current.kind !== 'chart'
          ? patch.initialState
          : current.initialState;
      const nextView: DataStudioView = {
        ...current,
        datasetId: nextDatasetId,
        ...(nextChartConfig === undefined
          ? { chartConfig: undefined }
          : { chartConfig: nextChartConfig }),
        ...(nextInitialState === undefined
          ? { initialState: undefined }
          : { initialState: nextInitialState }),
      };
      const nextViews = views.slice();
      nextViews[index] = nextView;
      commitViews(nextViews);
      if (hasDatasetChange) {
        const nextDataset = getDatasetById(datasets, nextDatasetId);
        if (nextDataset) {
          if (!isDatasetControlled && activeViewId === viewId) {
            setUncontrolledDatasetId(nextDataset.id);
          }
          if (activeViewId === viewId) {
            onActiveDatasetChange?.(nextDataset.id, nextDataset);
          }
        }
      }
    },
    [
      views,
      datasets,
      commitViews,
      activeViewId,
      isDatasetControlled,
      onActiveDatasetChange,
    ],
  );

  const renameView = React.useCallback(
    (viewId: string, label: string) => {
      let didChange = false;
      const nextViews = views.map((view) => {
        if (view.id !== viewId || view.label === label) {
          return view;
        }
        didChange = true;
        return { ...view, label };
      });
      if (!didChange) {
        return;
      }
      commitViews(nextViews);
    },
    [views, commitViews],
  );

  const duplicateView = React.useCallback<DataStudioStateApi<R>['duplicateView']>(
    (viewId) => {
      const index = views.findIndex((view) => view.id === viewId);
      if (index === -1) {
        return null;
      }
      const source = views[index];
      const copy: DataStudioView = {
        ...source,
        id: createViewId(),
        label: `${source.label} (copy)`,
      };
      const nextViews = [...views.slice(0, index + 1), copy, ...views.slice(index + 1)];
      commitViews(nextViews);
      if (!isActiveViewControlled) {
        setUncontrolledActiveViewId(copy.id);
      }
      onActiveViewChange?.(copy.id, copy);
      return copy;
    },
    [views, commitViews, isActiveViewControlled, onActiveViewChange],
  );

  const deleteView = React.useCallback(
    (viewId: string) => {
      const index = views.findIndex((view) => view.id === viewId);
      if (index === -1) {
        return;
      }
      const nextViews = views.filter((view) => view.id !== viewId);
      commitViews(nextViews);
      if (activeViewId === viewId) {
        if (!isActiveViewControlled) {
          setUncontrolledActiveViewId(null);
        }
        onActiveViewChange?.(null, null);
      }
    },
    [views, activeViewId, commitViews, isActiveViewControlled, onActiveViewChange],
  );

  const moveView = React.useCallback(
    (viewId: string, delta: number) => {
      const index = views.findIndex((view) => view.id === viewId);
      if (index === -1) {
        return;
      }
      const targetIndex = index + delta;
      if (targetIndex < 0 || targetIndex >= views.length) {
        return;
      }
      const nextViews = views.slice();
      const [moved] = nextViews.splice(index, 1);
      nextViews.splice(targetIndex, 0, moved);
      commitViews(nextViews);
    },
    [views, commitViews],
  );

  const invalidateDataset = React.useCallback(
    (datasetId: string) => {
      sessionCache?.invalidateDataset(datasetId);
    },
    [sessionCache],
  );

  const invalidateAll = React.useCallback(() => {
    sessionCache?.invalidateAll();
  }, [sessionCache]);

  return {
    activeDatasetId,
    activeViewId,
    activeDataset,
    activeView,
    views,
    selectDataset,
    selectView,
    addView,
    updateView,
    renameView,
    duplicateView,
    deleteView,
    moveView,
    invalidateDataset,
    invalidateAll,
  };
}
