import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import {
  useGridEvent,
  gridRowMaximumTreeDepthSelector,
  type GridEventListener,
  gridExpandedSortedRowIdsSelector,
  gridRowTreeSelector,
  gridExpandedSortedRowIndexLookupSelector,
} from '@mui/x-data-grid';
import { useGridRegisterPipeProcessor, type GridPipeProcessor } from '@mui/x-data-grid/internals';
import type { ReorderValidationContext } from '../rowReorder/models';
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

  const isValidRowReorderProp = props.isValidRowReorder;
  const isRowReorderValid = React.useCallback<GridPipeProcessor<'isRowReorderValid'>>(
    (initialValue, { sourceRowId, targetRowId, dropPosition, dragDirection }) => {
      if (gridRowMaximumTreeDepthSelector(apiRef) === 1 || !props.treeData) {
        return initialValue;
      }

      const expandedSortedRowIndexLookup = gridExpandedSortedRowIndexLookupSelector(apiRef);
      const expandedSortedRowIds = gridExpandedSortedRowIdsSelector(apiRef);
      const rowTree = gridRowTreeSelector(apiRef);
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
        return false;
      }

      // Create context object
      const context: ReorderValidationContext = {
        apiRef,
        sourceNode,
        targetNode,
        prevNode,
        nextNode,
        dropPosition,
        dragDirection,
      };

      // First apply internal validation
      let isValid = treeDataReorderValidator.validate(context);

      // If internal validation passes AND user provided additional validation
      if (isValid && isValidRowReorderProp) {
        // Apply additional user restrictions
        isValid = isValidRowReorderProp(context);
      }

      return isValid;
    },
    [apiRef, props.treeData, isValidRowReorderProp],
  );

  useGridRegisterPipeProcessor(apiRef, 'isRowReorderValid', isRowReorderValid);
  useGridEvent(apiRef, 'cellKeyDown', handleCellKeyDown);
};
