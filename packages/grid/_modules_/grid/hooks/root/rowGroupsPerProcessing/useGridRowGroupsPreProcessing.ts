import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import {
  GridRowGroupsPreProcessingApi,
  RowGroupingFunction,
} from './gridRowGroupsPreProcessingApi';
import { GridEvents } from '../../../constants/eventsConstants';
import { useGridApiMethod } from '../useGridApiMethod';

const getFlatRowTree: RowGroupingFunction = (params) => ({
  tree: new Map(params.ids.map((id) => [id.toString(), { id, depth: 0 }])),
  paths: Object.fromEntries(params.ids.map((id) => [id, [id.toString()]])),
});

/**
 * TODO: Improve to be able to have several hooks registering and unregistering grouping method
 * We should never have two hooks registering a grouping method, but we should be able to switch between grouping method on prop update
 * For instance switch from treeData: true to a grouping by column.
 */
export const useGridRowGroupsPreProcessing = (apiRef: GridApiRef) => {
  const rowGroupsPreProcessingRef = React.useRef<RowGroupingFunction | null>();

  const registerRowGroupsBuilder = React.useCallback<
    GridRowGroupsPreProcessingApi['registerRowGroupsBuilder']
  >(
    (rowGrouping) => {
      rowGroupsPreProcessingRef.current = rowGrouping;
      apiRef.current.publishEvent(GridEvents.rowGroupsPreProcessingChange);
    },
    [apiRef],
  );

  const groupRows = React.useCallback<GridRowGroupsPreProcessingApi['groupRows']>((...params) => {
    if (!rowGroupsPreProcessingRef.current) {
      return getFlatRowTree(...params);
    }

    return rowGroupsPreProcessingRef.current(...params);
  }, []);

  const rowGroupsPreProcessingApi: GridRowGroupsPreProcessingApi = {
    registerRowGroupsBuilder,
    groupRows,
  };

  useGridApiMethod(apiRef, rowGroupsPreProcessingApi, 'GridRowGroupsPreProcessing');
};
