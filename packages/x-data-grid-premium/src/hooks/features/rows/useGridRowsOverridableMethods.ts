import * as React from 'react';
import {
  GridRowId,
  GridGroupNode,
  gridRowTreeSelector,
  gridRowNodeSelector,
  gridExpandedSortedRowIdsSelector,
  GridLeafNode,
  gridRowsLookupSelector,
  gridColumnLookupSelector,
  GridUpdateRowParams,
  GridValidRowModel,
} from '@mui/x-data-grid-pro';
import { RefObject } from '@mui/x-internals/types';
import { warnOnce } from '@mui/x-internals/warning';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { gridRowGroupingSanitizedModelSelector } from '../rowGrouping';
import { getGroupingRules, getCellGroupingCriteria } from '../rowGrouping/gridRowGroupingUtils';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

export const useGridRowsOverridableMethods = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<DataGridPremiumProcessedProps, 'processRowUpdate' | 'onProcessRowUpdateError'>,
) => {
  const { processRowUpdate, onProcessRowUpdateError } = props;

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
        apiRef.current.publishEvent('rowsSet');
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

        // Extract computation logic
        const sourceGroup = gridRowTreeSelector(apiRef)[source.parent] as GridGroupNode;
        const sourceChildren = sourceGroup.children;

        const targetGroup = gridRowTreeSelector(apiRef)[target.parent] as GridGroupNode;
        const targetChildren = targetGroup.children;

        const sourceIndex = sourceChildren.findIndex((row) => row === sourceRowId);
        const targetIndex = targetChildren.findIndex((row) => row === target.id);
        if (sourceIndex === -1 || targetIndex === -1) {
          return;
        }

        const dataRowIdToModelLookup = gridRowsLookupSelector(apiRef);
        const columnsLookup = gridColumnLookupSelector(apiRef);
        const sanitizedRowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);

        // Compute the updated source row
        const originalSourceRow = dataRowIdToModelLookup[sourceRowId];
        let updatedSourceRow = { ...originalSourceRow };
        const targetRow = dataRowIdToModelLookup[target.id];

        // Get grouping rules which include both getter and setter functions
        const groupingRules = getGroupingRules({
          sanitizedRowGroupingModel,
          columnsLookup,
        });

        // Update each grouping field on the source row
        for (const groupingRule of groupingRules) {
          const colDef = columnsLookup[groupingRule.field];

          if (groupingRule.groupingValueSetter && colDef) {
            const targetGroupingValue = getCellGroupingCriteria({
              row: targetRow,
              colDef,
              groupingRule,
              apiRef,
            }).key;

            updatedSourceRow = groupingRule.groupingValueSetter(
              targetGroupingValue,
              updatedSourceRow,
              colDef,
              apiRef,
            );
          } else {
            updatedSourceRow[groupingRule.field] = targetRow[groupingRule.field];
          }
        }

        const commitStateUpdate = (finalSourceRow: GridValidRowModel) => {
          apiRef.current.setState((state) => {
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

            const sourceGroupParent = sourceGroupRemoved
              ? (gridRowTreeSelector(apiRef)[sourceGroup.parent!] as GridGroupNode)
              : null;

            return {
              ...state,
              rows: {
                ...state.rows,
                totalTopLevelRowCount:
                  state.rows.totalTopLevelRowCount - (sourceGroupRemoved ? 1 : 0),
                tree: {
                  ...updatedTree,
                  ...(sourceGroupRemoved && sourceGroupParent
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
              },
            };
          });

          apiRef.current.updateRows([finalSourceRow]);
          apiRef.current.publishEvent('rowsSet');
        };

        if (processRowUpdate && !isDeepEqual(originalSourceRow, updatedSourceRow)) {
          const params: GridUpdateRowParams = {
            rowId: sourceRowId,
            previousRow: originalSourceRow,
            updatedRow: updatedSourceRow,
          };
          apiRef.current.setLoading(true);

          try {
            Promise.resolve(processRowUpdate(updatedSourceRow, originalSourceRow, params))
              .then((processedRow) => {
                const finalRow = processedRow || updatedSourceRow;
                commitStateUpdate(finalRow);
              })
              .catch((error) => {
                if (onProcessRowUpdateError) {
                  onProcessRowUpdateError(error);
                } else {
                  throw error;
                }
              })
              .finally(() => {
                apiRef.current.setLoading(false);
              });
          } catch (error) {
            apiRef.current.setLoading(false);
            if (onProcessRowUpdateError) {
              onProcessRowUpdateError(error);
            } else {
              throw error;
            }
          }
        } else {
          commitStateUpdate(updatedSourceRow);
        }
      } else {
        warnOnce(
          [
            'MUI X: The parameters provided to the `setRowIndex()` resulted in a no-op.',
            'Consider looking at the documentation at https://mui.com/x/react-data-grid/row-grouping/',
          ],
          'warning',
        );
      }
    },
    [apiRef, processRowUpdate, onProcessRowUpdateError],
  );

  return {
    setRowIndex,
  };
};
