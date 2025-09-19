import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import {
  useGridEvent,
  gridRowMaximumTreeDepthSelector,
  type GridEventListener,
  gridExpandedSortedRowIdsSelector,
  gridRowTreeSelector,
} from '@mui/x-data-grid';
import {
  gridExpandedSortedRowIndexLookupSelector,
  useGridRegisterPipeProcessor,
  type GridPipeProcessor,
} from '@mui/x-data-grid/internals';
import type { ReorderValidationContext } from '../rowReorder/types';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GRID_TREE_DATA_GROUPING_FIELD } from './gridTreeDataGroupColDef';
import { treeDataReorderValidator } from './treeDataReorderValidator';

export const useGridTreeData = (
  apiRef: RefObject<GridPrivateApiPro>,
  props: Pick<DataGridProProcessedProps, 'treeData' | 'dataSource' | 'isValidRowReorder'>,
) => {
  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      const cellParams = apiRef.current.getCellParams(params.id, params.field);
      if (
        cellParams.colDef.field === GRID_TREE_DATA_GROUPING_FIELD &&
        (event.key === ' ' || event.key === 'Enter') &&
        !event.shiftKey
      ) {
        if (params.rowNode.type !== 'group') {
          return;
        }

        if (props.dataSource && !params.rowNode.childrenExpanded) {
          apiRef.current.dataSource.fetchRows(params.id);
          return;
        }

        apiRef.current.setRowChildrenExpansion(params.id, !params.rowNode.childrenExpanded);
      }
    },
    [apiRef, props.dataSource],
  );

  const isValidRowReorder = props.isValidRowReorder;
  const getTreeDataRowReorderTargetIndex = React.useCallback<
    GridPipeProcessor<'getRowReorderTargetIndex'>
  >(
    (initialValue, { sourceRowId, targetRowId, dropPosition, dragDirection }) => {
      if (gridRowMaximumTreeDepthSelector(apiRef) === 1 || !props.treeData) {
        return initialValue;
      }

      const expandedSortedRowIndexLookup = gridExpandedSortedRowIndexLookupSelector(apiRef);
      const expandedSortedRowIds = gridExpandedSortedRowIdsSelector(apiRef);
      const rowTree = gridRowTreeSelector(apiRef);

      const sourceRowIndex = expandedSortedRowIndexLookup[sourceRowId];
      const targetRowIndex = expandedSortedRowIndexLookup[targetRowId];
      const sourceNode = rowTree[sourceRowId];
      const targetNode = rowTree[targetRowId];
      const prevNode =
        targetRowIndex > 0 ? rowTree[expandedSortedRowIds[targetRowIndex - 1]] : null;
      const nextNode =
        targetRowIndex < expandedSortedRowIds.length - 1
          ? rowTree[expandedSortedRowIds[targetRowIndex + 1]]
          : null;

      // Basic validity checks
      if (!sourceNode || !targetNode) {
        return -1;
      }

      // Create context object
      const context: ReorderValidationContext = {
        sourceNode,
        targetNode,
        prevNode,
        nextNode,
        rowTree,
        dropPosition,
        dragDirection,
        targetRowIndex,
        sourceRowIndex,
        expandedSortedRowIndexLookup,
      };

      // Check if the reorder is valid
      let isValid;
      if (isValidRowReorder) {
        // User override completely replaces internal validation
        isValid = isValidRowReorder(context);
      } else {
        // Use default internal validation
        isValid = treeDataReorderValidator.validate(context);
      }

      if (isValid) {
        return dropPosition === 'below' ? targetRowIndex + 1 : targetRowIndex;
      }
      return -1;
    },
    [apiRef, props.treeData, isValidRowReorder],
  );

  useGridRegisterPipeProcessor(
    apiRef,
    'getRowReorderTargetIndex',
    getTreeDataRowReorderTargetIndex,
  );
  useGridEvent(apiRef, 'cellKeyDown', handleCellKeyDown);
};
