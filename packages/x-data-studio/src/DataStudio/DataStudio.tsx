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
import { DataStudioSidebarSheetItem } from './DataStudioSidebarSheetItem';
import { DataStudioDataSourceView } from './DataStudioDataSourceView';
import { DataStudioComposer } from './DataStudioComposer';
import { resolveDataStudioViewType, UnknownViewType } from '../viewRegistry';
import { getBuiltinSheetTemplates, getBuiltinViewTypes, resolveOverridable } from '../builtins';
import { useDataStudioState } from './useDataStudioState';
import { useDataStudioRowEditing } from './useDataStudioRowEditing';
import { StudioCopilotPanel } from '../copilot';
import { DataStudioCopilotShell, DefaultCopilotTrigger } from './DataStudioCopilotInternals';
import { createDataStudioSessionCache } from './sessionCache';
import {
  DATA_STUDIO_SERVER_AGGREGATION_FUNCTIONS,
  getDataStudioPivotingColDef,
} from './gridDefaults';
import {
  createLocalStorageSheetsPersistenceAdapter,
  type DataStudioSheetsPersistenceAdapter,
} from './sheetsPersistence';
import {
  createLocalStorageJointSourcesPersistenceAdapter,
  type DataStudioJointSourcesPersistenceAdapter,
} from './jointSourcesPersistence';
import { useDataStudioJointSources } from './useDataStudioJointSources';
import { DataStudioJoinBuilder } from './DataStudioJoinBuilder';
import { DataStudioSidebarJointSourceItem } from './DataStudioSidebarJointSourceItem';
import type { StudioCopilotJointSourcesApi } from '../copilot';
import type { DataStudioJoinDefinition } from '../models';
import type { DataStudioRoutingState } from './routing';
import type {
  DataStudioDataGridComponent,
  DataStudioDataGridProps,
  DataStudioDataSource,
  DataStudioLayout,
  DataStudioMenuBarComponent,
  DataStudioPlan,
  DataStudioProps,
  DataStudioToolbarComponent,
  DataStudioSheet,
  DataStudioJointSourceConfig,
} from './DataStudio.types';

const EMPTY_ROUTING_STATE: DataStudioRoutingState = {
  activeDataSourceId: null,
  activeSheetId: null,
};

// Lazy singleton so multiple `<DataStudio>` mounts using the default
// persistence share one localStorage adapter (and so the default factory only
// runs once per page).
let defaultSheetsPersistence: DataStudioSheetsPersistenceAdapter | null = null;
function getDefaultSheetsPersistence(): DataStudioSheetsPersistenceAdapter {
  if (defaultSheetsPersistence == null) {
    defaultSheetsPersistence = createLocalStorageSheetsPersistenceAdapter();
  }
  return defaultSheetsPersistence;
}

