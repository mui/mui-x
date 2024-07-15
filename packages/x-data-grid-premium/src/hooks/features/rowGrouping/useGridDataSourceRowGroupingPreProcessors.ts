import * as React from 'react';
import { GridRowId, gridRowTreeSelector, gridColumnLookupSelector } from '@mui/x-data-grid-pro';
import {
  GridStrategyProcessor,
  useGridRegisterStrategyProcessor,
  createRowTree,
  updateRowTree,
  getVisibleRowsLookup,
  skipSorting,
  skipFiltering,
  GridRowsPartialUpdates,
} from '@mui/x-data-grid-pro/internals';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { DATA_SOURCE_ROW_GROUPING_STRATEGY, getGroupingRules } from './gridRowGroupingUtils';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { gridRowGroupingSanitizedModelSelector } from './gridRowGroupingSelector';

export const useGridDataSourceRowGroupingPreProcessors = (
  apiRef: React.MutableRefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'disableRowGrouping'
    | 'groupingColDef'
    | 'rowGroupingColumnMode'
    | 'defaultGroupingExpansionDepth'
    | 'isGroupExpandedByDefault'
    | 'unstable_dataSource'
  >,
) => {
  const createRowTreeForRowGrouping = React.useCallback<GridStrategyProcessor<'rowTreeCreation'>>(
    (params) => {
      const getGroupKey = props.unstable_dataSource?.getGroupKey;
      if (!getGroupKey) {
        throw new Error('MUI X: No `getGroupKey` method provided with the dataSource.');
      }

      const getChildrenCount = props.unstable_dataSource?.getChildrenCount;
      if (!getChildrenCount) {
        throw new Error('MUI X: No `getChildrenCount` method provided with the dataSource.');
      }

      const sanitizedRowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);
      const columnsLookup = gridColumnLookupSelector(apiRef);
      const groupingRules = getGroupingRules({
        sanitizedRowGroupingModel,
        columnsLookup,
      });
      apiRef.current.caches.rowGrouping.rulesOnLastRowTreeCreation = groupingRules;

      // TODO: Accomodate `groupingValueGetter`

      const parentPath = (params.updates as GridRowsPartialUpdates).groupKeys ?? [];

      const getRowTreeBuilderNode = (rowId: GridRowId) => {
        const count = getChildrenCount(params.dataRowIdToModelLookup[rowId]);
        const leafKey = getGroupKey(params.dataRowIdToModelLookup[rowId]);
        return {
          id: rowId,
          path: [...parentPath, leafKey ?? rowId.toString()].map((key, i) => ({
            key,
            field: groupingRules[i]?.field ?? null,
          })),
          hasServerChildren: !!count && count !== 0,
        };
      };

      if (params.updates.type === 'full') {
        return createRowTree({
          previousTree: params.previousTree,
          nodes: params.updates.rows.map(getRowTreeBuilderNode),
          defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
          isGroupExpandedByDefault: props.isGroupExpandedByDefault,
          groupingName: DATA_SOURCE_ROW_GROUPING_STRATEGY,
        });
      }

      return updateRowTree({
        nodes: {
          inserted: (params.updates as GridRowsPartialUpdates).actions.insert.map(
            getRowTreeBuilderNode,
          ),
          modified: (params.updates as GridRowsPartialUpdates).actions.modify.map(
            getRowTreeBuilderNode,
          ),
          removed: (params.updates as GridRowsPartialUpdates).actions.remove,
        },
        previousTree: params.previousTree!,
        previousGroupsToFetch: params.previousGroupsToFetch,
        previousTreeDepth: params.previousTreeDepths!,
        defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
        isGroupExpandedByDefault: props.isGroupExpandedByDefault,
        groupingName: DATA_SOURCE_ROW_GROUPING_STRATEGY,
      });
    },
    [
      apiRef,
      props.unstable_dataSource,
      props.defaultGroupingExpansionDepth,
      props.isGroupExpandedByDefault,
    ],
  );

  const filterRows = React.useCallback<GridStrategyProcessor<'filtering'>>(() => {
    const rowTree = gridRowTreeSelector(apiRef);

    return skipFiltering(rowTree);
  }, [apiRef]);

  const sortRows = React.useCallback<GridStrategyProcessor<'sorting'>>(() => {
    const rowTree = gridRowTreeSelector(apiRef);

    return skipSorting(rowTree);
  }, [apiRef]);

  useGridRegisterStrategyProcessor(
    apiRef,
    DATA_SOURCE_ROW_GROUPING_STRATEGY,
    'rowTreeCreation',
    createRowTreeForRowGrouping,
  );
  useGridRegisterStrategyProcessor(
    apiRef,
    DATA_SOURCE_ROW_GROUPING_STRATEGY,
    'filtering',
    filterRows,
  );
  useGridRegisterStrategyProcessor(apiRef, DATA_SOURCE_ROW_GROUPING_STRATEGY, 'sorting', sortRows);
  useGridRegisterStrategyProcessor(
    apiRef,
    DATA_SOURCE_ROW_GROUPING_STRATEGY,
    'visibleRowsLookupCreation',
    getVisibleRowsLookup,
  );
};
