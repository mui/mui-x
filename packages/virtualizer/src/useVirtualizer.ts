import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { integer } from '@mui/x-internals/types';
import { Store } from '@mui/x-internals/store';
import { Colspan } from './features/colspan';
import { Dimensions } from './features/dimensions';
import { Keyboard } from './features/keyboard';
import { Rowspan } from './features/rowspan';
import { Virtualization } from './features/virtualization';
import { DEFAULT_PARAMS } from './constants';
import type { Layout } from './features/virtualization/layout';
import type { HeightEntry, RowSpacing } from './models/dimensions';
import type { ColspanParams } from './features/colspan';
import type { DimensionsParams } from './features/dimensions';
import type { VirtualizationParams } from './features/virtualization';

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
export type VirtualScrollerCompat<L extends Layout = Layout> = Virtualization.State<L>['getters'];

export type BaseState<L extends Layout = Layout> = Virtualization.State<L> & Dimensions.State;

export type VirtualizerParams<L extends Layout = Layout> = {
  layout: L;

  dimensions: DimensionsParams;
  virtualization: VirtualizationParams;
  colspan?: ColspanParams;

  initialState?: {
    scroll?: { top: number; left: number };
    rowSpanning?: Rowspan.State['rowSpanning'];
    virtualization?: Partial<Virtualization.State<L>['virtualization']>;
  };
  /** current page rows */
  rows: RowEntry[];
  /** current page range */
  range: { firstRowIndex: integer; lastRowIndex: integer } | null;
  rowCount: integer;
  columns?: ColumnWithWidth[];
  pinnedRows?: PinnedRows;
  pinnedColumns?: PinnedColumns;

  disableHorizontalScroll?: boolean;
  disableVerticalScroll?: boolean;
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
   * @returns The row spacing values.
   */
  getRowSpacing?: (rowEntry: RowEntry) => RowSpacing;
  /** Update the row height values before they're used.
   * Used to add detail panel heights.
   * @param entry
   * @param rowEntry
   */
  applyRowHeight?: (entry: HeightEntry, rowEntry: RowEntry) => void;
  virtualizeColumnsWithAutoRowHeight?: boolean;

  resizeThrottleMs?: number;
  onResize?: (lastSize: Size) => void;
  onWheel?: (event: React.WheelEvent) => void;
  onTouchMove?: (event: React.TouchEvent) => void;
  onRenderContextChange?: (c: RenderContext) => void;
  onScrollChange?: (
    scrollPosition: { top: number; left: number },
    nextRenderContext: RenderContext,
  ) => void;

  focusedVirtualCell?: () => FocusedCell | null;

  scrollReset?: any;

  renderRow: (params: {
    id: any;
    model: Row;
    rowIndex: number;
    offsetLeft: number;
    columnsTotalWidth: number;
    baseRowHeight: number | 'auto';
    firstColumnIndex: number;
    lastColumnIndex: number;
    focusedColumnIndex: number | undefined;
    isFirstVisible: boolean;
    isLastVisible: boolean;
    isVirtualFocusRow: boolean;
    showBottomBorder: boolean;
  }) => React.ReactElement;
  renderInfiniteLoadingTrigger?: (id: any) => React.ReactElement;
};

type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type ParamsWithDefaults = RequiredFields<
  VirtualizerParams,
  'resizeThrottleMs' | 'columns'
> & {
  dimensions: RequiredFields<
    VirtualizerParams['dimensions'],
    | 'columnsTotalWidth'
    | 'leftPinnedWidth'
    | 'rightPinnedWidth'
    | 'topPinnedHeight'
    | 'bottomPinnedHeight'
    | 'autoHeight'
  >;
  virtualization: RequiredFields<
    VirtualizerParams['virtualization'],
    'isRtl' | 'rowBufferPx' | 'columnBufferPx'
  >;
};

const FEATURES = [Dimensions, Virtualization, Colspan, Rowspan, Keyboard] as const;

export const useVirtualizer = <L extends Layout = Layout>(params: VirtualizerParams<L>) => {
  const paramsWithDefault = mergeDefaults<ParamsWithDefaults>(params, DEFAULT_PARAMS);

  const store = useLazyRef(() => {
    return new Store(
      FEATURES.map((f) => f.initialize(paramsWithDefault)).reduce(
        (state, partial) => Object.assign(state, partial),
        {},
      ) as Dimensions.State &
        Virtualization.State<L> &
        Colspan.State &
        Rowspan.State &
        Keyboard.State,
    );
  }).current;

  const api = {} as Dimensions.API & Virtualization.API & Colspan.API & Rowspan.API & Keyboard.API;
  for (const feature of FEATURES) {
    Object.assign(api, feature.use(store, paramsWithDefault, api));
  }

  return {
    store,
    api,
  };
};

function mergeDefaults<T>(params: any, defaults: any): T {
  const result = { ...params };
  for (const key in defaults) {
    if (Object.hasOwn(defaults, key)) {
      const value = (defaults as any)[key];
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        (result as any)[key] = mergeDefaults((params as any)[key] ?? {}, value);
      } else {
        (result as any)[key] = (params as any)[key] ?? value;
      }
    }
  }
  return result;
}
