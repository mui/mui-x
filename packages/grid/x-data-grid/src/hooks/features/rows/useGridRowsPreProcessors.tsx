import * as React from 'react';

import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridRowTreeConfig } from '../../../models';
import {
  GRID_DEFAULT_STRATEGY,
  GridStrategyProcessor,
  useGridRegisterStrategyProcessor,
} from '../../core/strategyProcessing';

const flatRowTreeCreationMethod: GridStrategyProcessor<'rowTreeCreation'> = ({
  ids,
  idRowsLookup,
  idToIdLookup,
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
    idToIdLookup,
    ids,
  };
};

export const useGridRowsPreProcessors = (apiRef: React.MutableRefObject<GridApiCommunity>) => {
  useGridRegisterStrategyProcessor(
    apiRef,
    GRID_DEFAULT_STRATEGY,
    'rowTreeCreation',
    flatRowTreeCreationMethod,
  );
};
