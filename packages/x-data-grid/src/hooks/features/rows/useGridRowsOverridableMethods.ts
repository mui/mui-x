import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { GridRowId, GridGroupNode } from '../../../models/gridRows';
import { gridRowTreeSelector, gridRowNodeSelector } from './gridRowsSelector';
import { gridExpandedSortedRowIndexLookupSelector } from '../filter/gridFilterSelector';
import { GRID_ROOT_GROUP_ID } from './gridRowsUtils';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
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

      if (sourceNode.parent !== GRID_ROOT_GROUP_ID) {
        throw new Error(`MUI X: The row reordering do not support reordering of grouped rows yet.`);
      }

      if (sourceNode.type !== 'leaf') {
        throw new Error(
          `MUI X: The row reordering do not support reordering of footer or grouping rows.`,
        );
      }

      if (position === 'inside') {
        throw new Error(
          `MUI X: The 'inside' position is only supported for tree data. Use 'above' or 'below' for flat data.`,
        );
      }

      // Get the target index from the targetRowId using the lookup selector
      const sortedFilteredRowIndexLookup = gridExpandedSortedRowIndexLookupSelector(apiRef);
      const targetRowIndexUnadjusted = sortedFilteredRowIndexLookup[targetRowId];

      if (targetRowIndexUnadjusted === undefined) {
        throw new Error(`MUI X: Target row with id #${targetRowId} not found in current view.`);
      }

      const sourceRowIndex = sortedFilteredRowIndexLookup[sourceRowId];

      if (sourceRowIndex === undefined) {
        throw new Error(`MUI X: Source row with id #${sourceRowId} not found in current view.`);
      }

      const dragDirection = targetRowIndexUnadjusted < sourceRowIndex ? 'up' : 'down';

      let targetRowIndex;
      if (dragDirection === 'up') {
        targetRowIndex =
          position === 'above' ? targetRowIndexUnadjusted : targetRowIndexUnadjusted + 1;
      } else {
        targetRowIndex =
          position === 'above' ? targetRowIndexUnadjusted - 1 : targetRowIndexUnadjusted;
      }

      if (targetRowIndex === sourceRowIndex) {
        return;
      }

      apiRef.current.setState((state) => {
        const group = gridRowTreeSelector(apiRef)[GRID_ROOT_GROUP_ID] as GridGroupNode;
        const allRows = group.children;

        const updatedRows = [...allRows];
        updatedRows.splice(targetRowIndex, 0, updatedRows.splice(sourceRowIndex, 1)[0]);

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

  const setRowIndex = React.useCallback<GridRowProApi['setRowIndex']>(
    (sourceRowId, targetIndex) => {
      // Get all row IDs to find the targetRowId at the given targetIndex
      const group = gridRowTreeSelector(apiRef)[GRID_ROOT_GROUP_ID] as GridGroupNode;
      const allRows = group.children;

      // Handle edge case: if targetIndex is at the end or beyond
      if (targetIndex >= allRows.length) {
        throw new Error(
          `MUI X: Target index ${targetIndex} is out of bounds. Maximum index is ${allRows.length - 1}.`,
        );
      }

      const targetRowId = allRows[targetIndex];

      // All other validations (node existence, type, parent) happen in setRowPosition
      return setRowPosition(sourceRowId, targetRowId, 'below');
    },
    [apiRef, setRowPosition],
  );

  return {
    setRowIndex,
    setRowPosition,
  };
};
