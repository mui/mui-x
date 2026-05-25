'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { DataGrid, useGridApiRef, type GridValidRowModel } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useDataStudioUtilityClasses } from './dataStudioClasses';
import { DataStudioToolbar } from '../DataStudioToolbar';
import { DataStudioMenuBar } from '../DataStudioMenuBar';
import { DataStudioTabBar } from './DataStudioTabBar';
import { DataStudioSidebarViewItem } from './DataStudioSidebarViewItem';
import { DataStudioPremiumChartView } from './DataStudioPremiumChartView';
import { DataStudioUpgradeChartView } from './DataStudioUpgradeChartView';
import { useDataStudioState } from './useDataStudioState';
import { useDataStudioRowEditing } from './useDataStudioRowEditing';
import { StudioCopilotPanel } from '../copilot';
import { DataStudioCopilotShell, DefaultCopilotTrigger } from './DataStudioCopilotInternals';
import { createDataStudioSessionCache } from './sessionCache';
import {
  createLocalStorageViewsPersistenceAdapter,
  type DataStudioViewsPersistenceAdapter,
} from './viewsPersistence';
import type { DataStudioRoutingState } from './routing';
import type {
  DataStudioChartViewComponent,
  DataStudioDataGridComponent,
  DataStudioDataGridProps,
  DataStudioDataset,
  DataStudioLayout,
  DataStudioMenuBarComponent,
  DataStudioPlan,
  DataStudioProps,
  DataStudioToolbarComponent,
  DataStudioView,
} from './DataStudio.types';

const EMPTY_ROUTING_STATE: DataStudioRoutingState = {
  activeDatasetId: null,
  activeViewId: null,
};

// Lazy singleton so multiple `<DataStudio>` mounts using the default
// persistence share one localStorage adapter (and so the default factory only
// runs once per page).
let defaultViewsPersistence: DataStudioViewsPersistenceAdapter | null = null;
function getDefaultViewsPersistence(): DataStudioViewsPersistenceAdapter {
  if (defaultViewsPersistence == null) {
    defaultViewsPersistence = createLocalStorageViewsPersistenceAdapter();
  }
  return defaultViewsPersistence;
}

function getDefaultDataGridForPlan(plan: DataStudioPlan): DataStudioDataGridComponent {
  if (plan === 'premium') {
    return DataGridPremium as DataStudioDataGridComponent;
  }
  if (plan === 'pro') {
    return DataGridPro as DataStudioDataGridComponent;
  }
  return DataGrid as DataStudioDataGridComponent;
}

function getDefaultChartViewForPlan(plan: DataStudioPlan): DataStudioChartViewComponent {
  return plan === 'premium' ? DataStudioPremiumChartView : DataStudioUpgradeChartView;
}

const useThemeProps = createUseThemeProps('MuiDataStudio');
const DATA_SOURCES_ITEM_ID = 'data-sources';
const VIEWS_ITEM_ID = 'views';
const EMPTY_DATA_SOURCES_ITEM_ID = 'data-sources-empty';
const EMPTY_VIEWS_ITEM_ID = 'views-empty';
const DATA_SOURCE_ITEM_PREFIX = 'data-source:';
const VIEW_ITEM_PREFIX = 'view:';
const LOADING_DATA_SOURCE_ITEM_PREFIX = 'data-source-loading:';
const DEFAULT_EXPANDED_ITEMS = [DATA_SOURCES_ITEM_ID, VIEWS_ITEM_ID];
const DATA_SOURCE_LOADING_ITEM_WIDTHS = ['72%', '58%', '66%'];
const DATA_STUDIO_PIVOT_FIELD_SEPARATOR = '>->';

const DATA_STUDIO_SERVER_AGGREGATION_FUNCTIONS = {
  sum: {},
  avg: {},
  min: {},
  max: {},
  size: {},
  sizeTrue: {},
  sizeFalse: {},
};

function getDataStudioPivotingColDef(originalColumnField: string, columnGroupPath: string[]) {
  return {
    field: columnGroupPath.concat(originalColumnField).join(DATA_STUDIO_PIVOT_FIELD_SEPARATOR),
  };
}

const DATA_STUDIO_DEFAULT_DATA_GRID_PROPS = {
  aggregationFunctions: DATA_STUDIO_SERVER_AGGREGATION_FUNCTIONS,
  // Spreadsheet-style selection: checkbox column for rows, cell range selection,
  // column-header click selects a column. Clicking a cell selects only that cell,
  // not the whole row — checkboxes are the explicit row-selection affordance.
  checkboxSelection: true,
  cellSelection: true,
  disableRowSelectionOnClick: true,
  disableVirtualization: false,
  hideFooter: true,
  disableColumnFilter: false,
  disableColumnMenu: false,
  disableColumnSelector: false,
  disableDensitySelector: false,
  disableColumnSorting: false,
  // `lazyLoading` is intentionally disabled: when on, DataGridPremium turns off the
  // DataSource row grouping/aggregation/pivoting strategy (see useGridDataSourcePremium).
  lazyLoading: false,
  // `pagination: false` hides the user-visible pagination footer. Note that the
  // Premium data source still chunks getRows requests internally — the cached
  // page size (default 100) is what `state.pagination.paginationModel.pageSize`
  // reflects regardless of this prop.
  pagination: false,
  pivotingColDef: getDataStudioPivotingColDef,
  // Data Studio owns its own toolbar (`DataStudioToolbar`); hide the grid's
  // built-in toolbar so the two don't double up.
  showToolbar: false,
} satisfies DataStudioDataGridProps;

