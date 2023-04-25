import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import {
  GRID_DEFAULT_STRATEGY,
  GridStrategyProcessor,
  useGridRegisterStrategyProcessor,
} from '../../core/strategyProcessing';

export function useGridVisibleRowsLookup(apiRef: React.MutableRefObject<GridPrivateApiCommunity>) {
  const updateVisibleRowsLookup = React.useCallback(() => {
    apiRef.current.setState((state) => {
      const visibleRowsLookup = apiRef.current.applyStrategyProcessor('visibleRowsLookup', {
        tree: state.rows.tree,
        filteredRowsLookup: state.filter.filteredRowsLookup,
      });
      return {
        ...state,
        visibleRowsLookup,
      };
    });
    apiRef.current.forceUpdate();
  }, [apiRef]);

  const getVisibleRowsLookup = React.useCallback<GridStrategyProcessor<'visibleRowsLookup'>>(
    (params) => {
      // For flat tree, the `visibleRowsLookup` and the `filteredRowsLookup` are equals since no row is collapsed.
      return params.filteredRowsLookup;
    },
    [],
  );

  useGridRegisterStrategyProcessor(
    apiRef,
    GRID_DEFAULT_STRATEGY,
    'visibleRowsLookup',
    getVisibleRowsLookup,
  );
  useGridApiEventHandler(apiRef, 'rowExpansionChange', updateVisibleRowsLookup);
  useGridApiEventHandler(apiRef, 'filteredRowsSet', updateVisibleRowsLookup);
}
