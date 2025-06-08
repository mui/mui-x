import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useRtl } from '@mui/system/RtlProvider';
import { RefObject } from '@mui/x-internals/types';
import { useVirtualizer, EMPTY_RENDER_CONTEXT } from '@mui/x-virtualizer';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import {
  gridDimensionsSelector,
  gridColumnsTotalWidthSelector,
  gridContentHeightSelector,
  gridHasFillerSelector,
  gridRowHeightSelector,
  gridVerticalScrollbarWidthSelector,
} from '../dimensions/gridDimensionsSelectors';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { useGridSelector } from '../../utils/useGridSelector';
import {
  gridVisibleColumnDefinitionsSelector,
  gridVisiblePinnedColumnDefinitionsSelector,
  gridColumnPositionsSelector,
  gridHasColSpanSelector,
} from '../columns/gridColumnsSelector';
import { gridPinnedRowsSelector, gridRowTreeSelector } from '../rows/gridRowsSelector';
import { useGridVisibleRows, getVisibleRows } from '../../utils/useGridVisibleRows';
import { useGridEventPriority } from '../../utils';
import { type GridRenderContext } from '../../../models';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { gridRowsMetaSelector } from '../rows/gridRowsMetaSelector';
import {
  gridRenderContextSelector,
  gridVirtualizationRowEnabledSelector,
  gridVirtualizationColumnEnabledSelector,
} from './gridVirtualizationSelectors';
import { gridRowSpanningHiddenCellsOriginMapSelector } from '../rows/gridRowSpanningSelectors';
import { gridListColumnSelector } from '../listView/gridListViewSelectors';
import { minimalContentHeight } from '../rows/gridRowsUtils';
import { EMPTY_PINNED_COLUMN_FIELDS, GridPinnedColumns } from '../columns';
import { gridFocusedVirtualCellSelector } from './gridFocusedVirtualCellSelector';
import { isJSDOM } from '../../../utils/isJSDOM';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { gridRowSelectionManagerSelector } from '../rowSelection';

type RootProps = DataGridProcessedProps;

export type GridVirtualizationState = {
  enabled: boolean;
  enabledForColumns: boolean;
  enabledForRows: boolean;
  renderContext: GridRenderContext;
};

export const virtualizationStateInitializer: GridStateInitializer<RootProps> = (state, props) => {
  const { disableVirtualization, autoHeight } = props;

  const virtualization = {
    enabled: !disableVirtualization,
    enabledForColumns: !disableVirtualization,
    enabledForRows: !disableVirtualization && !autoHeight,
    renderContext: EMPTY_RENDER_CONTEXT,
  };

  return {
    ...state,
    virtualization,
  };
};

