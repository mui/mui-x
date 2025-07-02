import { Store } from '@mui/x-internals/store';
import type { integer } from '@mui/x-internals/types';
import type { BaseState, VirtualizerParams } from '../useVirtualizer';
import type { ColumnWithWidth, RowId, RowRange } from '../models';
import type { RowSpanningState, RowSpanningCaches } from '../models/rowspan';
import { Virtualization } from './virtualization';

const EMPTY_RANGE: RowRange = { firstRowIndex: 0, lastRowIndex: 0 };
const createEmptyState = () =>
  ({ spannedCells: {}, hiddenCells: {}, hiddenCellOriginMap: {} }) as RowSpanningCaches;

/**
 * Default number of rows to process during state initialization to avoid flickering.
 * Number `20` is arbitrarily chosen to be large enough to cover most of the cases without
 * compromising performance.
 */
const DEFAULT_ROWS_TO_PROCESS = 20;

const selectors = {
  state: (state: Rowspan.State) => state.rowSpanning,
  hiddenCells: (state: Rowspan.State) => state.rowSpanning.caches.hiddenCells,
  spannedCells: (state: Rowspan.State) => state.rowSpanning.caches.spannedCells,
  hiddenCellsOriginMap: (state: Rowspan.State) => state.rowSpanning.caches.hiddenCellOriginMap,
};

export const Rowspan = {
  initialize: initializeState,
  use: useRowspan,
  selectors,
};
export namespace Rowspan {
  export type State = {
    rowSpanning: RowSpanningState;
  };
  export type API = ReturnType<typeof useRowspan>;
}

function initializeState(params: VirtualizerParams): Rowspan.State {
  return {
    rowSpanning: params.initialState?.rowSpanning ?? {
      caches: createEmptyState(),
      processedRange: EMPTY_RANGE,
    },
  };
}

function useRowspan(
  store: Store<BaseState & Rowspan.State>,
  params: VirtualizerParams,
  api: Virtualization.API,
) {
  return {};
}
