import * as React from 'react';
import { GridRowId, GridGroupNode } from '@mui/x-data-grid-pro';
import {
  gridRowTreeSelector,
  gridRowNodeSelector,
  gridSortedRowIdsSelector,
} from '@mui/x-data-grid';
import { RefObject } from '@mui/x-internals/types';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';

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

      /**
       * Logic Matrix
       * ============
       *
       * | Source Node | Target Node | Parent Relationship       | Action                                            |
       * | :---------- | :---------- | :------------------------ | :------------------------------------------------ |
       * | Leaf        | Leaf        | Same parent               | Swap positions (similar to flat tree structure)   |
       * | Group       | Group       | Same parent               | Swap positions (along with their descendants)     |
       * | Leaf        | Leaf        | Different parents         | Swap positions and update parent nodes in tree    |
       * | Leaf        | Group       | Different parents         | Make source a child of target                     |
       * | Leaf        | Group       | Target is source's parent | Not allowed, will have no difference              |
       * | Group       | Leaf        | Any                       | Not allowed, will break the row grouping criteria |
       * | Group       | Group       | Different parents         | Not allowed, will break the row grouping criteria |
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

          let sourceGroupRemoved = false;
          const updatedTree = { ...state.rows.tree };
          if (updatedSourceChildren.length === 0) {
            delete updatedTree[sourceGroup.id];
            sourceGroupRemoved = true;
          }

          const sourceGroupParent = gridRowTreeSelector(apiRef)[
            sourceGroup.parent!
          ] as GridGroupNode;

          return {
            ...state,
            rows: {
              ...state.rows,
              totalTopLevelRowCount:
                state.rows.totalTopLevelRowCount - (sourceGroupRemoved ? 1 : 0),
              tree: {
                ...updatedTree,
                ...(sourceGroupRemoved
                  ? {
                      [sourceGroupParent.id]: {
                        ...sourceGroupParent,
                        children: sourceGroupParent.children.filter(
                          (childId) => childId !== sourceGroup.id,
                        ),
                      },
                    }
                  : {
                      [sourceNode.parent!]: {
                        ...sourceGroup,
                        children: updatedSourceChildren,
                      },
                    }),
                [targetNode.id]: {
                  ...targetNode,
                  // Expand the target node to show the source node as a child
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
        // Unsupported use cases
        return;
      }

      apiRef.current.publishEvent('rowsSet');
    },
    [apiRef],
  );

  return {
    setRowIndex,
  };
};