export function useGridVirtualization(
  apiRef: RefObject<GridPrivateApiCommunity>,
  rootProps: RootProps,
): void {
  /*
   * API METHODS
   */

  const setVirtualization = (enabled: boolean) => {
    apiRef.current.setState((state) => ({
      ...state,
      virtualization: {
        ...state.virtualization,
        enabled,
        enabledForColumns: enabled,
        enabledForRows: enabled && !rootProps.autoHeight,
      },
    }));
  };

  const setColumnVirtualization = (enabled: boolean) => {
    apiRef.current.setState((state) => ({
      ...state,
      virtualization: {
        ...state.virtualization,
        enabledForColumns: enabled,
      },
    }));
  };

  /*
   * Virtualizer setup
   */

  const isRtl = useRtl();
  const { listView } = rootProps;
  const visibleColumns = useGridSelector(apiRef, () =>
    listView ? [gridListColumnSelector(apiRef)!] : gridVisibleColumnDefinitionsSelector(apiRef),
  );

  const enabledForRows = useGridSelector(apiRef, gridVirtualizationRowEnabledSelector) && !isJSDOM;
  const enabledForColumns =
    useGridSelector(apiRef, gridVirtualizationColumnEnabledSelector) && !isJSDOM;

  const pinnedRows = useGridSelector(apiRef, gridPinnedRowsSelector);
  const pinnedColumns = listView
    ? (EMPTY_PINNED_COLUMN_FIELDS as unknown as GridPinnedColumns)
    : gridVisiblePinnedColumnDefinitionsSelector(apiRef);

  const rowSelectionManager = useGridSelector(apiRef, gridRowSelectionManagerSelector);
  const isRowSelected = (id: any) =>
    rowSelectionManager.has(id) && apiRef.current.isRowSelectable(id);

  const currentPage = useGridVisibleRows(apiRef);

  const hasColSpan = useGridSelector(apiRef, gridHasColSpanSelector);

  /* TODO: extract dimensions code */
  const rowHeight = useGridSelector(apiRef, gridRowHeightSelector);
  const contentHeight = useGridSelector(apiRef, gridContentHeightSelector);
  const columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  const needsHorizontalScrollbar = useGridSelector(apiRef, needsHorizontalScrollbarSelector);
  const verticalScrollbarWidth = useGridSelector(apiRef, gridVerticalScrollbarWidthSelector);
  const hasFiller = useGridSelector(apiRef, gridHasFillerSelector);
  const autoHeight = rootProps.autoHeight;

  const renderContext = useGridSelector(apiRef, gridRenderContextSelector);

  const focusedVirtualCell = useGridSelector(apiRef, gridFocusedVirtualCellSelector);

  const scrollReset = listView;

  const virtualScroller = useVirtualizer({
    initialState: rootProps.initialState,
    isRtl,
    rows: currentPage.rows,
    range: currentPage.range,
    columns: visibleColumns,
    enabledForRows,
    enabledForColumns,
    pinnedRows,
    pinnedColumns,
    isRowSelected,
    refs: {
      main: apiRef.current.mainElementRef,
      scroller: apiRef.current.virtualScrollerRef,
      scrollbarVertical: apiRef.current.virtualScrollbarVerticalRef,
      scrollbarHorizontal: apiRef.current.virtualScrollbarHorizontalRef,
    },
    hasColSpan,
    rowHeight,
    contentHeight,
    minimalContentHeight,
    columnsTotalWidth,
    needsHorizontalScrollbar: needsHorizontalScrollbar && !listView,
    verticalScrollbarWidth,
    hasFiller,
    autoHeight,

    renderContext,
    focusedCell: focusedVirtualCell,
    rowBufferPx: rootProps.rowBufferPx,
    columnBufferPx: rootProps.columnBufferPx,

    onResize: useEventCallback((lastSize) => apiRef.current.publishEvent('resize', lastSize)),
    onWheel: useEventCallback((event: React.WheelEvent) => {
      apiRef.current.publishEvent('virtualScrollerWheel', {}, event);
    }),
    onTouchMove: useEventCallback((event: React.TouchEvent) => {
      apiRef.current.publishEvent('virtualScrollerTouchMove', {}, event);
    }),

    scrollReset,

    fixme: {
      dimensions: () => apiRef.current.state.dimensions,
      renderContext: () => apiRef.current.state.virtualization.renderContext,
      setRenderContext: (nextRenderContext: GridRenderContext) => {
        apiRef.current.setState((state) => {
          return {
            ...state,
            virtualization: {
              ...state.virtualization,
              renderContext: nextRenderContext,
            },
          };
        });
      },
      onContextChange: (nextRenderContext) =>
        apiRef.current.publishEvent('renderedRowsIntervalChange', nextRenderContext),
      inputs: () => inputsSelector(apiRef, rootProps, enabledForRows, enabledForColumns),
      onScrollChange: (scrollPosition, nextRenderContext) => {
        apiRef.current.publishEvent('scrollPositionChange', {
          top: scrollPosition.current.top,
          left: scrollPosition.current.left,
          renderContext: nextRenderContext,
        });
      },

      rowTree: () => gridRowTreeSelector(apiRef),
      columnPositions: () => gridColumnPositionsSelector(apiRef),

      calculateColSpan: (params) => apiRef.current.calculateColSpan(params),

      getRowHeight: (id) =>
        !apiRef.current.rowHasAutoHeight(id) ? apiRef.current.unstable_getRowHeight(id) : 'auto',

      renderRow: ({
        id,
        model,
        rowIndex,
        offsetLeft,
        columnsTotalWidth,
        baseRowHeight,
        columns,
        firstColumnIndex,
        lastColumnIndex,
        focusedColumnIndex,
        isFirstVisible,
        isLastVisible,
        isVirtualFocusRow,
        showBottomBorder,
      }) => (
        <rootProps.slots.row
          key={id}
          row={model}
          rowId={id}
          index={rowIndex}
          selected={isRowSelected(id)}
          offsetLeft={offsetLeft}
          columnsTotalWidth={columnsTotalWidth}
          rowHeight={baseRowHeight}
          pinnedColumns={pinnedColumns}
          visibleColumns={columns}
          firstColumnIndex={firstColumnIndex}
          lastColumnIndex={lastColumnIndex}
          focusedColumnIndex={focusedColumnIndex}
          isFirstVisible={isFirstVisible}
          isLastVisible={isLastVisible}
          isNotVisible={isVirtualFocusRow}
          showBottomBorder={showBottomBorder}
          scrollbarWidth={verticalScrollbarWidth}
          gridHasFiller={hasFiller}
          {...rootProps.slotProps?.row}
        />
      ),
      renderInfiniteLoadingTrigger: (id) =>
        (apiRef as any).current.getInfiniteLoadingTriggerElement?.({ lastRowId: id }),
    },
  });

  const forceUpdateRenderContext = virtualScroller.forceUpdateRenderContext;

  apiRef.current.register('private', {
    updateRenderContext: forceUpdateRenderContext,
  });

  useGridEventPriority(apiRef, 'sortedRowsSet', forceUpdateRenderContext);
  useGridEventPriority(apiRef, 'paginationModelChange', forceUpdateRenderContext);
  useGridEventPriority(apiRef, 'columnsChange', forceUpdateRenderContext);

  const api = {
    virtualScroller,
    unstable_setVirtualization: setVirtualization,
    unstable_setColumnVirtualization: setColumnVirtualization,
  };

  useGridApiMethod(apiRef, api, 'public');

  /*
   * EFFECTS
   */

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    setVirtualization(!rootProps.disableVirtualization);
  }, [rootProps.disableVirtualization, rootProps.autoHeight]);
  /* eslint-enable react-hooks/exhaustive-deps */
}

