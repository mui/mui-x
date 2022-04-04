import * as React from 'react';

import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridEvents, GridRowTreeConfig } from '../../../models';
import {
  GRID_DEFAULT_STRATEGY,
  GridStrategyProcessor,
  useGridRegisterStrategyProcessor,
} from '../../core/strategyProcessing';
import { useGridRegisterPipeApplier } from '../../core/pipeProcessing/useGridRegisterPipeApplier';

const flatRowTreeCreationMethod: GridStrategyProcessor<'rowTreeCreation'> = ({
  ids,
  idRowsLookup,
  previousTree,
}) => {
  const tree: GridRowTreeConfig = {};
  for (let i = 0; i < ids.length; i += 1) {
    const rowId = ids[i];

    if (previousTree && previousTree[rowId]) {
      tree[rowId] = previousTree[rowId];
    } else {
      tree[rowId] = { id: rowId, depth: 0, parent: null, groupingKey: '', groupingField: null };
    }
  }

  return {
    groupingName: GRID_DEFAULT_STRATEGY,
    tree,
    treeDepth: 1,
    idRowsLookup,
    ids,
  };
};

export const useGridRowsPreProcessors = (apiRef: React.MutableRefObject<GridApiCommunity>) => {
  const applyHydrateRowsProcessor = React.useCallback(() => {
    apiRef.current.setState((state) => ({
      ...state,
      rows: {
        ...state.rows,
        ...apiRef.current.unstable_applyPipeProcessors(
          'hydrateRows',
          state.rows.groupingResponseBeforeRowHydration,
        ),
      },
    }));
    apiRef.current.publishEvent(GridEvents.rowsSet);
    apiRef.current.forceUpdate();
  }, [apiRef]);

  useGridRegisterPipeApplier(apiRef, 'hydrateRows', applyHydrateRowsProcessor);

  useGridRegisterStrategyProcessor(
    apiRef,
    GRID_DEFAULT_STRATEGY,
    'rowTreeCreation',
    flatRowTreeCreationMethod,
  );
};
