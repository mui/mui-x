import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridRowTreeConfig } from '../../../models/gridRows';
import {
  GridRowGroupsPreProcessingApi,
  GridRowGroupingPreProcessing,
  GridRowGroupingResult,
} from './gridRowGroupsPreProcessingApi';
import { GridEvents } from '../../../constants/eventsConstants';
import { useGridApiMethod } from '../../utils/useGridApiMethod';

const getFlatRowTree: GridRowGroupingPreProcessing = ({ ids, idRowsLookup }) => {
  const tree: GridRowTreeConfig = {};
  for (let i = 0; i < ids.length; i += 1) {
    const rowId = ids[i];
    tree[rowId] = { id: rowId, depth: 0, parent: null, groupingValue: '' };
  }

  return {
    tree,
    treeDepth: 1,
    idRowsLookup,
    ids,
  };
};

export const useGridRowGroupsPreProcessing = (apiRef: GridApiRef) => {
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