function needsHorizontalScrollbarSelector(apiRef: RefObject<GridApiCommunity>) {
  return (
    apiRef.current.state.dimensions.viewportOuterSize.width > 0 &&
    apiRef.current.state.dimensions.columnsTotalWidth >
      apiRef.current.state.dimensions.viewportOuterSize.width
  );
}

function areRenderContextsEqual(context1: GridRenderContext, context2: GridRenderContext) {
  if (context1 === context2) {
    return true;
  }
  return (
    context1.firstRowIndex === context2.firstRowIndex &&
    context1.lastRowIndex === context2.lastRowIndex &&
    context1.firstColumnIndex === context2.firstColumnIndex &&
    context1.lastColumnIndex === context2.lastColumnIndex
  );
}

type RenderContextInputs = {
  enabledForRows: boolean;
  enabledForColumns: boolean;
  apiRef: RefObject<GridPrivateApiCommunity>;
  autoHeight: boolean;
  rowBufferPx: number;
  columnBufferPx: number;
  leftPinnedWidth: number;
  columnsTotalWidth: number;
  viewportInnerWidth: number;
  viewportInnerHeight: number;
  lastRowHeight: number;
  lastColumnWidth: number;
  rowsMeta: ReturnType<typeof gridRowsMetaSelector>;
  columnPositions: ReturnType<typeof gridColumnPositionsSelector>;
  rows: ReturnType<typeof useGridVisibleRows>['rows'];
  range: ReturnType<typeof useGridVisibleRows>['range'];
  pinnedColumns: ReturnType<typeof gridVisiblePinnedColumnDefinitionsSelector>;
  columns: ReturnType<typeof gridVisibleColumnDefinitionsSelector>;
  hiddenCellsOriginMap: ReturnType<typeof gridRowSpanningHiddenCellsOriginMapSelector>;
  listView: boolean;
  virtualizeColumnsWithAutoRowHeight: DataGridProcessedProps['virtualizeColumnsWithAutoRowHeight'];
};

function inputsSelector(
  apiRef: RefObject<GridPrivateApiCommunity>,
  rootProps: ReturnType<typeof useGridRootProps>,
  enabledForRows: boolean,
  enabledForColumns: boolean,
): RenderContextInputs {
  const dimensions = gridDimensionsSelector(apiRef);
  const currentPage = getVisibleRows(apiRef, rootProps);
  const columns = rootProps.listView
    ? [gridListColumnSelector(apiRef)!]
    : gridVisibleColumnDefinitionsSelector(apiRef);
  const hiddenCellsOriginMap = gridRowSpanningHiddenCellsOriginMapSelector(apiRef);
  const lastRowId = apiRef.current.state.rows.dataRowIds.at(-1);
  const lastColumn = columns.at(-1);
  return {
    enabledForRows,
    enabledForColumns,
    apiRef,
    autoHeight: rootProps.autoHeight,
    rowBufferPx: rootProps.rowBufferPx,
    columnBufferPx: rootProps.columnBufferPx,
    leftPinnedWidth: dimensions.leftPinnedWidth,
    columnsTotalWidth: dimensions.columnsTotalWidth,
    viewportInnerWidth: dimensions.viewportInnerSize.width,
    viewportInnerHeight: dimensions.viewportInnerSize.height,
    lastRowHeight: lastRowId !== undefined ? apiRef.current.unstable_getRowHeight(lastRowId) : 0,
    lastColumnWidth: lastColumn?.computedWidth ?? 0,
    rowsMeta: gridRowsMetaSelector(apiRef),
    columnPositions: gridColumnPositionsSelector(apiRef),
    rows: currentPage.rows,
    range: currentPage.range,
    pinnedColumns: gridVisiblePinnedColumnDefinitionsSelector(apiRef),
    columns,
    hiddenCellsOriginMap,
    listView: rootProps.listView ?? false,
    virtualizeColumnsWithAutoRowHeight: rootProps.virtualizeColumnsWithAutoRowHeight,
  };
}
