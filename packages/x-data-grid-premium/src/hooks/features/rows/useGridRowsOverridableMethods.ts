import * as React from 'react';
import {
  GridRowId,
  GridGroupNode,
  gridRowTreeSelector,
  gridRowNodeSelector,
  gridExpandedSortedRowIdsSelector,
  GridLeafNode,
  gridRowsLookupSelector,
} from '@mui/x-data-grid-pro';
import { RefObject } from '@mui/x-internals/types';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { gridRowGroupingModelSelector } from '../rowGrouping';

export const useGridRowsOverridableMethods = (apiRef: RefObject<GridPrivateApiPremium>) => {
  const setRowIndex = React.useCallback(
    (sourceRowId: GridRowId, targetOriginalIndex: number) => {
      const sourceNode = gridRowNodeSelector(apiRef, sourceRowId);
      const sortedFilteredRowIds = gridExpandedSortedRowIdsSelector(apiRef);
      const targetNode = gridRowNodeSelector(apiRef, sortedFilteredRowIds[targetOriginalIndex]);

      if (!sourceNode) {
        throw new Error(`MUI X: No row with id #${sourceRowId} found.`);
      }

      if (!targetNode) {
        throw new Error(`MUI X: No row at index '${targetOriginalIndex}' found.`);
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
       * | G ❌ | Group       | Group       | Different parents         | Not allowed, will break the row grouping criteria                           |
       */

      if (
        ((sourceNode.type === 'leaf' && targetNode.type === 'leaf') ||
          (sourceNode.type === 'group' && targetNode.type === 'group')) &&
        sourceNode.parent === targetNode.parent
      ) {
        // Cases A and B
        apiRef.current.setState((state) => {
          const group = gridRowTreeSelector(apiRef)[sourceNode.parent!] as GridGroupNode;
          const currentChildren = group.children;
          const oldIndex = currentChildren.findIndex((row) => row === sourceRowId);
          const targetIndex = currentChildren.findIndex((row) => row === targetNode.id);
          if (oldIndex === -1 || targetIndex === -1 || oldIndex === targetIndex) {
            return state;
          }
          const updatedChildren = [...currentChildren];
          updatedChildren.splice(targetIndex, 0, updatedChildren.splice(oldIndex, 1)[0]);

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
        (sourceNode.type === 'leaf' &&
          targetNode.type === 'leaf' &&
          sourceNode.parent !== targetNode.parent &&
          sourceNode.depth === targetNode.depth) ||
        (sourceNode.type === 'leaf' &&
          targetNode.type === 'group' &&
          targetNode.depth < sourceNode.depth)
      ) {
        // Case C & D
        const source = sourceNode as GridLeafNode;
        let target = targetNode;
        let isLastChild = false;
        if (target.type === 'group') {
          const prevIndex = targetOriginalIndex - 1;
          if (prevIndex < 0) {
            return;
          }
          const prevRowId = sortedFilteredRowIds[prevIndex];
          const leafTargetNode = gridRowNodeSelector(apiRef, prevRowId);
          if (!leafTargetNode || leafTargetNode.type !== 'leaf') {
            return;
          }
          target = leafTargetNode as GridLeafNode;
          isLastChild = true;
        }
        apiRef.current.setState((state) => {
          const sourceGroup = gridRowTreeSelector(apiRef)[source.parent] as GridGroupNode;
          const sourceChildren = sourceGroup.children;

          const targetGroup = gridRowTreeSelector(apiRef)[target.parent] as GridGroupNode;
          const targetChildren = targetGroup.children;

          const sourceIndex = sourceChildren.findIndex((row) => row === sourceRowId);
          const targetIndex = targetChildren.findIndex((row) => row === target.id);
          if (sourceIndex === -1 || targetIndex === -1) {
            return state;
          }

          const updatedSourceChildren = sourceChildren.filter((rowId) => rowId !== sourceRowId);

          let sourceGroupRemoved = false;
          const updatedTree = { ...state.rows.tree };
          if (updatedSourceChildren.length === 0) {
            delete updatedTree[sourceGroup.id];
            sourceGroupRemoved = true;
          }

          const updatedTargetChildren = isLastChild
            ? [...targetChildren, sourceRowId]
            : [
                ...targetChildren.slice(0, targetIndex),
                sourceRowId,
                ...targetChildren.slice(targetIndex),
              ];

          const dataRowIdToModelLookup = gridRowsLookupSelector(apiRef);
          const rowGroupingModel = gridRowGroupingModelSelector(apiRef);

          const sourceRow = { ...dataRowIdToModelLookup[sourceRowId] };
          const targetRow = dataRowIdToModelLookup[target.id];

          for (let i = 0; i < rowGroupingModel.length; i += 1) {
            const field = rowGroupingModel[i];
            // TODO: Accommodate `groupingValueSetter` and the data source counter part
            sourceRow[field] = targetRow[field];
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
                      [source.parent!]: {
                        ...sourceGroup,
                        children: updatedSourceChildren,
                      },
                    }),
                [target.parent]: {
                  ...targetGroup,
                  children: updatedTargetChildren,
                },
                [source.id]: {
                  ...source,
                  parent: target.parent,
                },
              },
              dataRowIdToModelLookup: {
                ...dataRowIdToModelLookup,
                [source.id]: sourceRow,
              },
            },
          };
        });
      } else {
        // Unsupported use cases, suppress the error instead of throwing it
        // TODO: Throw error in dev mode
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
