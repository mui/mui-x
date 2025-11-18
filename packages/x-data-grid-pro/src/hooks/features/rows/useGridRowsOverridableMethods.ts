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
  useGridRowsOverridableMethodsCommunity,
  type RowReorderDropPosition,
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
  const { setRowIndex: setRowIndexFlat, setRowPosition: setRowPositionFlat } =
    useGridRowsOverridableMethodsCommunity(apiRef);

  const flatTree = useGridSelector(apiRef, gridRowMaximumTreeDepthSelector) === 1;

  const setRowPosition = React.useCallback(
    async (sourceRowId: GridRowId, targetRowId: GridRowId, position: RowReorderDropPosition) => {
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
        setTreeDataPath,
      };

      return treeDataReorderExecutor.execute(executionContext);
    },
    [apiRef, processRowUpdate, onProcessRowUpdateError, setTreeDataPath],
  );

  const setRowIndex = React.useCallback(
    async (
      sourceRowId: GridRowId,
      targetOriginalIndex: number,
      dropPosition?: 'above' | 'below' | 'inside',
    ) => {
      if (!dropPosition) {
        throw new Error(
          `MUI X: \`dropPosition\` must be provided for the tree data reordering to work.`,
        );
      }

      const sortedFilteredRowIds = gridExpandedSortedRowIdsSelector(apiRef);

      if (targetOriginalIndex === sortedFilteredRowIds.length) {
        targetOriginalIndex = targetOriginalIndex - 1;
      }
      if (targetOriginalIndex > sortedFilteredRowIds.length) {
        throw new Error(
          `MUI X: Target index ${targetOriginalIndex} is out of bounds. Maximum index is ${sortedFilteredRowIds.length - 1}.`,
        );
      }

      const targetRowId = sortedFilteredRowIds[targetOriginalIndex];

      return setRowPosition(sourceRowId, targetRowId, dropPosition);
    },
    [apiRef, setRowPosition],
  );

  return {
    setRowIndex: flatTree ? setRowIndexFlat : setRowIndex,
    setRowPosition: flatTree ? setRowPositionFlat : setRowPosition,
  };
};
