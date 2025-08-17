import * as React from 'react';
import {
  GridRowId,
  gridRowTreeSelector,
  gridExpandedSortedRowIdsSelector,
  gridRowNodeSelector,
} from '@mui/x-data-grid-pro';
import { gridExpandedSortedRowIndexLookupSelector } from '@mui/x-data-grid-pro/internals';
import { RefObject } from '@mui/x-internals/types';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { reorderExecutor, type ReorderExecutionContext } from './reorderExecutionUtils';

export const useGridRowsOverridableMethods = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<DataGridPremiumProcessedProps, 'processRowUpdate' | 'onProcessRowUpdateError'>,
) => {
  const { processRowUpdate, onProcessRowUpdateError } = props;

  const setRowIndex = React.useCallback(
    async (sourceRowId: GridRowId, targetOriginalIndex: number) => {
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

      // TODO: Redo validation here to make sure the direct API calls are being handled properly too

      const executionContext: ReorderExecutionContext = {
        sourceRowId,
        placeholderIndex: targetOriginalIndex,
        sortedFilteredRowIds,
        sortedFilteredRowIndexLookup,
        rowTree,
        apiRef,
        processRowUpdate,
        onProcessRowUpdateError,
      };

      await reorderExecutor.execute(executionContext);
    },
    [apiRef, processRowUpdate, onProcessRowUpdateError],
  );

  return {
    setRowIndex,
  };
};
