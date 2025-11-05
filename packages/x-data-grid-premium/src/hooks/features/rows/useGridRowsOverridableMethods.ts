import * as React from 'react';
import {
  GridRowId,
  gridRowTreeSelector,
  gridExpandedSortedRowIdsSelector,
  gridRowNodeSelector,
  gridRowMaximumTreeDepthSelector,
  gridExpandedSortedRowIndexLookupSelector,
} from '@mui/x-data-grid-pro';
import {
  useGridRowsOverridableMethodsCommunity,
  useGridRowsOverridableMethodsPro,
  useGridSelector,
  type ReorderExecutionContext,
  gridRowDropTargetRowIdSelector,
  gridRowDropPositionSelector,
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
  const { setRowIndex: setRowIndexPlain } = useGridRowsOverridableMethodsCommunity(apiRef);
  const { setRowIndex: setRowIndexTreeData } = useGridRowsOverridableMethodsPro(apiRef, props);

  const flatTree = useGridSelector(apiRef, gridRowMaximumTreeDepthSelector) === 1;

  const setRowIndex = React.useCallback(
    async (sourceRowId: GridRowId, targetOriginalIndex: number) => {
      const sortedFilteredRowIds = gridExpandedSortedRowIdsSelector(apiRef);
      const sortedFilteredRowIndexLookup = gridExpandedSortedRowIndexLookupSelector(apiRef);
      const rowTree = gridRowTreeSelector(apiRef);

      const sourceNode = gridRowNodeSelector(apiRef, sourceRowId);

      if (!sourceNode) {
        throw new Error(`MUI X: No row with id #${sourceRowId} found.`);
      }

      const targetRowId = gridRowDropTargetRowIdSelector(apiRef);
      // TODO v9: Use the updated function arguments instead of these selectors to be able to use in the userland
      // Fallback for the userland usecases when proper state is not set
      const dropPosition = targetRowId ? gridRowDropPositionSelector(apiRef, targetRowId) : 'below';

      if (sourceNode.type === 'footer') {
        throw new Error(`MUI X: The row reordering do not support reordering of footer rows.`);
      }

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
        dropPosition,
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
    };
  }

  if (props.treeData) {
    return {
      setRowIndex: setRowIndexTreeData,
    };
  }

  return {
    setRowIndex,
  };
};
