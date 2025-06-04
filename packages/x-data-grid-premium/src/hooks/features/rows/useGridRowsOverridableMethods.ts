import * as React from 'react';
import { GridRowId, GridGroupNode } from '@mui/x-data-grid-pro';
import { gridRowTreeSelector, gridRowNodeSelector, GRID_ROOT_GROUP_ID } from '@mui/x-data-grid';
import { GridPrivateApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { RefObject } from '@mui/x-internals/types';

export const useGridRowsOverridableMethods = (apiRef: RefObject<GridPrivateApiPremium>) => {
  const setRowIndex = React.useCallback(
    (rowId: GridRowId, targetIndex: number) => {
      const node = gridRowNodeSelector(apiRef, rowId);

      if (!node) {
        throw new Error(`MUI X: No row with id #${rowId} found.`);
      }

      // if (node.parent !== GRID_ROOT_GROUP_ID) {
      //   throw new Error(`MUI X: The row reordering do not support reordering of grouped rows yet.`);
      // }

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

  return React.useMemo(
    () => ({
      setRowIndex,
    }),
    [setRowIndex],
  );
};
