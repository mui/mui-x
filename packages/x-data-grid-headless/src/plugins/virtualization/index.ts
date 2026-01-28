'use client';
import * as React from 'react';
import { createSelector, type Store, useStore } from '@base-ui/utils/store';
import {
  useVirtualizer,
  LayoutDataGrid,
  Dimensions,
  Virtualization,
  computeOffsetLeft,
  type BaseState,
} from '@mui/x-virtualizer';
import { type Plugin, createPlugin } from '../core/plugin';
import type { GridRowId, GridRowModel } from '../internal/rows/rowUtils';
import type { ColumnState } from '../internal/columns/columnUtils';

export interface RowToRender<TRow = GridRowModel> {
  id: GridRowId;
  model: TRow;
  index: number;
}

export interface ColumnToRender extends ColumnState {
  index: number;
}

export interface VirtualizationOptions {
  disableVirtualization?: boolean;
  disableColumnVirtualization?: boolean;
  autoHeight?: boolean;
  rowBufferPx?: number;
  columnBufferPx?: number;
  rowHeight?: number;
  initialState?: {
    scroll?: { top: number; left: number };
  };
}

export interface VirtualizationState {
  virtualization: {
    enabled: boolean;
    enabledForRows: boolean;
    enabledForColumns: boolean;
  };
}

const selectVirtualization = createSelector((state: VirtualizationState) => state.virtualization);

interface VirtualizationHooks {
  useScrollPosition: () => { top: number; left: number };
  useOffsetTop: () => number;
  useOffsetLeft: () => number;
  useDimensions: () => Dimensions.State['dimensions'] & {
    rowsMeta: Dimensions.State['rowsMeta'];
  };
  useColumnsTotalWidth: () => ReturnType<typeof Dimensions.selectors.columnsTotalWidth>;
  useRowsToRender: <TRow = GridRowModel>() => RowToRender<TRow>[];
  useColumnsToRender: () => ColumnToRender[];
  useContainerProps: () => ReturnType<typeof LayoutDataGrid.selectors.containerProps>;
  useScrollerProps: () => ReturnType<typeof LayoutDataGrid.selectors.scrollerProps>;
  useContentProps: () => ReturnType<typeof LayoutDataGrid.selectors.contentProps>;
  usePositionerProps: () => ReturnType<typeof LayoutDataGrid.selectors.positionerProps>;
  useScrollbarVerticalProps: () => ReturnType<
    typeof LayoutDataGrid.selectors.scrollbarVerticalProps
  >;
  useScrollbarHorizontalProps: () => ReturnType<
    typeof LayoutDataGrid.selectors.scrollbarHorizontalProps
  >;
  useScrollAreaProps: () => ReturnType<typeof LayoutDataGrid.selectors.scrollAreaProps>;
}

export interface VirtualizationApi {
  virtualization: {
    setVirtualization: (enabled: boolean) => void;
    setColumnVirtualization: (enabled: boolean) => void;
    getScrollPosition: () => { top: number; left: number };
    getOffsetTop: () => number;
    forceUpdateRenderContext: () => void;
    getVirtualizerStore: () => Store<BaseState>;
    hooks: VirtualizationHooks;
  };
}

type VirtualizationPlugin = Plugin<
  'virtualization',
  VirtualizationState,
  VirtualizationApi,
  VirtualizationOptions,
  {}
>;

const DEFAULT_ROW_HEIGHT = 52;
const DEFAULT_COLUMN_WIDTH = 100;

function getInitialVirtualizationState(params: VirtualizationOptions): VirtualizationState {
  const { disableVirtualization, disableColumnVirtualization, autoHeight } = params;

  const enabled = !disableVirtualization;
  const enabledForColumns = !disableVirtualization && !disableColumnVirtualization;
  const enabledForRows = !disableVirtualization && !autoHeight;

  return {
    virtualization: {
      enabled,
      enabledForColumns,
      enabledForRows,
    },
  };
}

function renderRow() {
  return null as unknown as React.ReactElement;
}