const DataStudioRoot = styled('div', {
  name: 'MuiDataStudio',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
  shouldForwardProp: (prop) => prop !== 'ownerLayout',
})<{ ownerLayout: DataStudioLayout }>(({ theme, ownerLayout }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: ownerLayout === 'tabs' ? 'column' : 'row',
  width: '100%',
  height: '100%',
  minHeight: 0,
  overflow: 'hidden',
  color: (theme.vars || theme).palette.text.primary,
  backgroundColor: (theme.vars || theme).palette.background.default,
  '*, *::before, *::after': {
    boxSizing: 'inherit',
  },
}));

const DataStudioSidebar = styled('aside', {
  name: 'MuiDataStudio',
  slot: 'Sidebar',
  overridesResolver: (_, styles) => styles.sidebar,
})(({ theme }) => ({
  width: 280,
  minWidth: 240,
  maxWidth: 360,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  borderRight: `1px solid ${(theme.vars || theme).palette.divider}`,
  backgroundColor: (theme.vars || theme).palette.background.paper,
}));

const DataStudioTree = styled(SimpleTreeView, {
  name: 'MuiDataStudio',
  slot: 'Tree',
  overridesResolver: (_, styles) => styles.tree,
})(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: theme.spacing(1),
  '& .MuiTreeItem-content': {
    borderRadius: theme.shape.borderRadius,
  },
  '& .MuiTreeItem-label': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const DataStudioMain = styled('div', {
  name: 'MuiDataStudio',
  slot: 'Main',
  overridesResolver: (_, styles) => styles.main,
})({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  minWidth: 0,
  flex: 1,
});

const DataStudioToolbarArea = styled('div', {
  name: 'MuiDataStudio',
  slot: 'ToolbarArea',
  overridesResolver: (_, styles) => styles.toolbarArea,
})({
  flex: '0 0 auto',
  display: 'flex',
  alignItems: 'center',
  minWidth: 0,
});

const DataStudioToolbarSlotWrap = styled('div')({
  flex: 1,
  minWidth: 0,
});

const DataStudioCopilotTriggerSlot = styled('div')(({ theme }) => ({
  flex: '0 0 auto',
  paddingRight: theme.spacing(1),
}));

const DataStudioGrid = styled('div', {
  name: 'MuiDataStudio',
  slot: 'Grid',
  overridesResolver: (_, styles) => styles.grid,
})({
  minHeight: 0,
  minWidth: 0,
  flex: 1,
  display: 'flex',
});

const DataStudioViewsAction = styled('div', {
  name: 'MuiDataStudio',
  slot: 'ViewsAction',
  overridesResolver: (_, styles) => styles.viewsAction,
})(({ theme }) => ({
  padding: theme.spacing(1),
  borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const DataStudioEmpty = styled('div', {
  name: 'MuiDataStudio',
  slot: 'Empty',
  overridesResolver: (_, styles) => styles.empty,
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 160,
  flex: 1,
  color: (theme.vars || theme).palette.text.secondary,
  ...theme.typography.body2,
}));

const DataStudioDataSourceSkeletonLabel = styled('span', {
  name: 'MuiDataStudio',
  slot: 'DataSourceSkeletonLabel',
})({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: 24,
});

function getDataSourceItemId(datasetId: string) {
  return `${DATA_SOURCE_ITEM_PREFIX}${datasetId}`;
}

function getLoadingDataSourceItemId(index: number) {
  return `${LOADING_DATA_SOURCE_ITEM_PREFIX}${index}`;
}

function getDatasetIdFromTreeItemId(itemId: string | null) {
  if (itemId?.startsWith(DATA_SOURCE_ITEM_PREFIX)) {
    return itemId.slice(DATA_SOURCE_ITEM_PREFIX.length);
  }

  return null;
}

function getViewItemId(viewId: string) {
  return `${VIEW_ITEM_PREFIX}${viewId}`;
}

function getViewIdFromTreeItemId(itemId: string | null) {
  if (itemId?.startsWith(VIEW_ITEM_PREFIX)) {
    return itemId.slice(VIEW_ITEM_PREFIX.length);
  }

  return null;
}

type DataStudioComponent = (<R extends GridValidRowModel = any>(
  props: DataStudioProps<R> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const DataStudio = React.forwardRef(function DataStudio<R extends GridValidRowModel = any>(
  inProps: DataStudioProps<R>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiDataStudio' });

  const {
    activeDatasetId: activeDatasetIdProp,
    activeViewId: activeViewIdProp,
    cacheOptions,
    cacheStrategy = 'shared',
    className,
    classes: classesProp,
    copilotChatAdapter,
    copilotPlugins,
    copilotFeatures,
    datasets,
    defaultViews,
    initialActiveViewId,
    initialDatasetId,
    layout = 'sidebar',
    loading = false,
    plan = 'community',
    onActiveDatasetChange,
    onActiveViewChange,
    onViewsChange,
    routing,
    viewsPersistence,
    slotProps,
    slots,
    sx,
    views: viewsProp,
    ...other
  } = props;

  const isRoutingEnabled = routing != null;

  const classes = useDataStudioUtilityClasses(classesProp);
  const DataGridSlot = (slots?.dataGrid ??
    getDefaultDataGridForPlan(plan)) as DataStudioDataGridComponent;
  const toolbarSlot = slots?.toolbar;
  const ToolbarSlot: DataStudioToolbarComponent | null =
    toolbarSlot === null
      ? null
      : ((toolbarSlot ?? DataStudioToolbar) as DataStudioToolbarComponent);
  const menuBarSlot = slots?.menuBar;
  const MenuBarSlot: DataStudioMenuBarComponent | null =
    menuBarSlot === null
      ? null
      : ((menuBarSlot ?? DataStudioMenuBar) as DataStudioMenuBarComponent);
  const ChartViewSlot: DataStudioChartViewComponent = (slots?.chartView ??
    getDefaultChartViewForPlan(plan)) as DataStudioChartViewComponent;
  const internalApiRef = useGridApiRef();
  // Empty apiRef handed to the toolbar + menu bar while a chart view is
  // active. The real `effectiveApiRef` points at a now-unmounted main grid,
  // and the toolbar/menu bar selectors would either subscribe to a disposed
  // store or crash on `apiRef.current.state` reads. Using a fresh empty ref
  // lets both surfaces render in their natural "no api bound yet" state —
  // the toolbar shows the disabled search input + the menu bar shows the
  // greyed-out File/Edit/View strip — so the layout stays consistent across
  // grid ↔ chart switches without operating on a stale grid.
  const chartViewApiRef = React.useRef(null);

  // Stable cache instance for this DataStudio mount. Options are captured on first render;
  // changing `cacheOptions` later won't recreate the cache (intentional — matches how
  // `GridDataSourceCacheDefault` is treated by the grid). Use a controlled `dataset.dataSourceCache`
  // if you need to swap caches at runtime.
  const [sessionCache] = React.useState(() =>
    cacheStrategy === 'shared' ? createDataStudioSessionCache(cacheOptions) : null,
  );

  // Mirror of the routing source via `useSyncExternalStore`. This handles three
  // tricky cases the previous useState+subscribe approach couldn't:
  //   - Initial query string is captured even when the framework's router only
  //     populates `router.query` after a `router.isReady` microtask (Next.js
  //     Pages Router); `getSnapshot` is re-evaluated on every render.
  //   - Browser back/forward goes through the adapter's `subscribe` (popstate),
  //     and React re-renders with the new snapshot — no extra state machine.
  //   - The adapter is allowed to be reference-stable across renders (we cache
  //     the snapshot in the adapter, so getSnapshot returns the same reference
  //     until the underlying URL changes — keeping React's bail-out happy).
  // User-initiated navigation (tab clicks inside the studio) is tracked via
  // `userNavRef` and flushed by the write effect below, gating writes so a
  // subscribe-driven sync never pushes a stale value (that would loop
  // back/forward, e.g. A→B→C→back ⇒ B↔C ping-pong).
  const subscribeFn = React.useCallback(
    (onChange: () => void) => (isRoutingEnabled ? routing!.subscribe(onChange) : () => {}),
    [isRoutingEnabled, routing],
  );
  const getSnapshot = React.useCallback(
    () => (isRoutingEnabled ? routing!.read() : EMPTY_ROUTING_STATE),
    [isRoutingEnabled, routing],
  );
  const getServerSnapshot = React.useCallback(() => EMPTY_ROUTING_STATE, []);
  const navState = React.useSyncExternalStore(subscribeFn, getSnapshot, getServerSnapshot);

  // Microtask-coalesced URL writes. When a user action (e.g. `selectDataset`)
  // synchronously fires multiple callbacks (`onActiveDatasetChange` followed by
  // `onActiveViewChange(null, null)`), we collect the final state into the ref
  // and emit a single `routing.write(..., 'push')` per logical navigation.
  const pendingWriteRef = React.useRef<DataStudioRoutingState | null>(null);
  const flushScheduledRef = React.useRef(false);

  const flushPendingWrite = React.useCallback(() => {
    flushScheduledRef.current = false;
    const target = pendingWriteRef.current;
    pendingWriteRef.current = null;
    if (target == null || !isRoutingEnabled) {
      return;
    }
    const urlState = routing!.read();
    if (
      urlState.activeDatasetId === target.activeDatasetId &&
      urlState.activeViewId === target.activeViewId
    ) {
      return;
    }
    routing!.write(target, 'push');
  }, [isRoutingEnabled, routing]);

  const scheduleUrlWrite = React.useCallback(
    (target: DataStudioRoutingState) => {
      pendingWriteRef.current = target;
      if (flushScheduledRef.current) {
        return;
      }
      flushScheduledRef.current = true;
      queueMicrotask(flushPendingWrite);
    },
    [flushPendingWrite],
  );

  // Resolution priority: explicit controlled prop > routing-driven value > defaults.
  // Returning a defined value here makes `useDataStudioState` treat the axis as
  // controlled, which prevents the hook's uncontrolled state from getting out
  // of sync with the URL after a back/forward.
  let resolvedActiveDatasetId: string | undefined;
  if (activeDatasetIdProp !== undefined) {
    resolvedActiveDatasetId = activeDatasetIdProp;
  } else if (isRoutingEnabled) {
    resolvedActiveDatasetId = navState.activeDatasetId ?? initialDatasetId ?? datasets[0]?.id;
  }

  let resolvedActiveViewId: string | null | undefined;
  if (activeViewIdProp !== undefined) {
    resolvedActiveViewId = activeViewIdProp;
  } else if (isRoutingEnabled) {
    resolvedActiveViewId = navState.activeViewId;
  }

  const handleActiveDatasetChange = React.useCallback(
    (datasetId: string, dataset: DataStudioDataset<R>) => {
      if (isRoutingEnabled) {
        const base = pendingWriteRef.current ?? routing!.read();
        scheduleUrlWrite({ activeDatasetId: datasetId, activeViewId: base.activeViewId });
      }
      onActiveDatasetChange?.(datasetId, dataset);
    },
    [isRoutingEnabled, routing, scheduleUrlWrite, onActiveDatasetChange],
  );

  const handleActiveViewChange = React.useCallback(
    (viewId: string | null, view: DataStudioView | null) => {
      if (isRoutingEnabled) {
        const base = pendingWriteRef.current ?? routing!.read();
        scheduleUrlWrite({
          activeDatasetId: view?.datasetId ?? base.activeDatasetId,
          activeViewId: viewId,
        });
      }
      onActiveViewChange?.(viewId, view);
    },
    [isRoutingEnabled, routing, scheduleUrlWrite, onActiveViewChange],
  );

  // Resolve the persistence adapter. `undefined` ⇒ default localStorage; `null`
  // ⇒ opt-out. Persistence is only effective when `views` is uncontrolled —
  // a controlled consumer owns the source of truth and we stay out of the way.
  const resolvedViewsPersistence =
    viewsPersistence === undefined ? getDefaultViewsPersistence() : viewsPersistence;
  const isPersistenceEnabled = resolvedViewsPersistence != null && viewsProp === undefined;

  const handleViewsChange = React.useCallback(
    (nextViews: DataStudioView[]) => {
      if (isPersistenceEnabled) {
        resolvedViewsPersistence!.write(nextViews);
      }
      onViewsChange?.(nextViews);
    },
    [isPersistenceEnabled, resolvedViewsPersistence, onViewsChange],
  );

  const hydrateViews = React.useCallback(() => {
    if (!isPersistenceEnabled) {
      return null;
    }
    return resolvedViewsPersistence!.read();
  }, [isPersistenceEnabled, resolvedViewsPersistence]);

  const state = useDataStudioState<R>({
    datasets,
    activeDatasetId: resolvedActiveDatasetId,
    initialDatasetId,
    onActiveDatasetChange: handleActiveDatasetChange,
    views: viewsProp,
    defaultViews,
    onViewsChange: handleViewsChange,
    activeViewId: resolvedActiveViewId,
    initialActiveViewId,
    onActiveViewChange: handleActiveViewChange,
    sessionCache,
    hydrateViews,
  });

  const { activeDataset, activeView, activeViewId: stateActiveViewId } = state;

  // Clamp: if the URL asked for a dataset/view that doesn't exist, the hook
  // falls back to a different one. Silently `replace` the URL so it reflects
  // what the user is actually looking at, without polluting history.
  // Guarded against an empty `datasets` array so we don't clobber a valid id
  // (e.g. `?dataset=customers`) before the schema has finished loading; the
  // effect re-runs when `activeDataset` changes to a populated value.
  React.useEffect(() => {
    if (!isRoutingEnabled || datasets.length === 0) {
      return;
    }
    const urlState = routing!.read();
    const resolvedDataset = activeDataset?.id ?? null;
    const resolvedView = stateActiveViewId;
    const datasetWasClamped =
      urlState.activeDatasetId != null && urlState.activeDatasetId !== resolvedDataset;
    const viewWasClamped = urlState.activeViewId != null && urlState.activeViewId !== resolvedView;
    if (!datasetWasClamped && !viewWasClamped) {
      return;
    }
    routing!.write({ activeDatasetId: resolvedDataset, activeViewId: resolvedView }, 'replace');
  }, [isRoutingEnabled, routing, activeDataset, stateActiveViewId, datasets.length]);

  // Highlight the active view's tree item when a view is selected (matches the
  // tab bar's notion of "the view is the active tab"). Fall back to the dataset
  // when no view is active.
  let selectedTreeItemId: string | null = null;
  if (activeView) {
    selectedTreeItemId = getViewItemId(activeView.id);
  } else if (activeDataset) {
    selectedTreeItemId = getDataSourceItemId(activeDataset.id);
  }
  const showDataSourcesLoading = loading && datasets.length === 0;

  const callerApiRef = activeDataset?.slotProps?.dataGrid?.apiRef ?? slotProps?.dataGrid?.apiRef;
  const effectiveApiRef = callerApiRef ?? internalApiRef;

  // Built-in row editing: when the dataset's `dataSource` exposes
  // `createRow`/`updateRow`/`deleteRow`, the hook appends the actions column
  // and produces the `onAddRow` handler the toolbar wires up. Datasets without
  // those methods get their original columns unchanged.
  const rowEditing = useDataStudioRowEditing<R>({
    dataset: activeDataset,
    apiRef: effectiveApiRef as any,
    // The dataset's `onDataSourceError` callback is typed against the grid's
    // narrow error types; row-editing errors are plain `Error`s. Cast through
    // `unknown` so the dataset handler gets the broader feed too.
    onError: activeDataset?.onDataSourceError as ((error: unknown) => void) | undefined,
  });

  let dataSourceItems: React.ReactNode;

  if (showDataSourcesLoading) {
    dataSourceItems = DATA_SOURCE_LOADING_ITEM_WIDTHS.map((width, index) => (
      <TreeItem
        key={getLoadingDataSourceItemId(index)}
        itemId={getLoadingDataSourceItemId(index)}
        label={
          <DataStudioDataSourceSkeletonLabel aria-hidden="true">
            <Skeleton
              data-testid="data-source-skeleton"
              variant="text"
              animation="wave"
              width={width}
            />
          </DataStudioDataSourceSkeletonLabel>
        }
        disabled
      />
    ));
  } else if (datasets.length === 0) {
    dataSourceItems = (
      <TreeItem itemId={EMPTY_DATA_SOURCES_ITEM_ID} label="No data sources" disabled />
    );
  } else {
    dataSourceItems = datasets.map((dataset) => (
      <TreeItem key={dataset.id} itemId={getDataSourceItemId(dataset.id)} label={dataset.label} />
    ));
  }

  const viewItems =
    state.views.length === 0
      ? [
          <TreeItem
            key={EMPTY_VIEWS_ITEM_ID}
            itemId={EMPTY_VIEWS_ITEM_ID}
            label="No views yet"
            disabled
          />,
        ]
      : state.views.map((view, index) => (
          <TreeItem
            key={view.id}
            itemId={getViewItemId(view.id)}
            label={
              <DataStudioSidebarViewItem
                view={view}
                index={index}
                total={state.views.length}
                state={state}
              />
            }
          />
        ));

  const handleAddView = React.useCallback(() => {
    state.addView();
  }, [state]);

  const handleTreeSelectionChange = React.useCallback(
    (_event: React.SyntheticEvent | null, itemIds: string | string[] | null) => {
      const itemId = Array.isArray(itemIds) ? (itemIds.at(0) ?? null) : itemIds;
      const datasetId = getDatasetIdFromTreeItemId(itemId);
      if (datasetId !== null) {
        state.selectDataset(datasetId);
        return;
      }
      const viewId = getViewIdFromTreeItemId(itemId);
      if (viewId !== null) {
        state.selectView(viewId);
      }
    },
    [state],
  );

  const datasetSlotProps = activeDataset?.slotProps?.dataGrid;
  const viewInitialState = activeView?.initialState;
  const mergedInitialState = React.useMemo(() => {
    if (!viewInitialState) {
      return datasetSlotProps?.initialState ?? slotProps?.dataGrid?.initialState;
    }
    return {
      ...(slotProps?.dataGrid?.initialState ?? {}),
      ...(datasetSlotProps?.initialState ?? {}),
      ...viewInitialState,
    };
  }, [slotProps?.dataGrid?.initialState, datasetSlotProps?.initialState, viewInitialState]);

  const activeDatasetCache = activeDataset?.dataSourceCache;
  const activeDatasetId = activeDataset?.id;
  // Per-dataset cache resolution. Order: explicit dataset override → strategy default.
  // `undefined` means "let the grid build its own default cache" (the legacy behavior).
  const resolvedDataSourceCache = React.useMemo(() => {
    if (activeDatasetCache !== undefined) {
      return activeDatasetCache;
    }
    if (cacheStrategy === 'none') {
      return null;
    }
    if (cacheStrategy === 'shared' && sessionCache && activeDatasetId) {
      return sessionCache.forDataset(activeDatasetId);
    }
    return undefined;
  }, [activeDatasetCache, activeDatasetId, cacheStrategy, sessionCache]);

  const isChartView = activeView?.kind === 'chart';

  const handleChartDatasetChange = React.useCallback(
    (datasetId: string) => {
      if (!activeView) {
        return;
      }
      state.updateView(activeView.id, { datasetId });
    },
    [state, activeView],
  );

  const chartContent =
    isChartView && activeView ? (
      <ChartViewSlot
        dataset={activeDataset}
        datasets={datasets}
        view={activeView}
        onChangeDataset={handleChartDatasetChange}
        dataSourceCache={resolvedDataSourceCache}
        {...slotProps?.chartView}
      />
    ) : null;

  const gridContent =
    activeDataset === null ? (
      <DataStudioEmpty className={classes.empty}>No data source selected</DataStudioEmpty>
    ) : (
      <DataGridSlot
        key={`${activeDataset.id}::${activeView?.id ?? ''}`}
        {...DATA_STUDIO_DEFAULT_DATA_GRID_PROPS}
        {...slotProps?.dataGrid}
        {...datasetSlotProps}
        initialState={mergedInitialState}
        columns={rowEditing.columns}
        rows={activeDataset.rows ?? []}
        rowIdField={activeDataset.rowIdField}
        getRowId={activeDataset.getRowId}
        dataSource={activeDataset.dataSource}
        dataSourceCache={resolvedDataSourceCache}
        dataSourceRevalidateMs={activeDataset.dataSourceRevalidateMs}
        onDataSourceError={activeDataset.onDataSourceError}
        apiRef={effectiveApiRef}
        {...(rowEditing.rowModesModel !== null && {
          editMode: 'row',
          rowModesModel: rowEditing.rowModesModel,
          onRowModesModelChange: rowEditing.onRowModesModelChange,
        })}
      />
    );

  const datasetTitle = typeof activeDataset?.label === 'string' ? activeDataset.label : undefined;

  const mainPane = (
    <DataStudioMain className={classes.main}>
      {MenuBarSlot ? (
        <MenuBarSlot
          // Remount on chart ↔ grid switch so the menu bar's internal
          // `apiBound` state re-evaluates against the active apiRef. Without
          // this, switching from grid (apiRef bound to main grid) to chart
          // (apiRef intentionally empty) leaves the active menu strip mounted
          // with a null `apiRef.current`, which crashes the grid selectors.
          key={isChartView ? '__chart_view__' : '__grid_view__'}
          apiRef={isChartView ? (chartViewApiRef as any) : effectiveApiRef}
          title={datasetTitle}
          {...slotProps?.menuBar}
        />
      ) : null}
      {ToolbarSlot ? (
        <DataStudioToolbarArea className={classes.toolbarArea}>
          <DataStudioToolbarSlotWrap>
            {/*
          Remount the toolbar on dataset switch so `useGridSelector`
          subscriptions re-bind to the freshly-mounted grid's store and any
          per-mount local state (search draft, menu anchors) resets. Without
          this key, the toolbar carries stale column metadata across datasets
          and the user's quick-filter draft leaks between datasets.
          */}
            <ToolbarSlot
              key={`${activeDataset?.id ?? '__no-dataset__'}::${isChartView ? 'chart' : 'grid'}`}
              apiRef={isChartView ? (chartViewApiRef as any) : effectiveApiRef}
              activeView={activeView}
              baselineInitialState={mergedInitialState}
              onAddRow={activeDataset?.onAddRow ?? rowEditing.onAddRow ?? undefined}
              onAddChart={() =>
                state.addView({
                  kind: 'chart',
                  datasetId: activeDataset?.id,
                })
              }
              onSaveCurrentView={(input) =>
                state.addView({
                  datasetId: activeDataset?.id,
                  label: input.label,
                  initialState: input.initialState,
                })
              }
              {...slotProps?.toolbar}
            />
          </DataStudioToolbarSlotWrap>
          <DataStudioCopilotTriggerSlot>
            {React.createElement(slots?.copilotTrigger ?? DefaultCopilotTrigger)}
          </DataStudioCopilotTriggerSlot>
        </DataStudioToolbarArea>
      ) : null}
      <DataStudioGrid className={classes.grid}>
        {isChartView ? chartContent : gridContent}
      </DataStudioGrid>
    </DataStudioMain>
  );

  const CopilotPanelComponent = slots?.copilotPanel ?? StudioCopilotPanel;

  return (
    <DataStudioRoot
      ref={ref}
      ownerLayout={layout}
      className={clsx(classes.root, className)}
      sx={sx}
      {...other}
    >
      <DataStudioCopilotShell
        inner={copilotChatAdapter}
        stateApi={state}
        datasets={datasets}
        features={copilotFeatures}
        plugins={copilotPlugins}
        Panel={CopilotPanelComponent}
      >
        {layout === 'sidebar' ? (
          <React.Fragment>
            <DataStudioSidebar className={classes.sidebar}>
              <DataStudioTree
                className={classes.tree}
                defaultExpandedItems={DEFAULT_EXPANDED_ITEMS}
                selectedItems={selectedTreeItemId}
                onSelectedItemsChange={handleTreeSelectionChange}
              >
                <TreeItem itemId={DATA_SOURCES_ITEM_ID} label="Data Sources">
                  {dataSourceItems}
                </TreeItem>
                <TreeItem itemId={VIEWS_ITEM_ID} label="Views">
                  {viewItems}
                </TreeItem>
              </DataStudioTree>
              <DataStudioViewsAction className={classes.viewsAction}>
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  onClick={handleAddView}
                  disabled={datasets.length === 0}
                >
                  Add new view
                </Button>
              </DataStudioViewsAction>
            </DataStudioSidebar>
            {mainPane}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {mainPane}
            <DataStudioTabBar classes={classes} datasets={datasets} state={state} />
          </React.Fragment>
        )}
      </DataStudioCopilotShell>
    </DataStudioRoot>
  );
}) as DataStudioComponent;

DataStudio.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The active dataset id.
   */
  activeDatasetId: PropTypes.string,
  /**
   * The active view id (controlled). Pass `null` to indicate a dataset tab is active.
   */
  activeViewId: PropTypes.string,
  /**
   * Options forwarded to the shared session cache when `cacheStrategy === 'shared'`.
   * Ignored for the other strategies.
   */
  cacheOptions: PropTypes.shape({
    getKey: PropTypes.func,
    maxEntries: PropTypes.number,
    ttl: PropTypes.number,
  }),
  /**
   * Strategy applied to the Data Source cache used by every dataset.
   * See `DataStudioCacheStrategy` for the available values.
   * A `dataset.dataSourceCache` set on an individual dataset always takes precedence.
   * @default 'shared'
   */
  cacheStrategy: PropTypes.oneOf(['none', 'per-dataset', 'shared']),
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * Backend chat adapter that powers the Copilot panel. When set, Data Studio
   * mounts a right-side drawer with a Copilot panel and a trigger button in
   * the toolbar. Wrap with `createStudioCopilotLocalStorageAdapter` to add
   * conversation persistence.
   */
  copilotChatAdapter: PropTypes.shape({
    addToolApprovalResponse: PropTypes.func,
    allowMultipleMessages: PropTypes.bool,
    listConversations: PropTypes.func,
    listMessages: PropTypes.func,
    loadMore: PropTypes.func,
    markRead: PropTypes.func,
    reconnectToStream: PropTypes.func,
    sendMessage: PropTypes.func.isRequired,
    setTyping: PropTypes.func,
    stop: PropTypes.func,
    subscribe: PropTypes.func,
  }),
  /**
   * Feature flags controlling which Copilot capabilities are exposed. Lets
   * consumers turn off mutation classes (e.g. disable view CRUD, disable
   * data query) without rebuilding the command pack.
   */
  copilotFeatures: PropTypes.shape({
    aggregation: PropTypes.bool,
    chartEditing: PropTypes.bool,
    chartsIntegration: PropTypes.bool,
    dataQuery: PropTypes.bool,
    datasetSwitching: PropTypes.bool,
    filter: PropTypes.bool,
    grouping: PropTypes.bool,
    mutations: PropTypes.bool,
    pivoting: PropTypes.bool,
    rowSelection: PropTypes.bool,
    sort: PropTypes.bool,
    viewCrud: PropTypes.bool,
    viewEditing: PropTypes.bool,
  }),
  /**
   * Copilot plugins (PDF, formula, custom). Forwarded to the executor so the
   * agent's tool calls can be claimed by client-side renderers.
   */
  copilotPlugins: PropTypes.arrayOf(
    PropTypes.shape({
      handleToolCall: PropTypes.func.isRequired,
      id: PropTypes.string.isRequired,
      toolNames: PropTypes.arrayOf(PropTypes.string).isRequired,
      toolSlots: PropTypes.object,
    }),
  ),
  /**
   * Datasets available in the studio.
   */
  datasets: PropTypes.arrayOf(
    PropTypes.shape({
      columns: PropTypes.arrayOf(PropTypes.object).isRequired,
      dataSource: PropTypes.shape({
        createRow: PropTypes.func,
        deleteRow: PropTypes.func,
        getAggregatedValue: PropTypes.func,
        getChildrenCount: PropTypes.func,
        getGroupKey: PropTypes.func,
        getRows: PropTypes.func.isRequired,
        updateRow: PropTypes.func,
      }),
      dataSourceCache: PropTypes.shape({
        clear: PropTypes.func.isRequired,
        get: PropTypes.func.isRequired,
        set: PropTypes.func.isRequired,
      }),
      dataSourceRevalidateMs: PropTypes.number,
      getRowId: PropTypes.func,
      id: PropTypes.string.isRequired,
      label: PropTypes.node,
      onAddRow: PropTypes.func,
      onDataSourceError: PropTypes.func,
      rowIdField: PropTypes.string,
      rows: PropTypes.arrayOf(PropTypes.object),
      slotProps: PropTypes.object,
    }),
  ).isRequired,
  /**
   * Initial views displayed alongside datasets (uncontrolled).
   * Ignored if `views` is provided.
   */
  defaultViews: PropTypes.arrayOf(
    PropTypes.shape({
      chartConfig: PropTypes.object,
      datasetId: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      initialState: PropTypes.object,
      kind: PropTypes.oneOf(['chart', 'grid']),
      label: PropTypes.node,
    }),
  ),
  /**
   * The initially active view id (uncontrolled).
   */
  initialActiveViewId: PropTypes.string,
  /**
   * The initially active dataset id.
   */
  initialDatasetId: PropTypes.string,
  /**
   * Navigator layout.
   * - `'sidebar'`: tree navigator on the left.
   * - `'tabs'`: spreadsheet-style tab bar at the bottom.
   * @default 'sidebar'
   */
  layout: PropTypes.oneOf(['sidebar', 'tabs']),
  /**
   * If `true`, the data sources tree shows a loading state.
   * @default false
   */
  loading: PropTypes.bool,
  /**
   * Callback fired when the active dataset changes.
   * @param {string} datasetId The selected dataset id.
   * @param {DataStudioDataset<R>} dataset The selected dataset definition.
   */
  onActiveDatasetChange: PropTypes.func,
  /**
   * Callback fired when the active view changes. `null` means a dataset tab became active.
   * @param {string | null} viewId The selected view id.
   * @param {DataStudioView | null} view The selected view definition.
   */
  onActiveViewChange: PropTypes.func,
  /**
   * Callback fired when the list of views changes (add, rename, duplicate, delete, reorder).
   * @param {DataStudioView[]} views The updated list of views.
   */
  onViewsChange: PropTypes.func,
  /**
   * MUI X plan to target. Selects the default Data Grid (community / Pro /
   * Premium) and whether the built-in chart workspace is active.
   *
   * Override the auto-resolved grid by passing `slots.dataGrid` explicitly;
   * the chart workspace can likewise be overridden via `slots.chartView`.
   * @default 'community'
   */
  plan: PropTypes.oneOf(['community', 'premium', 'pro']),
  /**
   * Routing adapter that mirrors the active dataset and view into an external
   * source (typically the URL query string). Pass
   * `createSearchParamsRoutingAdapter()` for a `window.history`-based default,
   * or implement the interface to integrate with Next.js / React Router / etc.
   *
   * Explicit `activeDatasetId` / `activeViewId` controlled props still win when set.
   */
  routing: PropTypes.shape({
    read: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired,
    write: PropTypes.func.isRequired,
  }),
  /**
   * Props forwarded to the component slots.
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   */
  slots: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * Views displayed alongside datasets (controlled).
   * Each view targets a dataset and may carry an `initialState` applied to the Data Grid.
   */
  views: PropTypes.arrayOf(
    PropTypes.shape({
      chartConfig: PropTypes.object,
      datasetId: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      initialState: PropTypes.object,
      kind: PropTypes.oneOf(['chart', 'grid']),
      label: PropTypes.node,
    }),
  ),
  /**
   * Persistence adapter for the list of views. Hydrated once on mount and
   * called whenever the views list mutates (add, rename, duplicate, delete,
   * move, updateView). Pass `null` to disable persistence.
   *
   * Defaults to `createLocalStorageViewsPersistenceAdapter()` (localStorage,
   * namespace `'default'`) so views are remembered across reloads
   * out-of-the-box. Pass a custom adapter to back persistence with a server,
   * IndexedDB, etc.
   *
   * Ignored when the `views` prop is provided (controlled mode — the consumer
   * owns the source of truth).
   * @default createLocalStorageViewsPersistenceAdapter()
   */
  viewsPersistence: PropTypes.shape({
    read: PropTypes.func.isRequired,
    write: PropTypes.func.isRequired,
  }),
} as any;

export { DataStudio };
