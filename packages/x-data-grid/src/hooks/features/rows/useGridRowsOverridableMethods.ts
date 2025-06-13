import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { GridRowId, GridGroupNode } from '../../../models/gridRows';
import { gridRowTreeSelector, gridRowNodeSelector } from './gridRowsSelector';
import { GRID_ROOT_GROUP_ID } from './gridRowsUtils';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';

export const useGridRowsOverridableMethods = (apiRef: RefObject<GridPrivateApiCommunity>) => {
  const setRowIndex = React.useCallback(
    (rowId: GridRowId, targetIndex: number) => {
      const node = gridRowNodeSelector(apiRef, rowId);

      if (!node) {
        throw new Error(`MUI X: No row with id #${rowId} found.`);
      }

      if (node.parent !== GRID_ROOT_GROUP_ID) {
        throw new Error(`MUI X: The row reordering do not support reordering of grouped rows yet.`);
      }

      if (node.type !== 'leaf') {
        throw new Error(
          `MUI X: The row reordering do not support reordering of footer or grouping rows.`,
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
  };
};