const virtualizationPlugin = createPlugin<VirtualizationPlugin>()({
  name: 'virtualization',
  getInitialState: (state, params) => ({
    ...state,
    ...getInitialVirtualizationState(params),
  }),
  use: (store, params, api) => {
    const rowHeight = params.rowHeight ?? DEFAULT_ROW_HEIGHT;
    const rowBufferPx = params.rowBufferPx ?? 150;
    const columnBufferPx = params.columnBufferPx ?? 150;
    const autoHeight = params.autoHeight ?? false;

    const rowIds = api.rows.selectors.rowIds(store.state);
    const rowLookup = api.rows.selectors.rowIdToModelLookup(store.state);

    const visibleColumns = api.columns.selectors.visibleColumns(store.state);
    const columnsTotalWidth = visibleColumns.reduce(
      (total, col) => total + (col.size ?? DEFAULT_COLUMN_WIDTH),
      0,
    );

    const scrollerRef = React.useRef<HTMLElement | null>(null);
    const containerRef = React.useRef<HTMLElement | null>(null);
    const scrollbarVerticalRef = React.useRef<HTMLElement | null>(null);
    const scrollbarHorizontalRef = React.useRef<HTMLElement | null>(null);

    const layout = React.useMemo(
      () =>
        new LayoutDataGrid({
          scroller: scrollerRef,
          container: containerRef,
          scrollbarVertical: scrollbarVerticalRef,
          scrollbarHorizontal: scrollbarHorizontalRef,
        }),
      [],
    );

    const rows = React.useMemo(() => {
      return rowIds.map((id) => ({
        id,
        model: rowLookup[id] ?? {},
      }));
    }, [rowIds, rowLookup]);

    const columns = React.useMemo(() => {
      return visibleColumns.map((col) => ({
        ...col,
        computedWidth: col.size ?? DEFAULT_COLUMN_WIDTH,
      }));
    }, [visibleColumns]);

    const virtualizer = useVirtualizer({
      layout,
      dimensions: {
        rowHeight,
        columnsTotalWidth,
        autoHeight,
      },
      virtualization: {
        rowBufferPx,
        columnBufferPx,
      },
      rows,
      range: { firstRowIndex: 0, lastRowIndex: rows.length },
      rowCount: rows.length,
      columns,
      initialState: {
        scroll: params.initialState?.scroll,
      },
      renderRow,
    });

    const { store: virtualizerStore, api: virtualizerApi } = virtualizer;

    const setVirtualization = React.useCallback(
      (enabled: boolean) => {
        store.setState({
          ...store.state,
          virtualization: {
            ...store.state.virtualization,
            enabled,
            enabledForColumns: enabled,
            enabledForRows: enabled && !params.autoHeight,
          },
        });
      },
      [store, params.autoHeight],
    );

    const setColumnVirtualization = React.useCallback(
      (enabled: boolean) => {
        store.setState({
          ...store.state,
          virtualization: {
            ...store.state.virtualization,
            enabledForColumns: enabled,
          },
        });
      },
      [store],
    );

    const getScrollPosition = React.useCallback(() => {
      return Virtualization.selectors.scrollPosition(virtualizerStore.state).current;
    }, [virtualizerStore]);

    const getVirtualizerStore = React.useCallback(() => {
      return virtualizerStore as unknown as Store<BaseState>;
    }, [virtualizerStore]);

    const getOffsetTop = React.useCallback(() => {
      return Virtualization.selectors.offsetTop(virtualizerStore.state);
    }, [virtualizerStore]);

    const forceUpdateRenderContext = React.useCallback(() => {
      virtualizerApi.forceUpdateRenderContext();
    }, [virtualizerApi]);

    React.useEffect(() => {
      setVirtualization(!params.disableVirtualization);
    }, [params.disableVirtualization, setVirtualization]);

    React.useEffect(() => {
      setColumnVirtualization(!params.disableColumnVirtualization);
    }, [params.disableColumnVirtualization, setColumnVirtualization]);

    const useScrollPositionHook = (): { top: number; left: number } => {
      const scrollPositionState = useStore(
        virtualizerStore,
        Virtualization.selectors.scrollPosition,
      );
      return scrollPositionState.current;
    };

    const useOffsetTopHook = (): number => {
      return useStore(virtualizerStore, Virtualization.selectors.offsetTop);
    };

    const useOffsetLeftHook = (): number => {
      const virtualizationState = useStore(store, selectVirtualization);
      const visibleColumnsValue = useStore(store, api.columns.selectors.visibleColumns);
      const renderContext = useStore(virtualizerStore, Virtualization.selectors.renderContext);

      const columnPositions = React.useMemo(
        () =>
          Dimensions.selectors.columnPositions(
            virtualizerStore,
            visibleColumnsValue.map((col) => ({ ...col, computedWidth: col.size ?? 100 })),
          ),
        [visibleColumnsValue],
      );

      return React.useMemo(() => {
        if (!virtualizationState.enabledForColumns) {
          return 0;
        }
        return computeOffsetLeft(columnPositions, renderContext, 0);
      }, [virtualizationState.enabledForColumns, columnPositions, renderContext]);
    };

    const useDimensionsHook = () => {
      const dimensionsState = useStore(virtualizerStore, Dimensions.selectors.dimensions);
      const rowsMetaValue = useStore(virtualizerStore, Dimensions.selectors.rowsMeta);

      return React.useMemo(
        () => ({
          ...dimensionsState,
          rowsMeta: rowsMetaValue,
        }),
        [dimensionsState, rowsMetaValue],
      );
    };

    const useColumnsTotalWidth: VirtualizationHooks['useColumnsTotalWidth'] = () => {
      return useStore(virtualizerStore, Dimensions.selectors.columnsTotalWidth);
    };

    const useRowsToRenderHook = <TRow = GridRowModel>(): RowToRender<TRow>[] => {
      const virtualizationState = useStore(store, selectVirtualization);
      const rowIdsValue = useStore(store, api.rows.selectors.rowIds);
      const rowLookupValue = useStore(store, api.rows.selectors.rowIdToModelLookup);
      const renderContext = useStore(virtualizerStore, Virtualization.selectors.renderContext);

      return React.useMemo((): RowToRender<TRow>[] => {
        const firstIndex = virtualizationState.enabledForRows ? renderContext.firstRowIndex : 0;
        const lastIndex = virtualizationState.enabledForRows
          ? renderContext.lastRowIndex
          : rowIdsValue.length;

        const rowsList: RowToRender<TRow>[] = [];
        for (let i = firstIndex; i < lastIndex && i < rowIdsValue.length; i += 1) {
          const id = rowIdsValue[i];
          const model = rowLookupValue[id] as TRow;
          if (model) {
            rowsList.push({ id, model, index: i });
          }
        }
        return rowsList;
      }, [virtualizationState.enabledForRows, renderContext, rowIdsValue, rowLookupValue]);
    };

    const useColumnsToRenderHook = (): ColumnToRender[] => {
      const virtualizationState = useStore(store, selectVirtualization);
      const visibleColumnsValue = useStore(store, api.columns.selectors.visibleColumns);
      const renderContext = useStore(virtualizerStore, Virtualization.selectors.renderContext);

      return React.useMemo((): ColumnToRender[] => {
        const firstIndex = virtualizationState.enabledForColumns
          ? renderContext.firstColumnIndex
          : 0;
        const lastIndex = virtualizationState.enabledForColumns
          ? renderContext.lastColumnIndex
          : visibleColumnsValue.length;

        const columnsList: ColumnToRender[] = [];
        for (let i = firstIndex; i < lastIndex && i < visibleColumnsValue.length; i += 1) {
          columnsList.push({ ...visibleColumnsValue[i], index: i });
        }
        return columnsList;
      }, [virtualizationState.enabledForColumns, renderContext, visibleColumnsValue]);
    };

    const useContainerPropsHook: VirtualizationHooks['useContainerProps'] = () => {
      return useStore(virtualizerStore, LayoutDataGrid.selectors.containerProps);
    };

    const useScrollerPropsHook: VirtualizationHooks['useScrollerProps'] = () => {
      return useStore(virtualizerStore, LayoutDataGrid.selectors.scrollerProps);
    };

    const useContentPropsHook: VirtualizationHooks['useContentProps'] = () => {
      return useStore(virtualizerStore, LayoutDataGrid.selectors.contentProps);
    };

    const usePositionerPropsHook: VirtualizationHooks['usePositionerProps'] = () => {
      return useStore(virtualizerStore, LayoutDataGrid.selectors.positionerProps);
    };

    const useScrollbarVerticalPropsHook: VirtualizationHooks['useScrollbarVerticalProps'] = () => {
      return useStore(virtualizerStore, LayoutDataGrid.selectors.scrollbarVerticalProps);
    };

    const useScrollbarHorizontalPropsHook: VirtualizationHooks['useScrollbarHorizontalProps'] =
      () => {
        return useStore(virtualizerStore, LayoutDataGrid.selectors.scrollbarHorizontalProps);
      };

    const useScrollAreaPropsHook: VirtualizationHooks['useScrollAreaProps'] = () => {
      return useStore(virtualizerStore, LayoutDataGrid.selectors.scrollAreaProps);
    };

    return {
      virtualization: {
        setVirtualization,
        setColumnVirtualization,
        getScrollPosition,
        getOffsetTop,
        forceUpdateRenderContext,
        getVirtualizerStore,
        hooks: {
          useScrollPosition: useScrollPositionHook,
          useOffsetTop: useOffsetTopHook,
          useOffsetLeft: useOffsetLeftHook,
          useDimensions: useDimensionsHook,
          useColumnsTotalWidth,
          useRowsToRender: useRowsToRenderHook,
          useColumnsToRender: useColumnsToRenderHook,
          useContainerProps: useContainerPropsHook,
          useScrollerProps: useScrollerPropsHook,
          useContentProps: useContentPropsHook,
          usePositionerProps: usePositionerPropsHook,
          useScrollbarVerticalProps: useScrollbarVerticalPropsHook,
          useScrollbarHorizontalProps: useScrollbarHorizontalPropsHook,
          useScrollAreaProps: useScrollAreaPropsHook,
        },
      },
    };
  },
});

export default virtualizationPlugin;
