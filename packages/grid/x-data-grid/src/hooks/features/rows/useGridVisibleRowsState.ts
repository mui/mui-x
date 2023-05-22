import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import {
  GRID_DEFAULT_STRATEGY,
  GridStrategyProcessor,
  useGridRegisterStrategyProcessor,
} from '../../core/strategyProcessing';
import type { GridStateInitializer } from '../../utils/useGridInitializeState';

export const visibleRowsStateInitializer: GridStateInitializer = (state) => {
  return {
    ...state,
    visibleRows: {
      lookup: {},
    },
  };
};

const getVisibleRows: GridStrategyProcessor<'visibleRows'> = (params) => {
  // For flat tree, the `visibleRowsLookup` and the `filteredRowsLookup` are equals since no row is collapsed.
  return {
    lookup: params.filteredRowsLookup,
  };
};

export function useGridVisibleRowsState(apiRef: React.MutableRefObject<GridPrivateApiCommunity>) {
  const updateVisibleRowsState = React.useCallback(() => {
    apiRef.current.setState((state) => {
      const visibleRowsState = apiRef.current.applyStrategyProcessor('visibleRows', {
        tree: state.rows.tree,
        filteredRowsLookup: state.filter.filteredRowsLookup,
      });
      return {
        ...state,
        visibleRows: visibleRowsState,
      };
    });
    apiRef.current.forceUpdate();
  }, [apiRef]);

  useGridRegisterStrategyProcessor(apiRef, GRID_DEFAULT_STRATEGY, 'visibleRows', getVisibleRows);
  useGridApiEventHandler(apiRef, 'rowExpansionChange', updateVisibleRowsState);
  useGridApiEventHandler(apiRef, 'filteredRowsSet', updateVisibleRowsState);
}
