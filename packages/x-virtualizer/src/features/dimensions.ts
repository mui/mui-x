import * as React from 'react';
import { Store } from '@mui/x-internals/store';
import { Size, DimensionsState } from '../models';
import type { VirtualizerParams } from '../useVirtualizer';
import type { CoreState } from '../useVirtualizer';

const EMPTY_SIZE: Size = { width: 0, height: 0 };
const EMPTY_DIMENSIONS: DimensionsState = {
  isReady: false,
  root: EMPTY_SIZE,
  viewportOuterSize: EMPTY_SIZE,
  viewportInnerSize: EMPTY_SIZE,
  contentSize: EMPTY_SIZE,
  minimumSize: EMPTY_SIZE,
  hasScrollX: false,
  hasScrollY: false,
  scrollbarSize: 0,
  headerHeight: 0,
  groupHeaderHeight: 0,
  headerFilterHeight: 0,
  rowWidth: 0,
  rowHeight: 0,
  columnsTotalWidth: 0,
  leftPinnedWidth: 0,
  rightPinnedWidth: 0,
  headersTotalHeight: 0,
  topContainerHeight: 0,
  bottomContainerHeight: 0,
};

export const Dimensions = {
  initialize: initializeState,
  use: useDimensions,
};
export namespace Dimensions {
  export type State = {
    dimensions: DimensionsState;
  };
}

function initializeState(params: VirtualizerParams) {
  const dimensions = EMPTY_DIMENSIONS;

  return {
    dimensions: {
      ...dimensions,
      ...params.dimensions,
    },
  };
}

function useDimensions(store: Store<CoreState>, params: VirtualizerParams) {
  const errorShown = React.useRef(false);
  const rootDimensionsRef = React.useRef(EMPTY_SIZE);

  const {
    dimensions: { columnsTotalWidth },
  } = params;
}
