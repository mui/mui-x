import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { integer, RefObject } from '@mui/x-internals/types';
import { Store } from '@mui/x-internals/store';
import { Colspan } from './features/colspan';
import { Dimensions } from './features/dimensions';
import { Keyboard } from './features/keyboard';
import { Rowspan } from './features/rowspan';
import { Virtualization } from './features/virtualization';
import type { RowId } from './models/core';
import type { HeightEntry, RowSpacing, RowVisibilityParams } from './models/dimensions';
import type { DimensionsParams } from './features/dimensions';

import {
  ColumnWithWidth,
  FocusedCell,
  Size,
  PinnedRows,
  PinnedColumns,
  RenderContext,
  Row,
  RowEntry,
} from './models';

/* eslint-disable jsdoc/require-param-type */
/* eslint-disable jsdoc/require-param-description */
/* eslint-disable jsdoc/require-returns-type */

export type Virtualizer = ReturnType<typeof useVirtualizer>;
export type VirtualScrollerCompat = Virtualization.State['getters'];

export type BaseState = Virtualization.State & Dimensions.State;

export type VirtualizerParams = {
  scrollbarSize?: number;
  dimensions: DimensionsParams;

  initialState?: {
    scroll?: { top: number; left: number };
    dimensions?: Partial<Dimensions.State['dimensions']>;
    rowSpanning?: Rowspan.State['rowSpanning'];
    virtualization?: Partial<Virtualization.State['virtualization']>;
  };
  isRtl: boolean;
  /** current page rows */
  rows: RowEntry[];
  /** current page range */
  range: { firstRowIndex: integer; lastRowIndex: integer } | null;
  rowIdToIndexMap: Map<RowId, number>;
  rowCount: integer;
  columns: ColumnWithWidth[];
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
  autoHeight: boolean;
  getRowHeight?: (row: RowEntry) => number | null | undefined | 'auto';
  /**
   * Function that returns the estimated height for a row.
   * Only works if dynamic row height is used.
   * Once the row height is measured this value is discarded.
   * @param rowEntry
   * @returns The estimated row height value. If `null` or `undefined` then the default row height, based on the density, is applied.
   */
  getEstimatedRowHeight?: (rowEntry: RowEntry) => number | null;
  /**
   * Function that allows to specify the spacing between rows.
   * @param rowEntry
   * @param visibility With all properties from [[RowVisibilityParams]].
   * @returns The row spacing values.
   */
  getRowSpacing?: (rowEntry: RowEntry, visibility: RowVisibilityParams) => RowSpacing;
  /** Update the row height values before they're used.
   * Used to add detail panel heights.
   * @param entry
   * @param rowEntry
   */
  applyRowHeight?: (entry: HeightEntry, rowEntry: RowEntry) => void;
  virtualizeColumnsWithAutoRowHeight?: boolean;

  resizeThrottleMs: number;
  onResize?: (lastSize: Size) => void;
  onWheel?: (event: React.WheelEvent) => void;
  onTouchMove?: (event: React.TouchEvent) => void;
  onRenderContextChange?: (c: RenderContext) => void;
  onScrollChange?: (
    scrollPosition: { top: number; left: number },
    nextRenderContext: RenderContext,
  ) => void;

  focusedVirtualCell: () => FocusedCell | null;

  rowBufferPx: number;
  columnBufferPx: number;

  scrollReset?: any;

  getColspan: (rowId: RowId, column: ColumnWithWidth, columnIndex: integer) => number;

  renderRow: (params: {
    id: any;
    model: Row;
    rowIndex: number;
    offsetLeft: number;
    columnsTotalWidth: number;
    baseRowHeight: number | 'auto';
    columns: ColumnWithWidth[];
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

const FEATURES = [Dimensions, Virtualization, Colspan, Rowspan, Keyboard] as const;

export const useVirtualizer = (params: VirtualizerParams) => {
  const store = useLazyRef(() => {
    return new Store(
      FEATURES.map((f) => f.initialize(params)).reduce(
        (state, partial) => Object.assign(state, partial),
        {},
      ) as Dimensions.State & Virtualization.State & Colspan.State & Rowspan.State & Keyboard.State,
    );
  }).current;

  const api = {} as Dimensions.API & Virtualization.API & Colspan.API & Rowspan.API & Keyboard.API;
  for (const feature of FEATURES) {
    Object.assign(api, feature.use(store, params, api));
  }

  return {
    store,
    api,
  };
};
