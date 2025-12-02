import { Store } from '@mui/x-internals/store';
import type { BaseState, ParamsWithDefaults } from '../useVirtualizer';
import { Dimensions } from './dimensions';
import { Virtualization } from './virtualization';

/* eslint-disable import/export, @typescript-eslint/no-redeclare */

const selectors = {};

export const Keyboard = {
  initialize: initializeState,
  use: useKeyboard,
  selectors,
};
export namespace Keyboard {
  export type State = {};
  export type API = ReturnType<typeof useKeyboard>;
}

function initializeState(_params: ParamsWithDefaults): Keyboard.State {
  return {};
}

function useKeyboard(
  store: Store<BaseState & Keyboard.State>,
  params: ParamsWithDefaults,
  _api: {},
) {
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
    getViewportPageSize,
  };
}
