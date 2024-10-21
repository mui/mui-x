import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridGroupNode, GridRowId, GridRowTreeConfig } from '../../../models';
import {
  GRID_DEFAULT_STRATEGY,
  GridStrategyProcessor,
  useGridRegisterStrategyProcessor,
} from '../../core/strategyProcessing';
import { buildRootGroup, GRID_ROOT_GROUP_ID } from './gridRowsUtils';
import { GridRowsPartialUpdateAction, GridRowTreeCreationValue } from './gridRowsInterfaces';

const createFlatRowTree = (rows: GridRowId[]): GridRowTreeCreationValue => {
  const tree: GridRowTreeConfig = {
    [GRID_ROOT_GROUP_ID]: {
      ...buildRootGroup(),
      children: rows,
    },
  };

  for (let i = 0; i < rows.length; i += 1) {
    const rowId = rows[i];

    tree[rowId] = {
      id: rowId,
      depth: 0,
      parent: GRID_ROOT_GROUP_ID,
      type: 'leaf',
      groupingKey: null,
    };
  }

  return {
    groupingName: GRID_DEFAULT_STRATEGY,
    tree,
    treeDepths: { 0: rows.length },
    dataRowIds: rows,
  };
};

const updateFlatRowTree = ({
  previousTree,
  actions,
}: {
  previousTree: GridRowTreeConfig;
  actions: { [action in GridRowsPartialUpdateAction]: GridRowId[] };
}): GridRowTreeCreationValue => {
  const tree: GridRowTreeConfig = { ...previousTree };
  const idsToRemoveFromRootGroup: Record<GridRowId, true> = {};

  for (let i = 0; i < actions.remove.length; i += 1) {
    const idToDelete = actions.remove[i];
    idsToRemoveFromRootGroup[idToDelete] = true;
    delete tree[idToDelete];
  }

  for (let i = 0; i < actions.insert.length; i += 1) {
    const idToInsert = actions.insert[i];
    tree[idToInsert] = {
      id: idToInsert,
      depth: 0,
      parent: GRID_ROOT_GROUP_ID,
      type: 'leaf',
      groupingKey: null,
    };
  }

  // TODO rows v6: Support row unpinning

  const rootGroup = tree[GRID_ROOT_GROUP_ID] as GridGroupNode;
  let rootGroupChildren = [...rootGroup.children, ...actions.insert];
  if (Object.values(idsToRemoveFromRootGroup).length) {
    rootGroupChildren = rootGroupChildren.filter((id) => !idsToRemoveFromRootGroup[id]);
  }

  tree[GRID_ROOT_GROUP_ID] = {
    ...rootGroup,
    children: rootGroupChildren,
  };

  return {
    groupingName: GRID_DEFAULT_STRATEGY,
    tree,
    treeDepths: { 0: rootGroupChildren.length },
    dataRowIds: rootGroupChildren,
  };
};

const flatRowTreeCreationMethod: GridStrategyProcessor<'rowTreeCreation'> = (params) => {
  if (params.updates.type === 'full') {
    return createFlatRowTree(params.updates.rows);
  }

  return updateFlatRowTree({ previousTree: params.previousTree!, actions: params.updates.actions });
};

export const useGridRowsPreProcessors = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
) => {
  useGridRegisterStrategyProcessor(
    apiRef,
    GRID_DEFAULT_STRATEGY,
    'rowTreeCreation',
    flatRowTreeCreationMethod,
  );
};
