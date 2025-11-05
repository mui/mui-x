import * as React from 'react';
import {
  GridRowId,
  gridRowTreeSelector,
  gridExpandedSortedRowIdsSelector,
  gridRowNodeSelector,
  useGridSelector,
  gridRowMaximumTreeDepthSelector,
  gridExpandedSortedRowIndexLookupSelector,
} from '@mui/x-data-grid';
import { useGridRowsOverridableMethodsCommunity } from '@mui/x-data-grid/internals';
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
  const { setRowIndex: setRowIndexFlat } = useGridRowsOverridableMethodsCommunity(apiRef);

  const flatTree = useGridSelector(apiRef, gridRowMaximumTreeDepthSelector) === 1;

  const setRowIndex = React.useCallback(
    async (
      sourceRowId: GridRowId,
      targetOriginalIndex: number,
      dropPosition?: 'above' | 'below' | 'over',
    ) => {
      const sortedFilteredRowIds = gridExpandedSortedRowIdsSelector(apiRef);
      const sortedFilteredRowIndexLookup = gridExpandedSortedRowIndexLookupSelector(apiRef);
      const rowTree = gridRowTreeSelector(apiRef);

      if (!dropPosition) {
        throw new Error(
          `MUI X: \`dropPosition\` must be provided for the tree data reordering to work.`,
        );
      }

      const sourceNode = gridRowNodeSelector(apiRef, sourceRowId);

      if (!sourceNode) {
        throw new Error(`MUI X: No row with id #${sourceRowId} found.`);
      }

      if (sourceNode.type === 'footer') {
        throw new Error(`MUI X: The row reordering do not support reordering of footer rows.`);
      }

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

      return treeDataReorderExecutor.execute(executionContext);
    },
    [apiRef, processRowUpdate, onProcessRowUpdateError, setTreeDataPath],
  );

  return {
    setRowIndex: flatTree ? setRowIndexFlat : setRowIndex,
  };
};
