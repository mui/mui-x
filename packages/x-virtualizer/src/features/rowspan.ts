import { Store } from '@mui/x-internals/store';
import type { BaseState, ParamsWithDefaults } from '../useVirtualizer';
import type { RowRange } from '../models';
import type { RowSpanningState, RowSpanningCaches } from '../models/rowspan';
import { Virtualization } from './virtualization';

/* eslint-disable import/export, @typescript-eslint/no-redeclare */

const EMPTY_RANGE: RowRange = { firstRowIndex: 0, lastRowIndex: 0 };
const EMPTY_CACHES: RowSpanningCaches = {
  spannedCells: {},
  hiddenCells: {},
  hiddenCellOriginMap: {},
};

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

function initializeState(params: ParamsWithDefaults): Rowspan.State {
  return {
    rowSpanning: params.initialState?.rowSpanning ?? {
      caches: EMPTY_CACHES,
      processedRange: EMPTY_RANGE,
    },
  };
}

function useRowspan(
  store: Store<BaseState & Rowspan.State>,
  _params: ParamsWithDefaults,
  _api: Virtualization.API,
) {
  const getHiddenCellsOrigin = () => selectors.hiddenCellsOriginMap(store.state);

  return { getHiddenCellsOrigin };
}
