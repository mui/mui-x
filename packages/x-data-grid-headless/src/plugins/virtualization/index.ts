'use client';
import * as React from 'react';
import { createSelector, Store, useStore } from '@base-ui/utils/store';
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
    virtualization?: Partial<VirtualizationState['virtualization']>;
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

interface ContainerProps {
  ref: React.Ref<HTMLDivElement>;
}

interface ScrollerProps {
  ref: React.Ref<HTMLDivElement>;
  style: React.CSSProperties;
  role: string;
  tabIndex?: number;
}

interface ContentProps {
  style: React.CSSProperties;
}

interface PositionerProps {
  style: React.CSSProperties;
}

interface ScrollbarVerticalProps {
  ref: React.Ref<HTMLDivElement>;
  scrollPosition: { current: { top: number; left: number } };
}

interface ScrollbarHorizontalProps {
  ref: React.Ref<HTMLDivElement>;
  scrollPosition: { current: { top: number; left: number } };
}

interface ScrollAreaProps {
  scrollPosition: { current: { top: number; left: number } };
}

interface VirtualizationHooks {
  useRenderContext: () => ReturnType<typeof Virtualization.selectors.renderContext>;
  useScrollPosition: () => { top: number; left: number };
  useOffsetTop: () => number;
  useOffsetLeft: () => number;
  useDimensions: () => {
    contentHeight: Dimensions.State['dimensions']['contentSize']['height'];
    viewportInnerSize: Dimensions.State['dimensions']['viewportInnerSize'];
    rowsMeta: Dimensions.State['rowsMeta'];
  };
  useTotalContentSize: () => { width: number; height: number };
  useRowsToRender: <TRow = GridRowModel>() => RowToRender<TRow>[];
  useColumnsToRender: () => ColumnToRender[];
  useContainerProps: () => ContainerProps;
  useScrollerProps: () => ScrollerProps;
  useContentProps: () => ContentProps;
  usePositionerProps: () => PositionerProps;
  useScrollbarVerticalProps: () => ScrollbarVerticalProps;
  useScrollbarHorizontalProps: () => ScrollbarHorizontalProps;
  useScrollAreaProps: () => ScrollAreaProps;
}

