import * as React from 'react';
import {
  gridRowTreeSelector,
  gridExpandedSortedRowIdsSelector,
  gridRowNodeSelector,
  useGridSelector,
  gridRowMaximumTreeDepthSelector,
  gridExpandedSortedRowIndexLookupSelector,
  GridRowProApi,
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
  const { setRowIndex: setRowIndexFlat, setRowPosition: setRowPositionFlat } =
    useGridRowsOverridableMethodsCommunity(apiRef);

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

  const setRowIndex = React.useCallback<GridRowProApi['setRowIndex']>(async () => {
    throw new Error(
      `MUI X: \`setRowIndex()\` is not supported for tree data. Use \`setRowPosition()\` instead.`,
    );
  }, []);

  return {
    setRowIndex: flatTree ? setRowIndexFlat : setRowIndex,
    setRowPosition: flatTree ? setRowPositionFlat : setRowPosition,
  };
};
