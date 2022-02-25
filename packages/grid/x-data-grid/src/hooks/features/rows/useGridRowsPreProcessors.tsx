import * as React from 'react';

import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridRowTreeConfig } from '../../../models';
import {
  GridStrategyProcessor,
  useGridRegisterStrategyProcessor,
} from '../../core/strategyProcessing';

const getFlatRowTree: GridStrategyProcessor<'rowTreeCreation'> = ({
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
    groupingName: 'none',
    tree,
    treeDepth: 1,
    idRowsLookup,
    ids,
  };
};

export const useGridRowsPreProcessors = (apiRef: React.MutableRefObject<GridApiCommunity>) => {
  useGridRegisterStrategyProcessor(apiRef, 'none', 'rowTreeCreation', getFlatRowTree);
};
