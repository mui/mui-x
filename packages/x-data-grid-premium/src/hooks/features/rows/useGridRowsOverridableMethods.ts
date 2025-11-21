import * as React from 'react';
import {
  gridRowTreeSelector,
  gridExpandedSortedRowIdsSelector,
  gridRowNodeSelector,
  gridRowMaximumTreeDepthSelector,
  gridExpandedSortedRowIndexLookupSelector,
  GridRowProApi,
} from '@mui/x-data-grid-pro';
import {
  useGridRowsOverridableMethodsCommunity,
  useGridRowsOverridableMethodsPro,
  useGridSelector,
  type ReorderExecutionContext,
} from '@mui/x-data-grid-pro/internals';
import type { RefObject } from '@mui/x-internals/types';
import { rowGroupingReorderExecutor } from '../rowReorder/rowGroupingReorderExecutor';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

export const useGridRowsOverridableMethods = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    'processRowUpdate' | 'onProcessRowUpdateError' | 'treeData'
  >,
) => {
  const { processRowUpdate, onProcessRowUpdateError } = props;
  const { setRowIndex: setRowIndexPlain, setRowPosition: setRowPositionPlain } =
    useGridRowsOverridableMethodsCommunity(apiRef);
  const { setRowIndex: setRowIndexTreeData, setRowPosition: setRowPositionTreeData } =
    useGridRowsOverridableMethodsPro(apiRef, props);

  const flatTree = useGridSelector(apiRef, gridRowMaximumTreeDepthSelector) === 1;

  const setRowPosition = React.useCallback<GridRowProApi['setRowPosition']>(
    async (sourceRowId, targetRowId, position) => {
      const sortedFilteredRowIds = gridExpandedSortedRowIdsSelector(apiRef);
      const sortedFilteredRowIndexLookup = gridExpandedSortedRowIndexLookupSelector(apiRef);
      const rowTree = gridRowTreeSelector(apiRef);

      const sourceNode = gridRowNodeSelector(apiRef, sourceRowId);
      const targetNode = gridRowNodeSelector(apiRef, targetRowId);

      if (!sourceNode) {
        throw new Error(`MUI X: No row with id #${sourceRowId} found.`);
      }

      if (!targetNode) {
        throw new Error(`MUI X: No row with id #${targetRowId} found.`);
      }

      if (sourceNode.type === 'footer') {
        throw new Error(`MUI X: The row reordering do not support reordering of footer rows.`);
      }

      // Get the target index from the targetRowId using the lookup selector
      const targetIndexUnadjusted = sortedFilteredRowIndexLookup[targetRowId];

      if (targetIndexUnadjusted === undefined) {
        throw new Error(`MUI X: Target row with id #${targetRowId} not found in current view.`);
      }

      const targetIndex = position === 'below' ? targetIndexUnadjusted + 1 : targetIndexUnadjusted;

      /**
       * Row Grouping Reordering Use Cases
       * =================================
       *
       * | Case | Source Node | Target Node | Parent Relationship       | Action                                                                      |
       * | :--- | :---------- | :---------- | :------------------------ | :-------------------------------------------------------------------------- |
       * | A ✅ | Leaf        | Leaf        | Same parent               | Swap positions (similar to flat tree structure)                             |
       * | B ✅ | Group       | Group       | Same parent               | Swap positions (along with their descendants)                               |
       * | C ✅ | Leaf        | Leaf        | Different parents         | Make source node a child of target's parent and update parent nodes in tree |
       * | D ✅ | Leaf        | Group       | Different parents         | Make source a child of target, only allowed at same depth as source.parent  |
       * | E ❌ | Leaf        | Group       | Target is source's parent | Not allowed, will have no difference                                        |
       * | F ❌ | Group       | Leaf        | Any                       | Not allowed, will break the row grouping criteria                           |
       * | G ✅ | Group       | Group       | Different parents         | Only allowed at same depth to preserve grouping criteria                    |
       */

      const executionContext: ReorderExecutionContext = {
        sourceRowId,
        dropPosition: position,
        placeholderIndex: targetIndex,
        sortedFilteredRowIds,
        sortedFilteredRowIndexLookup,
        rowTree,
        apiRef,
        processRowUpdate,
        onProcessRowUpdateError,
      };

      return rowGroupingReorderExecutor.execute(executionContext);
    },
    [apiRef, processRowUpdate, onProcessRowUpdateError],
  );

  const setRowIndex = React.useCallback<GridRowProApi['setRowIndex']>(
    async (sourceRowId, targetOriginalIndex) => {
      const sortedFilteredRowIds = gridExpandedSortedRowIdsSelector(apiRef);
      const sortedFilteredRowIndexLookup = gridExpandedSortedRowIndexLookupSelector(apiRef);
      const rowTree = gridRowTreeSelector(apiRef);

      const sourceNode = gridRowNodeSelector(apiRef, sourceRowId);

      if (!sourceNode) {
        throw new Error(`MUI X: No row with id #${sourceRowId} found.`);
      }

      if (sourceNode.type === 'footer') {
        throw new Error(`MUI X: The row reordering do not support reordering of footer rows.`);
      }

      const executionContext: ReorderExecutionContext = {
        sourceRowId,
        dropPosition: 'below',
        placeholderIndex: targetOriginalIndex,
        sortedFilteredRowIds,
        sortedFilteredRowIndexLookup,
        rowTree,
        apiRef,
        processRowUpdate,
        onProcessRowUpdateError,
      };

      return rowGroupingReorderExecutor.execute(executionContext);
    },
    [apiRef, processRowUpdate, onProcessRowUpdateError],
  );

  if (flatTree) {
    return {
      setRowIndex: setRowIndexPlain,
      setRowPosition: setRowPositionPlain,
    };
  }

  if (props.treeData) {
    return {
      setRowIndex: setRowIndexTreeData,
      setRowPosition: setRowPositionTreeData,
    };
  }

  return {
    setRowIndex,
    setRowPosition,
  };
};