export interface VirtualizationApi {
  virtualization: {
    setVirtualization: (enabled: boolean) => void;
    setColumnVirtualization: (enabled: boolean) => void;
    handleScroll: (
      scrollPosition: { top: number; left: number },
      viewportSize: { width: number; height: number },
    ) => void;
    getScrollPosition: () => { top: number; left: number };
    getOffsetTop: () => number;
    getDimensions: () => {
      contentHeight: number;
      viewportInnerSize: Dimensions.State['dimensions']['viewportInnerSize'];
      rowsMeta: { positions: number[]; currentPageTotalHeight: number };
    };
    setRootRef: (element: HTMLElement | null) => void;
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

    const rootRef = React.useRef<HTMLElement | null>(null);

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

    const handleScroll = React.useCallback(
      (
        scrollPosition: { top: number; left: number },
        viewportSize: { width: number; height: number },
      ) => {
        const rootSize = {
          width: viewportSize.width,
          height: viewportSize.height,
        };

        if (
          virtualizerStore.state.rootSize.width !== rootSize.width ||
          virtualizerStore.state.rootSize.height !== rootSize.height
        ) {
          virtualizerStore.update({ rootSize });
          virtualizerApi.updateDimensions(true);
        }

        virtualizerStore.state.virtualization.scrollPosition.current = scrollPosition;
        virtualizerApi.forceUpdateRenderContext();
      },
      [virtualizerStore, virtualizerApi],
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

    const getDimensions = React.useCallback(() => {
      const dimensions = Dimensions.selectors.dimensions(
        virtualizerStore.state as unknown as BaseState,
      );
      const rowsMeta = Dimensions.selectors.rowsMeta(
        virtualizerStore.state as unknown as BaseState,
      );
      return {
        contentHeight: dimensions.contentSize.height,
        viewportInnerSize: dimensions.viewportInnerSize,
        rowsMeta,
      };
    }, [virtualizerStore]);

    const setRootRef = React.useCallback(
      (element: HTMLElement | null) => {
        rootRef.current = element;
        if (element) {
          const bounds = element.getBoundingClientRect();
          virtualizerStore.update({
            rootSize: { width: bounds.width, height: bounds.height },
          });
          virtualizerApi.updateDimensions(true);
        }
      },
      [virtualizerStore, virtualizerApi],
    );

    const forceUpdateRenderContext = React.useCallback(() => {
      virtualizerApi.forceUpdateRenderContext();
    }, [virtualizerApi]);

    React.useEffect(() => {
      setVirtualization(!params.disableVirtualization);
    }, [params.disableVirtualization, setVirtualization]);

    React.useEffect(() => {
      setColumnVirtualization(!params.disableColumnVirtualization);
    }, [params.disableColumnVirtualization, setColumnVirtualization]);

    const useRenderContextHook: VirtualizationHooks['useRenderContext'] = () => {
      return useStore(virtualizerStore, Virtualization.selectors.renderContext);
    };

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
          contentHeight: dimensionsState.contentSize.height,
          viewportInnerSize: dimensionsState.viewportInnerSize,
          rowsMeta: rowsMetaValue,
        }),
        [dimensionsState, rowsMetaValue],
      );
    };

    const useTotalContentSizeHook = (): { width: number; height: number } => {
      const visibleColumnsValue = useStore(store, api.columns.selectors.visibleColumns);
      const dimensionsState = useStore(virtualizerStore, Dimensions.selectors.dimensions);

      const width = React.useMemo(
        () => visibleColumnsValue.reduce((sum, col) => sum + (col.size ?? DEFAULT_COLUMN_WIDTH), 0),
        [visibleColumnsValue],
      );

      return { width, height: dimensionsState.contentSize.height };
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

    const useContainerPropsHook = (): ContainerProps => {
      return useStore(virtualizerStore, LayoutDataGrid.selectors.containerProps);
    };

    const useScrollerPropsHook = (): ScrollerProps => {
      return useStore(virtualizerStore, LayoutDataGrid.selectors.scrollerProps) as ScrollerProps;
    };

    const useContentPropsHook = (): ContentProps => {
      return useStore(virtualizerStore, LayoutDataGrid.selectors.contentProps) as ContentProps;
    };

    const usePositionerPropsHook = (): PositionerProps => {
      return useStore(
        virtualizerStore,
        LayoutDataGrid.selectors.positionerProps,
      ) as PositionerProps;
    };

    const useScrollbarVerticalPropsHook = (): ScrollbarVerticalProps => {
      return useStore(virtualizerStore, LayoutDataGrid.selectors.scrollbarVerticalProps);
    };

    const useScrollbarHorizontalPropsHook = (): ScrollbarHorizontalProps => {
      return useStore(virtualizerStore, LayoutDataGrid.selectors.scrollbarHorizontalProps);
    };

    const useScrollAreaPropsHook = (): ScrollAreaProps => {
      return useStore(virtualizerStore, LayoutDataGrid.selectors.scrollAreaProps);
    };

    return {
      virtualization: {
        setVirtualization,
        setColumnVirtualization,
        handleScroll,
        getScrollPosition,
        getOffsetTop,
        getDimensions,
        setRootRef,
        forceUpdateRenderContext,
        getVirtualizerStore,
        hooks: {
          useRenderContext: useRenderContextHook,
          useScrollPosition: useScrollPositionHook,
          useOffsetTop: useOffsetTopHook,
          useOffsetLeft: useOffsetLeftHook,
          useDimensions: useDimensionsHook,
          useTotalContentSize: useTotalContentSizeHook,
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
