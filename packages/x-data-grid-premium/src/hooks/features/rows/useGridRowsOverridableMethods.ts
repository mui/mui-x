import * as React from 'react';
import {
  GridRowId,
  gridRowTreeSelector,
  gridExpandedSortedRowIdsSelector,
  gridRowNodeSelector,
  gridRowMaximumTreeDepthSelector,
  gridRowIdSelector,
  GridValidRowModel,
  GridColDef,
} from '@mui/x-data-grid-pro';
import {
  gridExpandedSortedRowIndexLookupSelector,
  useGridRowsOverridableMethods as useGridRowsOverridableMethodsCommunity,
  useGridSelector,
} from '@mui/x-data-grid-pro/internals';
import type { RefObject } from '@mui/x-internals/types';
import { gridCellAggregationResultSelector } from '../aggregation/gridAggregationSelectors';
import { rowGroupingReorderExecutor } from '../rowReorder/reorderExecutor';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { ReorderExecutionContext } from '../rowReorder/types';

export const useGridRowsOverridableMethods = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<DataGridPremiumProcessedProps, 'processRowUpdate' | 'onProcessRowUpdateError'>,
) => {
  const { processRowUpdate, onProcessRowUpdateError } = props;
  const {
    setRowIndex: setRowIndexPlain,
    getCellValue,
    getRowValue,
    getRowFormattedValue,
  } = useGridRowsOverridableMethodsCommunity(apiRef);

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
        placeholderIndex: targetOriginalIndex,
        sortedFilteredRowIds,
        sortedFilteredRowIndexLookup,
        rowTree,
        apiRef,
        processRowUpdate,
        onProcessRowUpdateError,
      };

      await rowGroupingReorderExecutor.execute(executionContext);
    },
    [apiRef, processRowUpdate, onProcessRowUpdateError],
  );

  const getCellValuePremium = React.useCallback(
    (id: GridRowId, field: string) =>
      gridCellAggregationResultSelector(apiRef, {
        id,
        field,
      })?.value ?? getCellValue(id, field),
    [apiRef, getCellValue],
  );

  const getRowValuePremium = React.useCallback(
    (row: GridValidRowModel, colDef: GridColDef) =>
      gridCellAggregationResultSelector(apiRef, {
        id: gridRowIdSelector(apiRef, row),
        field: colDef.field,
      })?.value ?? getRowValue(row, colDef),
    [apiRef, getRowValue],
  );

  const getRowFormattedValuePremium = React.useCallback(
    (row: GridValidRowModel, colDef: GridColDef) =>
      gridCellAggregationResultSelector(apiRef, {
        id: gridRowIdSelector(apiRef, row),
        field: colDef.field,
      })?.formattedValue ?? getRowFormattedValue(row, colDef),
    [apiRef, getRowFormattedValue],
  );

  return {
    setRowIndex: flatTree ? setRowIndexPlain : setRowIndex,
    getCellValue: getCellValuePremium,
    getRowValue: getRowValuePremium,
    getRowFormattedValue: getRowFormattedValuePremium,
  };
};
