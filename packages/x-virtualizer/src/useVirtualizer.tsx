import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { RefObject } from '@mui/x-internals/types';
import { Store } from '@mui/x-internals/store';
import { Dimensions } from './features/dimensions';
import { Virtualization } from './features/virtualization';
import type { RowId } from './models/core';
import type { RowSpacing, RowVisibilityParams } from './models/dimensions';

export * from './features/virtualization';

import {
  Column,
  FocusedCell,
  Size,
  PinnedRows,
  PinnedColumns,
  RenderContext,
  Row,
  RowEntry,
} from './models';

export type Virtualizer = ReturnType<typeof useVirtualizer>;
export type VirtualScrollerCompat = Virtualization.State['getters'];

export type BaseState = Virtualization.State & Dimensions.State;

type integer = number;

// FIXME
type RenderContextInputs = any;

export type VirtualizerParams = {
  scrollbarSize?: number;
  dimensions: {
    rowHeight: number;
    headerHeight: number;
    groupHeaderHeight: number;
    headerFilterHeight: number;
    columnsTotalWidth: number;
    headersTotalHeight: number;
    leftPinnedWidth: number;
    rightPinnedWidth: number;
  };

  initialState?: {
    scroll?: { top: number; left: number };
    dimensions?: Partial<Dimensions.State['dimensions']>;
    virtualization?: Partial<Virtualization.State['virtualization']>;
  };
  isRtl: boolean;
  /** current page rows */
  rows: RowEntry[];
  /** current page range */
  range: { firstRowIndex: integer; lastRowIndex: integer } | null;
  rowIdToIndexMap: Map<RowId, number>;
  rowCount: integer;
  columns: Column[];
  pinnedRows: PinnedRows;
  pinnedColumns: PinnedColumns;
  refs: {
    container: RefObject<HTMLDivElement | null>;
    scroller: RefObject<HTMLDivElement | null>;
    scrollbarVertical: RefObject<HTMLDivElement | null>;
    scrollbarHorizontal: RefObject<HTMLDivElement | null>;
  };
  hasColSpan: boolean;

  contentHeight: number;
  minimalContentHeight: number | string;
  needsHorizontalScrollbar: boolean;
  autoHeight: boolean;
  getRowHeight?: (params: any) => number | null | undefined | 'auto';
  /**
   * Function that returns the estimated height for a row.
   * Only works if dynamic row height is used.
   * Once the row height is measured this value is discarded.
   * @returns {number | null} The estimated row height value. If `null` or `undefined` then the default row height, based on the density, is applied.
   */
  getEstimatedRowHeight?: (rowEntry: RowEntry) => number | null;
  /**
   * Function that allows to specify the spacing between rows.
   * @param {GridRowSpacingParams} params With all properties from [[GridRowSpacingParams]].
   * @returns {GridRowSpacing} The row spacing values.
   */
  getRowSpacing?: (rowEntry: RowEntry, visibility: RowVisibilityParams) => RowSpacing;

  resizeThrottleMs: number;
  onResize?: (lastSize: Size) => void;
  onWheel?: (event: React.WheelEvent) => void;
  onTouchMove?: (event: React.TouchEvent) => void;

  focusedCell: FocusedCell | null;

  rowBufferPx: number;
  columnBufferPx: number;

  scrollReset?: any;

  fixme: {
    applyRowHeight: (entry: any, row: any) => void;
    focusedVirtualCell: () => any;
    onContextChange: (c: RenderContext) => void;
    inputs: (enabledForRows: boolean, enabledForColumns: boolean) => RenderContextInputs;
    onScrollChange: (scrollPosition: any, nextRenderContext: any) => void;
    rowTree: () => any;
    columnPositions: () => any;
    calculateColSpan: (params: {
      rowId: any;
      minFirstColumn: number;
      maxLastColumn: number;
      columns: Column[];
    }) => void;
    getRowHeight: (id: any) => number | 'auto';
    renderRow: (params: {
      id: any;
      model: Row;
      rowIndex: number;
      offsetLeft: number;
      columnsTotalWidth: number;
      baseRowHeight: number | 'auto';
      columns: Column[];
      firstColumnIndex: number;
      lastColumnIndex: number;
      focusedColumnIndex: number | undefined;
      isFirstVisible: boolean;
      isLastVisible: boolean;
      isVirtualFocusRow: boolean;
      showBottomBorder: boolean;
    }) => React.ReactElement;
    renderInfiniteLoadingTrigger: (id: any) => React.ReactElement;
  };
};

export const useVirtualizer = (params: VirtualizerParams) => {
  const store = useLazyRef(() => {
    const state = {
      ...Dimensions.initialize(params),
      ...Virtualization.initialize(params),
    };
    return new Store(state);
  }).current;

  const dimensions = Dimensions.use(store, params);
  const virtualization = Virtualization.use(store, params);

  /* Extra APIs moved here (could be reorganized in a separate file) */

  const getViewportPageSize = () => {
    const dimensions = Dimensions.selectors.dimensions(store.state);
    if (!dimensions.isReady) {
      return 0;
    }

    // TODO: Use a combination of scrollTop, dimensions.viewportInnerSize.height and rowsMeta.possitions
    // to find out the maximum number of rows that can fit in the visible part of the grid
    if (params.getRowHeight) {
      const renderContext = Virtualization.selectors.renderContext(store.state);
      const viewportPageSize = renderContext.lastRowIndex - renderContext.firstRowIndex;

      return Math.min(viewportPageSize - 1, params.rows.length);
    }

    const maximumPageSizeWithoutScrollBar = Math.floor(
      dimensions.viewportInnerSize.height / dimensions.rowHeight,
    );

    return Math.min(maximumPageSizeWithoutScrollBar, params.rows.length);
  };

  return {
    store,
    dimensions,
    virtualization,
    extra: {
      getViewportPageSize,
    },
  };
};
