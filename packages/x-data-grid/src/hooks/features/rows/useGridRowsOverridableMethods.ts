import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import type { GridRowId, GridGroupNode } from '../../../models/gridRows';
import { gridRowTreeSelector, gridRowNodeSelector } from './gridRowsSelector';
import { gridExpandedSortedRowIndexLookupSelector } from '../filter/gridFilterSelector';
import { GRID_ROOT_GROUP_ID } from './gridRowsUtils';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import type { GridRowProApi } from '../../../models/api/gridRowApi';

export const useGridRowsOverridableMethods = (apiRef: RefObject<GridPrivateApiCommunity>) => {
  const setRowPosition = React.useCallback<GridRowProApi['setRowPosition']>(
    (sourceRowId, targetRowId, position) => {
      const sourceNode = gridRowNodeSelector(apiRef, sourceRowId);
      const targetNode = gridRowNodeSelector(apiRef, targetRowId);

      if (!sourceNode) {
        throw new Error(`MUI X: No row with id #${sourceRowId} found.`);
      }

      if (!targetNode) {
        throw new Error(`MUI X: No row with id #${targetRowId} found.`);
      }

      if (sourceNode.type !== 'leaf') {
        throw new Error(
          `MUI X: The row reordering does not support reordering of footer or grouping rows.`,
        );
      }

      if (position === 'inside') {
        throw new Error(
          `MUI X: The 'inside' position is only supported for tree data. Use 'above' or 'below' for flat data.`,
        );
      }

      // Validate both rows are in the current (filtered) view.
      const sortedFilteredRowIndexLookup = gridExpandedSortedRowIndexLookupSelector(apiRef);
      if (sortedFilteredRowIndexLookup[targetRowId] === undefined) {
        throw new Error(`MUI X: Target row with id #${targetRowId} not found in current view.`);
      }
      if (sortedFilteredRowIndexLookup[sourceRowId] === undefined) {
        throw new Error(`MUI X: Source row with id #${sourceRowId} not found in current view.`);
      }

      apiRef.current.setState((state) => {
        const group = gridRowTreeSelector(apiRef)[GRID_ROOT_GROUP_ID] as GridGroupNode;
        const allRows = group.children;

        const sourceFullIndex = allRows.indexOf(sourceRowId);
        const targetFullIndex = allRows.indexOf(targetRowId);
        if (sourceFullIndex === -1 || targetFullIndex === -1) {
          return state;
        }

        // Remove source, then insert next to target anchor id so filtered-out
        // rows between source and target keep their relative position.
        const updatedRows = allRows.filter((id) => id !== sourceRowId);
        const anchorIndex = updatedRows.indexOf(targetRowId);
        const insertAt = position === 'above' ? anchorIndex : anchorIndex + 1;

        if (insertAt === sourceFullIndex) {
          return state;
        }

        updatedRows.splice(insertAt, 0, sourceRowId);

        return {
          ...state,
          rows: {
            ...state.rows,
            tree: {
              ...state.rows.tree,
              [GRID_ROOT_GROUP_ID]: {
                ...group,
                children: updatedRows,
              },
            },
          },
        };
      });
      apiRef.current.publishEvent('rowsSet');
    },
    [apiRef],
  );

  const setRowIndex = React.useCallback(
    (rowId: GridRowId, targetIndex: number) => {
      const node = gridRowNodeSelector(apiRef, rowId);

      if (!node) {
        throw new Error(
          `MUI X Data Grid: No row with id "${rowId}" found. ` +
            'The row to reorder does not exist in the grid. ' +
            'Verify the row id is correct and the row exists.',
        );
      }

      if (node.type !== 'leaf') {
        throw new Error(
          'MUI X Data Grid: Row reordering does not support reordering of footer or grouping rows. ' +
            'Only leaf (data) rows can be reordered. ' +
            'Ensure you are only reordering data rows.',
        );
      }

      apiRef.current.setState((state) => {
        const group = gridRowTreeSelector(apiRef)[GRID_ROOT_GROUP_ID] as GridGroupNode;
        const allRows = group.children;
        const oldIndex = allRows.findIndex((row) => row === rowId);
        if (oldIndex === -1 || oldIndex === targetIndex) {
          return state;
        }

        const updatedRows = [...allRows];
        updatedRows.splice(targetIndex, 0, updatedRows.splice(oldIndex, 1)[0]);

        return {
          ...state,
          rows: {
            ...state.rows,
            tree: {
              ...state.rows.tree,
              [GRID_ROOT_GROUP_ID]: {
                ...group,
                children: updatedRows,
              },
            },
          },
        };
      });
      apiRef.current.publishEvent('rowsSet');
    },
    [apiRef],
  );

  return {
    setRowIndex,
    setRowPosition,
  };
};
