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
import {
  gridRowDropPositionSelector,
  gridRowDropTargetRowIdSelector,
  useGridRowsOverridableMethodsCommunity,
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
  const { setRowIndex: setRowIndexFlat } = useGridRowsOverridableMethodsCommunity(apiRef);

  const flatTree = useGridSelector(apiRef, gridRowMaximumTreeDepthSelector) === 1;

  const setRowIndex = React.useCallback(
    async (sourceRowId: GridRowId, targetOriginalIndex: number) => {
      const sortedFilteredRowIds = gridExpandedSortedRowIdsSelector(apiRef);
      const sortedFilteredRowIndexLookup = gridExpandedSortedRowIndexLookupSelector(apiRef);
      const rowTree = gridRowTreeSelector(apiRef);

      const targetRowId = gridRowDropTargetRowIdSelector(apiRef);

      if (!targetRowId) {
        throw new Error(`MUI X: No target row id found.`);
      }

      const dropPosition = gridRowDropPositionSelector(apiRef, targetRowId)!;

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
