import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { RefObject } from '@mui/x-internals/types';
import { Store } from '@mui/x-internals/store';
import { Virtualization } from './features/virtualization';

export * from './features/virtualization';

import {
  Column,
  FocusedCell,
  Size,
  PinnedRows,
  PinnedColumns,
  GridRenderContext,
  Row,
  RowEntry,
} from './models';

export type VirtualScroller = ReturnType<typeof useVirtualizer>;
export type VirtualScrollerUse = ReturnType<VirtualScroller['virtualization']['use']>;

export type VirtualizerState = Virtualization.State;

// FIXME
type RenderContextInputs = any;

export type VirtualizerParams = {
  initialState?: {
    virtualization?: Partial<Virtualization.State['virtualization']>;
    scroll?: { top: number; left: number };
  };
  isRtl: boolean;
  rows: RowEntry[];
  /** current page range */
  range: { firstRowIndex: number; lastRowIndex: number } | null;
  columns: Column[];
  pinnedRows: PinnedRows;
  pinnedColumns: PinnedColumns;
  refs: {
    main: RefObject<HTMLElement | null>;
    scroller: RefObject<HTMLElement | null>;
    scrollbarVertical: RefObject<HTMLElement | null>;
    scrollbarHorizontal: RefObject<HTMLElement | null>;
  };
  hasColSpan: boolean;

  rowHeight: number;
  contentHeight: number;
  minimalContentHeight: number | string;
  columnsTotalWidth: number;
  needsHorizontalScrollbar: boolean;
  autoHeight: boolean;

  onResize?: (lastSize: Size) => void;
  onWheel?: (event: React.WheelEvent) => void;
  onTouchMove?: (event: React.TouchEvent) => void;

  focusedCell: FocusedCell | null;

  rowBufferPx: number;
  columnBufferPx: number;

  scrollReset?: any;

  fixme: {
    dimensions: () => any;
    onContextChange: (c: GridRenderContext) => void;
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
      ...Virtualization.state(params),
    };
    return new Store(state);
  }).current;

  const virtualization = Virtualization.use(store, params);

  return {
    store,
    virtualization,
  };
};
