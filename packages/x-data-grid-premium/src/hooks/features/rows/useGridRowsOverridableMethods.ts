import * as React from 'react';
import { GridRowId, GridGroupNode } from '@mui/x-data-grid-pro';
import {
  gridRowTreeSelector,
  gridRowNodeSelector,
  gridSortedRowIdsSelector,
} from '@mui/x-data-grid';
import { GridPrivateApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { RefObject } from '@mui/x-internals/types';

export const useGridRowsOverridableMethods = (apiRef: RefObject<GridPrivateApiPremium>) => {
  const setRowIndex = React.useCallback(
    (sourceRowId: GridRowId, targetOriginalIndex: number) => {
      const sourceNode = gridRowNodeSelector(apiRef, sourceRowId);
      const sortedFilteredRowIds = gridSortedRowIdsSelector(apiRef);
      const targetNode = gridRowNodeSelector(apiRef, sortedFilteredRowIds[targetOriginalIndex]);

      if (!sourceNode) {
        throw new Error(`MUI X: No row with id #${sourceRowId} found.`);
      }

      if (
        sourceNode.type === 'footer' ||
        (sourceNode.type === 'group' &&
          targetNode.type === 'group' &&
          sourceNode.parent !== targetNode.parent)
      ) {
        throw new Error(
          `MUI X: The row reordering do not support reordering of footer or grouping rows.`,
        );
      }

      /*
        USE CASES
        - 1. Source node and target node both are leaf nodes
          - 1a. Source node and target node both have same parent
            >> Source node and target node swap their positions (similar to the flat tree structure use case)
          - 1b. Source node and target node both have different parents
            >> Source node and target node swap their positions and the following information is updated in row tree.
              - `sourceNode.parent` is updated to `targetNode.parent`
              - `targetNode.parent` is updated to `sourceNode.parent`
              - `sourceNode.id` is removed from `sourceNode.parent.children` and added to `targetNode.parent.children`
              - `targetNode.id` is removed from `targetNode.parent.children` and added to `sourceNode.parent.children`
              
        - 2. Source node is a leaf node and target node is a group node
          - 2a. Target node is source node's parent
            >> Not allowed since it will technically have no difference
          - 2b. Source node and target node both have different parents
            >> Source node is moved as a child of target node
              - `sourceNode.parent` is updated to `targetNode.id`
              - `sourceNode.id` is removed from `sourceNode.parent.children`
              - `targetNode.children` is updated to `[sourceNode.id, ...targetNode.children]`

        - 3. Source node is a group node and target node is a leaf node
          >> Not allowed since it will break the row grouping criteria

        - 4. Source node is a group node and target node is a group node
          - 4a. Source node and target node both have same parent
            >> Source and target nodes swap their positions (along with their children)
          - 4b. Source node and target node both have different parents
            >> Not allowed since it will break the row grouping criteria
      */

      if (
        ((sourceNode.type === 'leaf' && targetNode.type === 'leaf') ||
          (sourceNode.type === 'group' && targetNode.type === 'group')) &&
        sourceNode.parent === targetNode.parent
      ) {
        apiRef.current.setState((state) => {
          const group = gridRowTreeSelector(apiRef)[sourceNode.parent!] as GridGroupNode;
          const currentChildren = group.children;
          const oldIndex = currentChildren.findIndex((row) => row === sourceRowId);
          const targetIndex = currentChildren.findIndex((row) => row === targetNode.id);
          if (oldIndex === -1 || targetIndex === -1 || oldIndex === targetIndex) {
            return state;
          }
          const updatedChildren = [...currentChildren];
          updatedChildren[oldIndex] = targetNode.id;
          updatedChildren[targetIndex] = sourceRowId;

          return {
            ...state,
            rows: {
              ...state.rows,
              tree: {
                ...state.rows.tree,
                [sourceNode.parent!]: {
                  ...group,
                  children: updatedChildren,
                },
              },
            },
          };
        });
      } else if (
        sourceNode.type === 'leaf' &&
        targetNode.type === 'leaf' &&
        sourceNode.parent !== targetNode.parent
      ) {
        apiRef.current.setState((state) => {
          const sourceGroup = gridRowTreeSelector(apiRef)[sourceNode.parent!] as GridGroupNode;
          const sourceChildren = sourceGroup.children;

          const targetGroup = gridRowTreeSelector(apiRef)[targetNode.parent!] as GridGroupNode;
          const targetChildren = targetGroup.children;

          const sourceIndex = sourceChildren.findIndex((row) => row === sourceRowId);
          const targetIndex = targetChildren.findIndex((row) => row === targetNode.id);
          if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
            return state;
          }

          const updatedSourceChildren = [...sourceChildren];
          updatedSourceChildren[sourceIndex] = targetNode.id;

          const updatedTargetChildren = [...targetChildren];
          updatedTargetChildren[targetIndex] = sourceRowId;

          return {
            ...state,
            rows: {
              ...state.rows,
              tree: {
                ...state.rows.tree,
                [sourceNode.parent!]: {
                  ...sourceGroup,
                  children: updatedSourceChildren,
                },
                [targetNode.parent!]: {
                  ...targetGroup,
                  children: updatedTargetChildren,
                },
                [sourceNode.id]: {
                  ...sourceNode,
                  parent: targetNode.parent,
                },
                [targetNode.id]: {
                  ...targetNode,
                  parent: sourceNode.parent,
                },
              },
            },
          };
        });
      } else if (
        sourceNode.type === 'leaf' &&
        targetNode.type === 'group' &&
        sourceNode.parent !== targetNode.id &&
        targetNode.depth < sourceNode.depth
      ) {
        apiRef.current.setState((state) => {
          const sourceGroup = gridRowTreeSelector(apiRef)[sourceNode.parent!] as GridGroupNode;
          const sourceChildren = sourceGroup.children;

          const targetChildren = targetNode.children;

          const updatedSourceChildren = [...sourceChildren].filter((row) => row !== sourceRowId);
          const updatedTargetChildren = [sourceRowId, ...targetChildren];

          return {
            ...state,
            rows: {
              ...state.rows,
              tree: {
                ...state.rows.tree,
                [sourceNode.parent!]: {
                  ...sourceGroup,
                  children: updatedSourceChildren,
                },
                [targetNode.id]: {
                  ...targetNode,
                  childrenExpanded: true,
                  children: updatedTargetChildren,
                },
                [sourceNode.id]: {
                  ...sourceNode,
                  parent: targetNode.id,
                },
              },
            },
          };
        });
      } else {
        // Unsupported use case
        return;
      }

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
