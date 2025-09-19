import * as React from 'react';
import {
  GridRowId,
  gridRowTreeSelector,
  gridExpandedSortedRowIdsSelector,
  gridRowNodeSelector,
} from '@mui/x-data-grid';
import {
  gridExpandedSortedRowIndexLookupSelector,
  gridRowDropPositionSelector,
} from '@mui/x-data-grid/internals';
import type { RefObject } from '@mui/x-internals/types';
import type { ReorderExecutionContext } from '../rowReorder/types';
import { treeDataReorderExecutor } from '../treeData/treeDataReorderExecutor';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';

export const useGridRowsOverridableMethods = (
  apiRef: RefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'processRowUpdate' | 'onProcessRowUpdateError' | 'setTreeDataPath'
  >,
) => {
  const { processRowUpdate, onProcessRowUpdateError, setTreeDataPath } = props;

  const setRowIndex = React.useCallback(
    async (sourceRowId: GridRowId, targetOriginalIndex: number) => {
      const sortedFilteredRowIds = gridExpandedSortedRowIdsSelector(apiRef);
      const sortedFilteredRowIndexLookup = gridExpandedSortedRowIndexLookupSelector(apiRef);
      const rowTree = gridRowTreeSelector(apiRef);

      const dropPosition = gridRowDropPositionSelector(apiRef, sourceRowId)!;

      const sourceNode = gridRowNodeSelector(apiRef, sourceRowId);

      if (!sourceNode) {
        throw new Error(`MUI X: No row with id #${sourceRowId} found.`);
      }

      if (sourceNode.type === 'footer') {
        throw new Error(`MUI X: The row reordering do not support reordering of footer rows.`);
      }

      /**
       * Tree Data Reordering Use Cases
       * =================================
       *
       * | Case | Source Node | Target Node | Parent Relationship       | Action                                                                      |
       * | :--- | :---------- | :---------- | :------------------------ | :-------------------------------------------------------------------------- |
       * | A ✅ | Leaf        | Leaf        | Same parent               | Swap positions (similar to flat tree structure)                             |
       * | B ✅ | Group       | Group       | Same parent               | Swap positions (along with their descendants)                               |
       *
       * Rest of the cases in progress!!!
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
        setTreeDataPath,
      };

      await treeDataReorderExecutor.execute(executionContext);
    },
    [apiRef, processRowUpdate, onProcessRowUpdateError, setTreeDataPath],
  );

  return {
    setRowIndex,
  };
};
