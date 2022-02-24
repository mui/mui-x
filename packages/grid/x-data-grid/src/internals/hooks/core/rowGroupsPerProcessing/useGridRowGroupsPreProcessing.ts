import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridRowTreeConfig } from '../../../models/gridRows';
import {
  GridRowGroupsPreProcessingApi,
  GridRowGroupingPreProcessing,
  GridRowGroupingResult,
} from './gridRowGroupsPreProcessingApi';
import { GridEvents } from '../../../models/events';
import { useGridApiMethod } from '../../utils/useGridApiMethod';

const getFlatRowTree: GridRowGroupingPreProcessing = ({ ids, idRowsLookup, previousTree }) => {
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

export const useGridRowGroupsPreProcessing = (apiRef: React.MutableRefObject<GridApiCommunity>) => {
  const rowGroupsPreProcessingRef = React.useRef(
    new Map<string, GridRowGroupingPreProcessing | null>(),
  );

  const registerRowGroupsBuilder = React.useCallback<
    GridRowGroupsPreProcessingApi['unstable_registerRowGroupsBuilder']
  >(
    (processingName, rowGroupingPreProcessing) => {
      const rowGroupingPreProcessingBefore =
        rowGroupsPreProcessingRef.current.get(processingName) ?? null;

      if (rowGroupingPreProcessingBefore !== rowGroupingPreProcessing) {
        rowGroupsPreProcessingRef.current.set(processingName, rowGroupingPreProcessing);
        apiRef.current.publishEvent(GridEvents.rowGroupsPreProcessingChange);
      }
    },
    [apiRef],
  );

  const groupRows = React.useCallback<GridRowGroupsPreProcessingApi['unstable_groupRows']>(
    (...params) => {
      let response: GridRowGroupingResult | null = null;
      const preProcessingList = Array.from(rowGroupsPreProcessingRef.current.values());

      while (!response && preProcessingList.length) {
        const preProcessing = preProcessingList.shift();

        if (preProcessing) {
          response = preProcessing(...params);
        }
      }

      if (!response) {
        return getFlatRowTree(...params)!;
      }

      return response;
    },
    [],
  );

  const rowGroupsPreProcessingApi: GridRowGroupsPreProcessingApi = {
    unstable_registerRowGroupsBuilder: registerRowGroupsBuilder,
    unstable_groupRows: groupRows,
  };

  useGridApiMethod(apiRef, rowGroupsPreProcessingApi, 'GridRowGroupsPreProcessing');
};