let defaultJointSourcesPersistence: DataStudioJointSourcesPersistenceAdapter | null = null;
function getDefaultJointSourcesPersistence(): DataStudioJointSourcesPersistenceAdapter {
  if (defaultJointSourcesPersistence == null) {
    defaultJointSourcesPersistence = createLocalStorageJointSourcesPersistenceAdapter();
  }
  return defaultJointSourcesPersistence;
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

const useThemeProps = createUseThemeProps('MuiDataStudio');
const DATA_SOURCES_ITEM_ID = 'data-sources';
const SHEETS_ITEM_ID = 'sheets';
const EMPTY_DATA_SOURCES_ITEM_ID = 'data-sources-empty';
const EMPTY_SHEETS_ITEM_ID = 'sheets-empty';
const DATA_SOURCE_ITEM_PREFIX = 'data-source:';
const SHEET_ITEM_PREFIX = 'sheet:';
const LOADING_DATA_SOURCE_ITEM_PREFIX = 'data-source-loading:';
const DEFAULT_EXPANDED_ITEMS = [DATA_SOURCES_ITEM_ID, SHEETS_ITEM_ID];
const DATA_SOURCE_LOADING_ITEM_WIDTHS = ['72%', '58%', '66%'];
// Marks the two top-level section headers ("Data Sources" / "Sheets") so their
// labels can be styled as eyebrows, distinct from their leaf rows.
const DATA_STUDIO_TREE_SECTION_CLASS = 'MuiDataStudio-treeSection';

const DATA_STUDIO_DEFAULT_DATA_GRID_PROPS = {
  aggregationFunctions: DATA_STUDIO_SERVER_AGGREGATION_FUNCTIONS,
  // Spreadsheet-style selection: checkbox column for rows, cell range selection,
  // column-header click selects a column. Clicking a cell selects only that cell,
  // not the whole row — checkboxes are the explicit row-selection affordance.
  checkboxSelection: true,
  cellSelection: true,
  disableRowSelectionOnClick: true,
  disableVirtualization: false,
  // Show the footer so the preview reports the full row count + page navigation —
  // the preview is the whole Data Source, not a capped sample.
  hideFooter: false,
  disableColumnFilter: false,
  disableColumnMenu: false,
  disableColumnSelector: false,
  disableDensitySelector: false,
  disableColumnSorting: false,
  // `lazyLoading` is intentionally disabled: when on, DataGridPremium turns off the
  // DataSource row grouping/aggregation/pivoting strategy (see useGridDataSourcePremium).
  lazyLoading: false,
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
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shortest,
    }),
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.action.hover,
    },
    '&.Mui-selected': {
      backgroundColor: theme.alpha((theme.vars || theme).palette.primary.main, 0.12),
      color: (theme.vars || theme).palette.primary.main,
      '&:hover': {
        backgroundColor: theme.alpha((theme.vars || theme).palette.primary.main, 0.16),
      },
    },
  },
  '& .MuiTreeItem-label': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    // Unify the tree leaf type with the sheet tab bar (0.8125rem).
    fontSize: '0.8125rem',
  },
  // Scope the two section headers ("Data Sources" / "Sheets") as eyebrows so
  // they outrank their leaf rows. Only the section header's own label (the
  // direct content) is targeted, not its children's labels.
  [`& .${DATA_STUDIO_TREE_SECTION_CLASS} > .MuiTreeItem-content .MuiTreeItem-label`]: {
    fontSize: '0.6875rem',
    fontWeight: theme.typography.fontWeightMedium,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: (theme.vars || theme).palette.text.secondary,
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

const DataStudioSheetsAction = styled('div', {
  name: 'MuiDataStudio',
  slot: 'SheetsAction',
  overridesResolver: (_, styles) => styles.sheetsAction,
})(({ theme }) => ({
  padding: theme.spacing(1),
  borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,
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

function getDataSourceItemId(dataSourceId: string) {
  return `${DATA_SOURCE_ITEM_PREFIX}${dataSourceId}`;
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

function getSheetItemId(sheetId: string) {
  return `${SHEET_ITEM_PREFIX}${sheetId}`;
}

function getSheetIdFromTreeItemId(itemId: string | null) {
  if (itemId?.startsWith(SHEET_ITEM_PREFIX)) {
    return itemId.slice(SHEET_ITEM_PREFIX.length);
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
    activeDataSourceId: activeDataSourceIdProp,
    activeSheetId: activeSheetIdProp,
    cacheOptions,
    cacheStrategy = 'shared',
    className,
    classes: classesProp,
    copilotChatAdapter,
    copilotPlugins,
    copilotFeatures,
    dataSources,
    defaultSheets,
    initialActiveSheetId,
    initialDataSourceId,
    layout = 'sidebar',
    loading = false,
    plan = 'community',
    onActiveDataSourceChange,
    onActiveSheetChange,
    onSheetsChange,
    routing,
    sheetsPersistence,
    jointSourcesPersistence,
    slotProps,
    slots,
    sx,
    sheets: sheetsProp,
    sheetTemplates,
    viewTypes,
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
  const internalApiRef = useGridApiRef();

  // Stable cache instance for this DataStudio mount. Options are captured on first render;
  // changing `cacheOptions` later won't recreate the cache (intentional — matches how
  // `GridDataSourceCacheDefault` is treated by the grid). Use a controlled `dataSource.cache`
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

  // Microtask-coalesced URL writes. When a user action (e.g. `selectDataSource`)
  // synchronously fires multiple callbacks (`onActiveDataSourceChange` followed by
  // `onActiveSheetChange(null, null)`), we collect the final state into the ref
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
      urlState.activeDataSourceId === target.activeDataSourceId &&
      urlState.activeSheetId === target.activeSheetId
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

  // User-authored joint sources (never defined in code). `undefined` ⇒ default
  // localStorage; `null` ⇒ opt-out. Built from the base `dataSources` and merged
  // into one effective list so they flow everywhere base sources do.
  const resolvedJointSourcesPersistence =
    jointSourcesPersistence === undefined
      ? getDefaultJointSourcesPersistence()
      : jointSourcesPersistence;
  const { jointSources, jointConfigs, createJointSource, updateJointSource, deleteJointSource } =
    useDataStudioJointSources<R>({
      dataSources,
      persistence: resolvedJointSourcesPersistence,
    });
  const effectiveDataSources = React.useMemo(
    () => (jointSources.length > 0 ? [...dataSources, ...jointSources] : dataSources),
    [dataSources, jointSources],
  );
  const jointSourceIds = React.useMemo(
    () => new Set(jointConfigs.map((config) => config.id)),
    [jointConfigs],
  );
  // Joint-source management surface handed to the copilot (it lives outside
  // `stateApi`, so the host adapter receives it as a sibling api).
  const copilotJointSources = React.useMemo<StudioCopilotJointSourcesApi>(
    () => ({
      configs: jointConfigs,
      create: createJointSource,
      update: updateJointSource,
      remove: deleteJointSource,
    }),
    [jointConfigs, createJointSource, updateJointSource, deleteJointSource],
  );
  const [isJoinBuilderOpen, setJoinBuilderOpen] = React.useState(false);
  const [editingJointConfig, setEditingJointConfig] =
    React.useState<DataStudioJointSourceConfig | null>(null);

  // Resolution priority: explicit controlled prop > routing-driven value > defaults.
  // Returning a defined value here makes `useDataStudioState` treat the axis as
  // controlled, which prevents the hook's uncontrolled state from getting out
  // of sync with the URL after a back/forward.
  let resolvedActiveDatasetId: string | undefined;
  if (activeDataSourceIdProp !== undefined) {
    resolvedActiveDatasetId = activeDataSourceIdProp;
  } else if (isRoutingEnabled) {
    resolvedActiveDatasetId =
      navState.activeDataSourceId ?? initialDataSourceId ?? effectiveDataSources[0]?.id;
  }

  let resolvedActiveViewId: string | null | undefined;
  if (activeSheetIdProp !== undefined) {
    resolvedActiveViewId = activeSheetIdProp;
  } else if (isRoutingEnabled) {
    resolvedActiveViewId = navState.activeSheetId;
  }

  const handleActiveDatasetChange = React.useCallback(
    (dataSourceId: string, dataSource: DataStudioDataSource<R>) => {
      if (isRoutingEnabled) {
        const base = pendingWriteRef.current ?? routing!.read();
        scheduleUrlWrite({ activeDataSourceId: dataSourceId, activeSheetId: base.activeSheetId });
      }
      onActiveDataSourceChange?.(dataSourceId, dataSource);
    },
    [isRoutingEnabled, routing, scheduleUrlWrite, onActiveDataSourceChange],
  );

  const handleActiveSheetChange = React.useCallback(
    (sheetId: string | null, sheet: DataStudioSheet | null) => {
      if (isRoutingEnabled) {
        const base = pendingWriteRef.current ?? routing!.read();
        scheduleUrlWrite({
          activeDataSourceId: sheet?.dataSourceId ?? base.activeDataSourceId,
          activeSheetId: sheetId,
        });
      }
      onActiveSheetChange?.(sheetId, sheet);
    },
    [isRoutingEnabled, routing, scheduleUrlWrite, onActiveSheetChange],
  );

  // Resolve the persistence adapter. `undefined` ⇒ default localStorage; `null`
  // ⇒ opt-out. Persistence is only effective when `views` is uncontrolled —
  // a controlled consumer owns the source of truth and we stay out of the way.
  const resolvedSheetsPersistence =
    sheetsPersistence === undefined ? getDefaultSheetsPersistence() : sheetsPersistence;
  const isPersistenceEnabled = resolvedSheetsPersistence != null && sheetsProp === undefined;

  const handleSheetsChange = React.useCallback(
    (nextSheets: DataStudioSheet[]) => {
      if (isPersistenceEnabled) {
        resolvedSheetsPersistence!.write(nextSheets);
      }
      onSheetsChange?.(nextSheets);
    },
    [isPersistenceEnabled, resolvedSheetsPersistence, onSheetsChange],
  );

  const hydrateSheets = React.useCallback(() => {
    if (!isPersistenceEnabled) {
      return null;
    }
    return resolvedSheetsPersistence!.read();
  }, [isPersistenceEnabled, resolvedSheetsPersistence]);

  // The built-in templates + view types are active by default and plan-gated.
  // The `viewTypes` / `sheetTemplates` props layer on top (append, override by
  // key, or full add/remove/reorder via a `(defaults) => [...]` function).
  const resolvedViewTypes = React.useMemo(
    () => resolveOverridable(getBuiltinViewTypes(plan), viewTypes, (vt) => vt.type),
    [plan, viewTypes],
  );
  const resolvedSheetTemplates = React.useMemo(
    () => resolveOverridable(getBuiltinSheetTemplates(plan), sheetTemplates, (t) => t.id),
    [plan, sheetTemplates],
  );

  const state = useDataStudioState<R>({
    dataSources: effectiveDataSources,
    activeDataSourceId: resolvedActiveDatasetId,
    initialDataSourceId,
    onActiveDataSourceChange: handleActiveDatasetChange,
    sheets: sheetsProp,
    defaultSheets,
    onSheetsChange: handleSheetsChange,
    activeSheetId: resolvedActiveViewId,
    initialActiveSheetId,
    onActiveSheetChange: handleActiveSheetChange,
    sheetTemplates: resolvedSheetTemplates,
    sessionCache,
    hydrateSheets,
  });

  const { activeDataSource, activeSheet, activeSheetId: stateActiveViewId } = state;

  // ---- Joint source management (create / edit / delete) -------------------
  // A joint source can only be built when at least two server-backed (joinable)
  // base sources exist.
  const joinableBaseCount = React.useMemo(
    () => dataSources.filter((dataSource) => Boolean(dataSource.connector)).length,
    [dataSources],
  );
  const handleSubmitJointSource = React.useCallback(
    (input: { id?: string; label: string; definition: DataStudioJoinDefinition }) => {
      if (input.id) {
        updateJointSource(input.id, { label: input.label, definition: input.definition });
        state.selectDataSource(input.id);
      } else {
        const jointSourceId = createJointSource({
          label: input.label,
          definition: input.definition,
        });
        state.selectDataSource(jointSourceId);
      }
    },
    [createJointSource, updateJointSource, state],
  );
  const handleEditJointSource = React.useCallback(
    (jointSourceId: string) => {
      const config = jointConfigs.find((entry) => entry.id === jointSourceId);
      if (config) {
        setEditingJointConfig(config);
        setJoinBuilderOpen(true);
      }
    },
    [jointConfigs],
  );
  const handleDeleteJointSource = React.useCallback(
    (jointSourceId: string) => {
      deleteJointSource(jointSourceId);
      // Fall back to a base source if the deleted joint source was active.
      if (state.activeDataSource?.id === jointSourceId) {
        const fallback = dataSources[0]?.id;
        if (fallback) {
          state.selectDataSource(fallback);
        }
      }
    },
    [deleteJointSource, state, dataSources],
  );
  const handleOpenNewJointSource = React.useCallback(() => {
    setEditingJointConfig(null);
    setJoinBuilderOpen(true);
  }, []);
  const handleCloseJointBuilder = React.useCallback(() => {
    setJoinBuilderOpen(false);
    setEditingJointConfig(null);
  }, []);

  // Clamp: if the URL asked for a dataSource/sheet that doesn't exist, the hook
  // falls back to a different one. Silently `replace` the URL so it reflects
  // what the user is actually looking at, without polluting history.
  // Guarded against an empty `dataSources` array so we don't clobber a valid id
  // (e.g. `?dataSource=customers`) before the schema has finished loading; the
  // effect re-runs when `activeDataSource` changes to a populated value.
  React.useEffect(() => {
    if (!isRoutingEnabled || effectiveDataSources.length === 0) {
      return;
    }
    const urlState = routing!.read();
    const resolvedDataset = activeDataSource?.id ?? null;
    const resolvedSheet = stateActiveViewId;
    const dataSourceWasClamped =
      urlState.activeDataSourceId != null && urlState.activeDataSourceId !== resolvedDataset;
    const sheetWasClamped =
      urlState.activeSheetId != null && urlState.activeSheetId !== resolvedSheet;
    if (!dataSourceWasClamped && !sheetWasClamped) {
      return;
    }
    routing!.write(
      { activeDataSourceId: resolvedDataset, activeSheetId: resolvedSheet },
      'replace',
    );
  }, [isRoutingEnabled, routing, activeDataSource, stateActiveViewId, effectiveDataSources.length]);

  // Highlight the active sheet's tree item when a sheet is selected (matches the
  // tab bar's notion of "the sheet is the active tab"). Fall back to the dataSource
  // when no sheet is active.
  let selectedTreeItemId: string | null = null;
  if (activeSheet) {
    selectedTreeItemId = getSheetItemId(activeSheet.id);
  } else if (activeDataSource) {
    selectedTreeItemId = getDataSourceItemId(activeDataSource.id);
  }
  const showDataSourcesLoading = loading && effectiveDataSources.length === 0;

  const callerApiRef = activeDataSource?.slotProps?.dataGrid?.apiRef ?? slotProps?.dataGrid?.apiRef;
  const effectiveApiRef = callerApiRef ?? internalApiRef;

  // Built-in row editing: when the dataSource's `dataSource` exposes
  // `createRow`/`updateRow`/`deleteRow`, the hook appends the actions column
  // and produces the `onAddRow` handler the toolbar wires up. DataSources without
  // those methods get their original columns unchanged.
  const rowEditing = useDataStudioRowEditing<R>({
    dataSource: activeDataSource,
    apiRef: effectiveApiRef as any,
    // The dataSource's `onDataSourceError` callback is typed against the grid's
    // narrow error types; row-editing errors are plain `Error`s. Cast through
    // `unknown` so the dataSource handler gets the broader feed too.
    onError: activeDataSource?.onDataSourceError as ((error: unknown) => void) | undefined,
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
  } else if (effectiveDataSources.length === 0) {
    dataSourceItems = (
      <TreeItem itemId={EMPTY_DATA_SOURCES_ITEM_ID} label="No data sources" disabled />
    );
  } else {
    dataSourceItems = effectiveDataSources.map((dataSource) => (
      <TreeItem
        key={dataSource.id}
        itemId={getDataSourceItemId(dataSource.id)}
        label={
          jointSourceIds.has(dataSource.id) ? (
            <DataStudioSidebarJointSourceItem
              label={dataSource.label}
              jointSourceId={dataSource.id}
              onEdit={handleEditJointSource}
              onDelete={handleDeleteJointSource}
            />
          ) : (
            dataSource.label
          )
        }
      />
    ));
  }

  const sheetItems =
    state.sheets.length === 0
      ? [
          <TreeItem
            key={EMPTY_SHEETS_ITEM_ID}
            itemId={EMPTY_SHEETS_ITEM_ID}
            label="No sheets yet"
            disabled
          />,
        ]
      : state.sheets.map((sheet, index) => (
          <TreeItem
            key={sheet.id}
            itemId={getSheetItemId(sheet.id)}
            label={
              <DataStudioSidebarSheetItem
                sheet={sheet}
                index={index}
                total={state.sheets.length}
                state={state}
              />
            }
          />
        ));

  const handleAddSheet = React.useCallback(() => {
    // Open the Composer (prompt + template picker) so the user chooses what kind
    // of Sheet to create, instead of silently appending a default grid Sheet.
    state.startComposing();
  }, [state]);

  const handleTreeSelectionChange = React.useCallback(
    (_event: React.SyntheticEvent | null, itemIds: string | string[] | null) => {
      const itemId = Array.isArray(itemIds) ? (itemIds.at(0) ?? null) : itemIds;
      const dataSourceId = getDatasetIdFromTreeItemId(itemId);
      if (dataSourceId !== null) {
        state.selectDataSource(dataSourceId);
        return;
      }
      const sheetId = getSheetIdFromTreeItemId(itemId);
      if (sheetId !== null) {
        state.selectSheet(sheetId);
      }
    },
    [state],
  );

  const dataSourceSlotProps = activeDataSource?.slotProps?.dataGrid;
  // A sheet's view state (pivot model, grouped/visible columns) references its
  // bound source's columns. If routing has driven the active data source to
  // differ from the sheet's binding, applying that view state would seed the
  // grid with foreign field names (e.g. a joint-source pivot model on a base
  // source) and serialize them into the rows request. Drop it in that case.
  // Free-form sheets (no binding) keep their state.
  const sheetMatchesActiveSource =
    activeSheet == null ||
    activeSheet.dataSourceId == null ||
    activeSheet.dataSourceId === activeDataSource?.id;
  const sheetInitialState = sheetMatchesActiveSource ? activeSheet?.initialState : undefined;
  const mergedInitialState = React.useMemo(() => {
    if (!sheetInitialState) {
      return dataSourceSlotProps?.initialState ?? slotProps?.dataGrid?.initialState;
    }
    return {
      ...(slotProps?.dataGrid?.initialState ?? {}),
      ...(dataSourceSlotProps?.initialState ?? {}),
      ...sheetInitialState,
    };
  }, [slotProps?.dataGrid?.initialState, dataSourceSlotProps?.initialState, sheetInitialState]);

  const activeDataSourceCache = activeDataSource?.cache;
  const activeDataSourceId = activeDataSource?.id;
  // Per-dataSource cache resolution. Order: explicit dataSource override → strategy default.
  // `undefined` means "let the grid build its own default cache" (the legacy behavior).
  const resolvedDataSourceCache = React.useMemo(() => {
    if (activeDataSourceCache !== undefined) {
      return activeDataSourceCache;
    }
    if (cacheStrategy === 'none') {
      return null;
    }
    if (cacheStrategy === 'shared' && sessionCache && activeDataSourceId) {
      return sessionCache.forDataset(activeDataSourceId);
    }
    return undefined;
  }, [activeDataSourceCache, activeDataSourceId, cacheStrategy, sessionCache]);

  // The preview pane's "Chart" / "Pivot table" actions start the matching
  // built-in template bound to the active Data Source. `startSheetFromTemplate`
  // binds via the active Data Source id and returns null when the template
  // isn't registered (e.g. a non-premium plan), in which case we fall back to a
  // plain grid Sheet so the button is never dead.
  const handleAddTemplateFromDataSource = React.useCallback(
    (templateId: string, fallbackLabel: string) => {
      if (!activeDataSource) {
        return;
      }
      const created = state.startSheetFromTemplate(templateId);
      if (!created) {
        state.addSheet({ dataSourceId: activeDataSource.id, label: fallbackLabel });
      }
    },
    [state, activeDataSource],
  );

  const gridElement =
    activeDataSource === null ? null : (
      <DataGridSlot
        key={`${activeDataSource.id}::${activeSheet?.id ?? ''}`}
        {...DATA_STUDIO_DEFAULT_DATA_GRID_PROPS}
        // Connector-backed Sources page through the whole dataset (server-side);
        // client Sources keep all rows in one virtualized scroll.
        pagination={activeDataSource.connector != null}
        {...slotProps?.dataGrid}
        {...dataSourceSlotProps}
        initialState={mergedInitialState}
        columns={rowEditing.columns}
        rows={activeDataSource.rows ?? []}
        rowIdField={activeDataSource.rowIdField}
        getRowId={activeDataSource.getRowId}
        dataSource={activeDataSource.connector}
        dataSourceCache={resolvedDataSourceCache}
        dataSourceRevalidateMs={activeDataSource.dataSourceRevalidateMs}
        onDataSourceError={activeDataSource.onDataSourceError}
        apiRef={effectiveApiRef}
        {...(rowEditing.rowModesModel !== null && {
          editMode: 'row',
          rowModesModel: rowEditing.rowModesModel,
          onRowModesModelChange: rowEditing.onRowModesModelChange,
        })}
      />
    );

  // Resolve the active sheet's view renderer. `'grid'` (the default) renders
  // inline below — DataStudio owns the grid's apiRef, slot props, cache, and
  // row-editing column decoration. Any other registered view type goes
  // through `<ViewTypeComponent>`; unknown types render the friendly fallback.
  const activeSheetType = activeSheet?.type;
  const activeSheetViewType = activeSheet
    ? resolveDataStudioViewType(resolvedViewTypes, activeSheetType)
    : undefined;
  const isCustomViewType = Boolean(activeSheet && activeSheetType && activeSheetType !== 'grid');
  // A grid-backed view (e.g. the spreadsheet) renders its grid on the shared
  // `apiRef`, so the menu bar / toolbar can bind to it.
  const activeViewIsGridBacked = isCustomViewType && activeSheetViewType?.gridBacked === true;
  // A view that owns its toolbar (the spreadsheet) suppresses the Data Studio
  // grid toolbar — its database controls (sort/filter/pivot/…) don't apply.
  const activeViewOwnsToolbar = isCustomViewType && activeSheetViewType?.ownsToolbar === true;
  // The menu bar / toolbar are active when the inline grid is the surface OR a
  // grid-backed view owns the pane (and not while composing).
  const chromeGridActive =
    !state.isComposing &&
    (activeViewIsGridBacked || (activeDataSource != null && !isCustomViewType));

  const handleSetActiveSheetParams = React.useCallback(
    (next: Partial<Record<string, unknown>>) => {
      if (!activeSheet) {
        return;
      }
      state.updateSheet(activeSheet.id, {
        params: { ...(activeSheet.params ?? {}), ...next },
      });
    },
    [activeSheet, state],
  );

  // Re-bind the active Sheet to another Data Source (used by the Chart view's
  // Data Source picker). Clears params so the view re-seeds defaults for the new
  // Source's columns instead of carrying over now-invalid field references.
  const handleChangeSheetDataSource = React.useCallback(
    (dataSourceId: string | null) => {
      if (!activeSheet) {
        return;
      }
      state.updateSheet(activeSheet.id, { dataSourceId, params: {} });
    },
    [activeSheet, state],
  );

  // Let a view spawn (and activate) a new Sheet — e.g. the Pivot view creating a
  // chart from its current configuration. Binds to the current Sheet's Data
  // Source unless the request names another.
  const handleCreateSheetFromView = React.useCallback(
    (request: {
      type: string;
      label?: string;
      params?: Record<string, unknown>;
      dataSourceId?: string | null;
    }) => {
      const dataSourceId =
        request.dataSourceId !== undefined
          ? request.dataSourceId
          : (activeSheet?.dataSourceId ?? activeDataSource?.id ?? null);
      state.addSheet({
        dataSourceId,
        label: request.label,
        type: request.type,
        params: request.params,
      });
    },
    [state, activeSheet, activeDataSource],
  );

  let customViewContent: React.ReactNode = null;
  if (activeSheet && isCustomViewType) {
    customViewContent = activeSheetViewType ? (
      React.createElement(activeSheetViewType.Component, {
        sheet: activeSheet,
        dataSource: activeDataSource,
        dataSources: effectiveDataSources,
        onChangeDataSource: handleChangeSheetDataSource,
        params: sheetMatchesActiveSource ? (activeSheet.params ?? {}) : {},
        setParams: handleSetActiveSheetParams,
        plan,
        apiRef: effectiveApiRef,
        onCreateSheet: handleCreateSheetFromView,
      })
    ) : (
      <UnknownViewType type={activeSheetType ?? ''} />
    );
  }

  const handlePickTemplate = React.useCallback(
    (templateId: string) => {
      state.startSheetFromTemplate(templateId);
    },
    [state],
  );
  const handleSubmitPrompt = React.useCallback(
    (prompt: string) => {
      // Awaited internally; fire-and-forget here so the input clears
      // immediately. The state hook resolves to null in v1 (no copilot
      // adapter bridge yet) so nothing else needs to await.
      void state.startSheetFromPrompt(prompt);
    },
    [state],
  );

  // Render path:
  //   - Custom view type registered on the active sheet → its Component
  //     (or unknown-type fallback).
  //   - No data sources at all → Composer (front door for empty studios).
  //   - Data source available, no sheet → preview pane wrapping the grid.
  //   - Sheet active with 'grid' (default) → bare grid (sheet supplies
  //     `initialState`).
  // The Composer doubles as the "create a new Sheet" screen: it shows when the
  // studio is empty (no Data Sources) AND on demand when the user clicks
  // "Add new sheet" (`state.isComposing`). On-demand composing offers a Cancel
  // back to whatever was active.
  const composerElement = (
    <DataStudioComposer
      templates={resolvedSheetTemplates}
      promptEnabled={copilotChatAdapter != null}
      onSubmitPrompt={handleSubmitPrompt}
      onPickTemplate={handlePickTemplate}
      onCancel={
        state.isComposing && (activeSheet != null || activeDataSource != null)
          ? state.cancelComposing
          : undefined
      }
    />
  );

  let gridContent: React.ReactNode;
  if (state.isComposing) {
    gridContent = composerElement;
  } else if (customViewContent) {
    gridContent = customViewContent;
  } else if (activeDataSource === null) {
    gridContent = composerElement;
  } else if (activeSheet) {
    gridContent = gridElement;
  } else {
    gridContent = (
      <DataStudioDataSourceView
        dataSource={activeDataSource}
        onAddChartSheet={() => handleAddTemplateFromDataSource('chart', 'Chart')}
        onAddPivotSheet={() => handleAddTemplateFromDataSource('pivot', 'Pivot table')}
        onAddDashboardSheet={() => handleAddTemplateFromDataSource('dashboard', 'Dashboard')}
      >
        {gridElement}
      </DataStudioDataSourceView>
    );
  }

  const mainPane = (
    <DataStudioMain className={classes.main}>
      {MenuBarSlot ? (
        <MenuBarSlot
          apiRef={effectiveApiRef}
          // The menu bar binds to the inline grid OR a grid-backed view's grid
          // (spreadsheet/pivot/chart) via the shared apiRef; `chromeGridActive`
          // is false only for non-grid surfaces and while composing.
          gridActive={chromeGridActive}
          {...slotProps?.menuBar}
        />
      ) : null}
      {ToolbarSlot && !activeViewOwnsToolbar && !state.isComposing ? (
        <DataStudioToolbarArea className={classes.toolbarArea}>
          <DataStudioToolbarSlotWrap>
            {/*
          Remount the toolbar on dataSource switch so `useGridSelector`
          subscriptions re-bind to the freshly-mounted grid's store and any
          per-mount local state (search draft, menu anchors) resets. Without
          this key, the toolbar carries stale column metadata across dataSources
          and the user's quick-filter draft leaks between dataSources.
          */}
            <ToolbarSlot
              key={activeDataSource?.id ?? '__no-dataSource__'}
              apiRef={effectiveApiRef}
              // Custom view types (chart/pivot) own the pane with their own
              // grid, detaching the inline `apiRef` — disable the grid-bound
              // toolbar controls instead of dereferencing a null api.
              gridActive={chromeGridActive}
              activeSheet={activeSheet}
              baselineInitialState={mergedInitialState}
              onAddRow={activeDataSource?.onAddRow ?? rowEditing.onAddRow ?? undefined}
              onSaveCurrentView={(input) =>
                state.addSheet({
                  dataSourceId: activeDataSource?.id,
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
      <DataStudioGrid className={classes.grid}>{gridContent}</DataStudioGrid>
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
        dataSources={effectiveDataSources}
        jointSources={copilotJointSources}
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
                <TreeItem
                  className={DATA_STUDIO_TREE_SECTION_CLASS}
                  itemId={DATA_SOURCES_ITEM_ID}
                  label="Data Sources"
                >
                  {dataSourceItems}
                </TreeItem>
                <TreeItem
                  className={DATA_STUDIO_TREE_SECTION_CLASS}
                  itemId={SHEETS_ITEM_ID}
                  label="Sheets"
                >
                  {sheetItems}
                </TreeItem>
              </DataStudioTree>
              <DataStudioSheetsAction className={classes.sheetsAction}>
                <Button
                  fullWidth
                  size="small"
                  variant="text"
                  onClick={handleOpenNewJointSource}
                  disabled={joinableBaseCount < 2}
                >
                  New joint source
                </Button>
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  onClick={handleAddSheet}
                  disabled={effectiveDataSources.length === 0}
                >
                  Add new sheet
                </Button>
              </DataStudioSheetsAction>
            </DataStudioSidebar>
            <DataStudioJoinBuilder
              open={isJoinBuilderOpen}
              onClose={handleCloseJointBuilder}
              dataSources={dataSources}
              initialConfig={editingJointConfig}
              onSubmit={handleSubmitJointSource}
            />
            {mainPane}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {mainPane}
            <DataStudioTabBar classes={classes} dataSources={effectiveDataSources} state={state} />
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
   * The active dataSource id.
   */
  activeDataSourceId: PropTypes.string,
  /**
   * The active sheet id (controlled). Pass `null` to indicate a dataSource tab is active.
   */
  activeSheetId: PropTypes.string,
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
   * Strategy applied to the Data Source cache used by every dataSource.
   * See `DataStudioCacheStrategy` for the available values.
   * A `dataSource.cache` set on an individual dataSource always takes precedence.
   * @default 'shared'
   */
  cacheStrategy: PropTypes.oneOf(['none', 'per-dataSource', 'shared']),
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
    chartsIntegration: PropTypes.bool,
    dataQuery: PropTypes.bool,
    dataSourceSwitching: PropTypes.bool,
    filter: PropTypes.bool,
    grouping: PropTypes.bool,
    jointSourceCrud: PropTypes.bool,
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
   * DataSources available in the studio.
   */
  dataSources: PropTypes.arrayOf(
    PropTypes.shape({
      cache: PropTypes.shape({
        clear: PropTypes.func.isRequired,
        get: PropTypes.func.isRequired,
        set: PropTypes.func.isRequired,
      }),
      chartDefaults: PropTypes.shape({
        dimensions: PropTypes.arrayOf(PropTypes.string),
        values: PropTypes.arrayOf(PropTypes.string),
      }),
      columns: PropTypes.arrayOf(PropTypes.object).isRequired,
      connector: PropTypes.shape({
        createRow: PropTypes.func,
        deleteRow: PropTypes.func,
        getAggregatedValue: PropTypes.func,
        getChildrenCount: PropTypes.func,
        getGroupKey: PropTypes.func,
        getRows: PropTypes.func.isRequired,
        updateRow: PropTypes.func,
      }),
      dataSourceRevalidateMs: PropTypes.number,
      getRowId: PropTypes.func,
      id: PropTypes.string.isRequired,
      joinGroup: PropTypes.string,
      label: PropTypes.node,
      onAddRow: PropTypes.func,
      onDataSourceError: PropTypes.func,
      rowIdField: PropTypes.string,
      rows: PropTypes.arrayOf(PropTypes.object),
      slotProps: PropTypes.object,
      supportsServerGrouping: PropTypes.bool,
    }),
  ).isRequired,
  /**
   * Initial sheets displayed alongside dataSources (uncontrolled).
   * Ignored if `sheets` is provided.
   */
  defaultSheets: PropTypes.arrayOf(
    PropTypes.shape({
      dataSourceId: PropTypes.string,
      id: PropTypes.string.isRequired,
      initialState: PropTypes.object,
      label: PropTypes.node,
      params: PropTypes.object,
      type: PropTypes.string,
    }),
  ),
  /**
   * The initially active sheet id (uncontrolled).
   */
  initialActiveSheetId: PropTypes.string,
  /**
   * The initially active dataSource id.
   */
  initialDataSourceId: PropTypes.string,
  /**
   * Adapter persisting the user's joint sources (created in the UI from the base
   * `dataSources`). Defaults to a `localStorage` adapter so joint sources are
   * remembered across reloads. Pass `null` to disable persistence, or a custom
   * adapter to back it with a server, IndexedDB, etc.
   * @default createLocalStorageJointSourcesPersistenceAdapter()
   */
  jointSourcesPersistence: PropTypes.shape({
    read: PropTypes.func.isRequired,
    write: PropTypes.func.isRequired,
  }),
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
   * Callback fired when the active dataSource changes.
   * @param {string} dataSourceId The selected dataSource id.
   * @param {DataStudioDataSource<R>} dataSource The selected dataSource definition.
   */
  onActiveDataSourceChange: PropTypes.func,
  /**
   * Callback fired when the active sheet changes. `null` means a dataSource tab became active.
   * @param {string | null} sheetId The selected sheet id.
   * @param {DataStudioSheet | null} sheet The selected sheet definition.
   */
  onActiveSheetChange: PropTypes.func,
  /**
   * Callback fired when the list of sheets changes (add, rename, duplicate, delete, reorder).
   * @param {DataStudioSheet[]} sheets The updated list of sheets.
   */
  onSheetsChange: PropTypes.func,
  /**
   * MUI X plan to target. Selects the default Data Grid (community / Pro /
   * Premium).
   *
   * Override the auto-resolved grid by passing `slots.dataGrid` explicitly.
   * @default 'community'
   */
  plan: PropTypes.oneOf(['community', 'premium', 'pro']),
  /**
   * Routing adapter that mirrors the active dataSource and sheet into an external
   * source (typically the URL query string). Pass
   * `createSearchParamsRoutingAdapter()` for a `window.history`-based default,
   * or implement the interface to integrate with Next.js / React Router / etc.
   *
   * Explicit `activeDataSourceId` / `activeSheetId` controlled props still win when set.
   */
  routing: PropTypes.shape({
    read: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired,
    write: PropTypes.func.isRequired,
  }),
  /**
   * Sheets displayed alongside dataSources (controlled).
   * Each sheet targets a dataSource (or is free-form) and contains a single
   * view in v1.
   */
  sheets: PropTypes.arrayOf(
    PropTypes.shape({
      dataSourceId: PropTypes.string,
      id: PropTypes.string.isRequired,
      initialState: PropTypes.object,
      label: PropTypes.node,
      params: PropTypes.object,
      type: PropTypes.string,
    }),
  ),
  /**
   * Persistence adapter for the list of sheets. Hydrated once on mount and
   * called whenever the sheets list mutates (add, rename, duplicate, delete,
   * move, updateSheet). Pass `null` to disable persistence.
   *
   * Defaults to `createLocalStorageSheetsPersistenceAdapter()` (localStorage,
   * namespace `'default'`) so sheets are remembered across reloads
   * out-of-the-box. Pass a custom adapter to back persistence with a server,
   * IndexedDB, etc.
   *
   * Ignored when the `sheets` prop is provided (controlled mode — the consumer
   * owns the source of truth).
   * @default createLocalStorageSheetsPersistenceAdapter()
   */
  sheetsPersistence: PropTypes.shape({
    read: PropTypes.func.isRequired,
    write: PropTypes.func.isRequired,
  }),
  /**
   * Sheet templates surfaced in the Composer (the empty-state main screen).
   * Each template builds a `DataStudioSheet` from an optional active Data
   * Source, then the Composer hands the result to `addSheet`.
   *
   * The plan-appropriate built-ins (Spreadsheet always; Pivot + Chart on
   * `plan="premium"`) are active by default — omit this prop to use them
   * as-is. Pass an array to add or override-by-`id`, or a `(defaults) => [...]`
   * function to add / remove / reorder.
   * @default getBuiltinSheetTemplates(plan)
   */
  sheetTemplates: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        build: PropTypes.func.isRequired,
        description: PropTypes.string,
        icon: PropTypes.elementType,
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      }),
    ),
    PropTypes.func,
  ]),
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
   * View types that render a Sheet's content area, keyed by `sheet.type`
   * (defaulting to the inline `'grid'` renderer). The plan-appropriate
   * built-ins (Spreadsheet always; Pivot + Chart on `plan="premium"`) are
   * active by default — omit this prop to use them as-is.
   *
   * Pass an array to add or override-by-`type`, or a `(defaults) => [...]`
   * function to add / remove / reorder. Unknown types render a friendly
   * fallback. The AI agent can inspect each type's `paramsSchema` to construct
   * valid `sheet.params` payloads.
   * @default getBuiltinViewTypes(plan)
   */
  viewTypes: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        Component: PropTypes.elementType,
        defaultLabel: PropTypes.string,
        gridBacked: PropTypes.bool,
        icon: PropTypes.elementType,
        ownsToolbar: PropTypes.bool,
        paramsSchema: PropTypes.object,
        type: PropTypes.string.isRequired,
      }),
    ),
    PropTypes.func,
  ]),
} as any;

export { DataStudio };
