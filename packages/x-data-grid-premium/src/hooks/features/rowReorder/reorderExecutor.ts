/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  gridRowNodeSelector,
  gridRowTreeSelector,
  gridRowsLookupSelector,
  gridColumnLookupSelector,
} from '@mui/x-data-grid-pro';
import type {
  GridRowId,
  GridTreeNode,
  GridGroupNode,
  GridLeafNode,
  GridValidRowModel,
  GridUpdateRowParams,
} from '@mui/x-data-grid-pro';
import { warnOnce } from '@mui/x-internals/warning';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { gridRowGroupingSanitizedModelSelector } from '../rowGrouping';
import { getGroupingRules, getCellGroupingCriteria } from '../rowGrouping/gridRowGroupingUtils';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import {
  determineOperationType,
  calculateTargetIndex,
  collectAllLeafDescendants,
  getNodePathInTree,
  removeEmptyAncestors,
} from './utils';
import type { ReorderScenario, ReorderExecutionContext } from './types';

const reorderScenarios: ReorderScenario[] = [
  // ===== Cases A & B: Same Parent Swap =====
  {
    name: 'same-parent-swap',
    detectOperation: (ctx) => {
      const {
        sourceRowId,
        placeholderIndex,
        sortedFilteredRowIds,
        sortedFilteredRowIndexLookup,
        rowTree,
        apiRef,
      } = ctx;
      const sourceNode = gridRowNodeSelector(apiRef, sourceRowId);

      if (!sourceNode || sourceNode.type === 'footer') {
        return null;
      }

      let targetIndex = placeholderIndex;

      const sourceIndex = sortedFilteredRowIndexLookup[sourceRowId];

      if (targetIndex === sortedFilteredRowIds.length && sortedFilteredRowIds.length > 0) {
        targetIndex -= 1;
      }

      let targetNode = gridRowNodeSelector(apiRef, sortedFilteredRowIds[targetIndex]);

      if (placeholderIndex > sourceIndex && sourceNode.parent === targetNode.parent) {
        targetIndex = placeholderIndex - 1;
        targetNode = gridRowNodeSelector(apiRef, sortedFilteredRowIds[targetIndex]);
        if (targetNode && targetNode.depth !== sourceNode.depth) {
          while (targetNode.depth > sourceNode.depth && targetIndex >= 0) {
            targetIndex -= 1;
            targetNode = gridRowNodeSelector(apiRef, sortedFilteredRowIds[targetIndex]);
          }
        }
        if (targetIndex === -1) {
          return null;
        }
      }

      // Get initial target node at placeholder position (always the node next to the drop indicator)
      let isLastChild = false;

      if (!targetNode) {
        // If placeholder is at the end, use the last node
        if (placeholderIndex >= sortedFilteredRowIds.length && sortedFilteredRowIds.length > 0) {
          targetNode = gridRowNodeSelector(
            apiRef,
            sortedFilteredRowIds[sortedFilteredRowIds.length - 1],
          );
          isLastChild = true;
        } else {
          return null;
        }
      }

      // Apply some custom adjustments
      let adjustedTargetNode: GridTreeNode = targetNode;

      // Case A and B adjustment: Move to last child of parent where target should be the node above
      if (
        targetNode.type === 'group' &&
        sourceNode.parent !== targetNode.parent &&
        sourceNode.depth > targetNode.depth
      ) {
        // Find the first node with the same depth as source before target and quit early if a
        // node with depth < source.depth is found
        let i = targetIndex - 1;
        while (i >= 0) {
          const node = gridRowNodeSelector(apiRef, sortedFilteredRowIds[i]);
          if (node && node.depth < sourceNode.depth) {
            return null;
          }
          if (node && node.depth === sourceNode.depth) {
            targetIndex = i;
            adjustedTargetNode = node;
            break;
          }
          i -= 1;
        }
      }

      // Determine operation type
      const operationType = determineOperationType(sourceNode, adjustedTargetNode);

      if (operationType !== 'same-parent-swap') {
        return null;
      }

      // Calculate actual insertion index
      const actualTargetIndex = calculateTargetIndex(
        sourceNode,
        adjustedTargetNode,
        isLastChild,
        rowTree,
      );

      targetNode = adjustedTargetNode;

      // Both must be same type (leaf-leaf or group-group)
      if (sourceNode.type !== targetNode.type) {
        return null;
      }

      return {
        sourceNode,
        targetNode,
        actualTargetIndex,
        isLastChild,
        operationType,
      };
    },
    execute: (operation, ctx) => {
      const { sourceNode, actualTargetIndex } = operation;
      const { apiRef, sourceRowId } = ctx;

      apiRef.current.setState((state: any) => {
        const group = gridRowTreeSelector(apiRef)[sourceNode.parent!] as GridGroupNode;
        const currentChildren = [...group.children];
        const oldIndex = currentChildren.findIndex((row) => row === sourceRowId);

        if (oldIndex === -1 || actualTargetIndex === -1 || oldIndex === actualTargetIndex) {
          return state;
        }

        // Move item to new position
        currentChildren.splice(actualTargetIndex, 0, currentChildren.splice(oldIndex, 1)[0]);

        return {
          ...state,
          rows: {
            ...state.rows,
            tree: {
              ...state.rows.tree,
              [sourceNode.parent!]: {
                ...group,
                children: currentChildren,
              },
            },
          },
        };
      });

      apiRef.current.publishEvent('rowsSet');
    },
  },

  // ===== Cases C & D: Cross-Parent Leaf Move =====
  {
    name: 'cross-parent-leaf',
    detectOperation: (ctx) => {
      const { sourceRowId, placeholderIndex, sortedFilteredRowIds, rowTree, apiRef } = ctx;

      const sourceNode = gridRowNodeSelector(apiRef, sourceRowId);

      if (!sourceNode || sourceNode.type === 'footer') {
        return null;
      }

      let targetNode = gridRowNodeSelector(apiRef, sortedFilteredRowIds[placeholderIndex]);
      let isLastChild = false;

      if (!targetNode) {
        // If placeholder is at the end, use the last node
        if (placeholderIndex >= sortedFilteredRowIds.length && sortedFilteredRowIds.length > 0) {
          targetNode = gridRowNodeSelector(
            apiRef,
            sortedFilteredRowIds[sortedFilteredRowIds.length - 1],
          );
          isLastChild = true;
        } else {
          return null;
        }
      }

      let adjustedTargetNode = targetNode;

      // Case D adjustment: Leaf to group where we need previous leaf
      if (
        sourceNode.type === 'leaf' &&
        targetNode.type === 'group' &&
        targetNode.depth < sourceNode.depth
      ) {
        const prevIndex = placeholderIndex - 1;
        if (prevIndex >= 0) {
          const prevRowId = sortedFilteredRowIds[prevIndex];
          const leafTargetNode = gridRowNodeSelector(apiRef, prevRowId);
          if (leafTargetNode && leafTargetNode.type === 'leaf') {
            adjustedTargetNode = leafTargetNode as GridLeafNode;
            isLastChild = true;
          }
        }
      }

      // Determine operation type
      const operationType = determineOperationType(sourceNode, adjustedTargetNode);

      if (operationType !== 'cross-parent-leaf') {
        return null;
      }

      // Calculate actual insertion index
      const actualTargetIndex = calculateTargetIndex(
        sourceNode,
        adjustedTargetNode,
        isLastChild,
        rowTree,
      );

      targetNode = adjustedTargetNode;

      // Validate depth constraints
      if (sourceNode.type === 'leaf' && targetNode.type === 'leaf') {
        // Case C: Leaves must be at same depth
        if (sourceNode.depth !== targetNode.depth) {
          return null;
        }
      } else if (sourceNode.type === 'leaf' && targetNode.type === 'group') {
        // Case D: Special depth relationship required
        if (targetNode.depth >= sourceNode.depth) {
          return null;
        }
      }

      return {
        sourceNode,
        targetNode: adjustedTargetNode,
        actualTargetIndex,
        isLastChild,
        operationType,
      };
    },
    execute: async (operation, ctx) => {
      const { sourceNode, targetNode, isLastChild } = operation;
      const { apiRef, sourceRowId, processRowUpdate, onProcessRowUpdateError } = ctx;

      // Determine actual target for leaf operations
      let target = targetNode;
      if (targetNode.type === 'group') {
        // Already adjusted in detector, but ensure it's a leaf
        const prevIndex = ctx.placeholderIndex - 1;
        if (prevIndex >= 0) {
          const prevRowId = ctx.sortedFilteredRowIds[prevIndex];
          const prevNode = gridRowNodeSelector(apiRef, prevRowId);
          if (prevNode && prevNode.type === 'leaf') {
            target = prevNode;
          }
        }
      }

      const rowTree = gridRowTreeSelector(apiRef);
      const sourceGroup = rowTree[sourceNode.parent!] as GridGroupNode;
      const targetGroup = rowTree[target.parent!] as GridGroupNode;

      const sourceChildren = sourceGroup.children;
      const targetChildren = targetGroup.children;

      const sourceIndex = sourceChildren.findIndex((row) => row === sourceRowId);
      const targetIndex = targetChildren.findIndex((row) => row === target.id);

      if (sourceIndex === -1 || targetIndex === -1) {
        return;
      }

      // Get necessary data for row updates
      const dataRowIdToModelLookup = gridRowsLookupSelector(apiRef);
      const columnsLookup = gridColumnLookupSelector(apiRef);
      const sanitizedRowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);

      // Calculate updated row
      const originalSourceRow = dataRowIdToModelLookup[sourceRowId];
      let updatedSourceRow = { ...originalSourceRow };
      const targetRow = dataRowIdToModelLookup[target.id];

      // Get grouping rules
      const groupingRules = getGroupingRules({
        sanitizedRowGroupingModel,
        columnsLookup,
      });

      // Update grouping fields
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

      // Commit function
      const commitStateUpdate = (finalSourceRow: GridValidRowModel) => {
        apiRef.current.setState((state: any) => {
          const updatedSourceChildren = sourceChildren.filter((rowId) => rowId !== sourceRowId);
          const updatedTree = { ...state.rows.tree };
          const removedGroups = new Set<GridRowId>();
          let rootLevelRemovals = 0;

          if (updatedSourceChildren.length === 0) {
            removedGroups.add(sourceGroup.id);
            rootLevelRemovals = removeEmptyAncestors(
              sourceGroup.parent!,
              updatedTree,
              removedGroups,
            );
          }

          removedGroups.forEach((groupId) => {
            const group = updatedTree[groupId] as GridGroupNode;
            if (group && group.parent && updatedTree[group.parent]) {
              const parent = updatedTree[group.parent] as GridGroupNode;
              updatedTree[group.parent] = {
                ...parent,
                children: parent.children.filter((childId) => childId !== groupId),
              };
            }
            delete updatedTree[groupId];
          });

          if (!removedGroups.has(sourceGroup.id)) {
            updatedTree[sourceNode.parent!] = {
              ...sourceGroup,
              children: updatedSourceChildren,
            };
          }

          const updatedTargetChildren = isLastChild
            ? [...targetChildren, sourceRowId]
            : [
                ...targetChildren.slice(0, targetIndex),
                sourceRowId,
                ...targetChildren.slice(targetIndex),
              ];

          updatedTree[target.parent!] = {
            ...targetGroup,
            children: updatedTargetChildren,
          };

          updatedTree[sourceNode.id] = {
            ...sourceNode,
            parent: target.parent,
          };

          return {
            ...state,
            rows: {
              ...state.rows,
              totalTopLevelRowCount: state.rows.totalTopLevelRowCount - rootLevelRemovals,
              tree: updatedTree,
            },
          };
        });

        apiRef.current.updateRows([finalSourceRow]);
        apiRef.current.publishEvent('rowsSet');
      };

      // Handle async update if needed
      if (processRowUpdate && !isDeepEqual(originalSourceRow, updatedSourceRow)) {
        const params: GridUpdateRowParams = {
          rowId: sourceRowId,
          previousRow: originalSourceRow,
          updatedRow: updatedSourceRow,
        };
        apiRef.current.setLoading(true);

        try {
          const processedRow = await processRowUpdate(updatedSourceRow, originalSourceRow, params);
          const finalRow = processedRow || updatedSourceRow;
          commitStateUpdate(finalRow);
        } catch (error) {
          apiRef.current.setLoading(false);
          if (onProcessRowUpdateError) {
            onProcessRowUpdateError(error);
          } else if (process.env.NODE_ENV !== 'production') {
            warnOnce(
              [
                'MUI X: A call to `processRowUpdate()` threw an error which was not handled because `onProcessRowUpdateError()` is missing.',
                'To handle the error pass a callback to the `onProcessRowUpdateError()` prop, for example `<DataGrid onProcessRowUpdateError={(error) => ...} />`.',
                'For more detail, see https://mui.com/x/react-data-grid/editing/persistence/.',
              ],
              'error',
            );
          }
        } finally {
          apiRef.current.setLoading(false);
        }
      } else {
        commitStateUpdate(updatedSourceRow);
      }
    },
  },

  // ===== Case G: Cross-Parent Group Move =====
  {
    name: 'cross-parent-group',
    detectOperation: (ctx) => {
      const { sourceRowId, placeholderIndex, sortedFilteredRowIds, rowTree, apiRef } = ctx;

      const sourceNode = gridRowNodeSelector(apiRef, sourceRowId);

      if (!sourceNode || sourceNode.type === 'footer') {
        return null;
      }

      let targetIndex = placeholderIndex;
      let targetNode = gridRowNodeSelector(apiRef, sortedFilteredRowIds[placeholderIndex]);

      // Get initial target node at placeholder position (always the node next to the drop indicator)
      let isLastChild = false;

      if (!targetNode) {
        // If placeholder is at the end, use the last node
        if (placeholderIndex >= sortedFilteredRowIds.length && sortedFilteredRowIds.length > 0) {
          targetNode = gridRowNodeSelector(
            apiRef,
            sortedFilteredRowIds[sortedFilteredRowIds.length - 1],
          );
          targetIndex = sortedFilteredRowIds.length - 1;
          isLastChild = true;
        } else {
          return null;
        }
      }

      let adjustedTargetNode = targetNode;

      // Case G adjustment: Group to different parent at different depth
      if (
        sourceNode.type === 'group' &&
        targetNode.type === 'group' &&
        sourceNode.parent !== targetNode.parent &&
        sourceNode.depth > targetNode.depth
      ) {
        let prevIndex = targetIndex - 1;
        if (prevIndex < 0) {
          return null;
        }
        let prevNode = gridRowNodeSelector(apiRef, sortedFilteredRowIds[prevIndex]);
        if (prevNode && prevNode.depth !== sourceNode.depth) {
          while (prevNode.depth > sourceNode.depth && prevIndex >= 0) {
            prevIndex -= 1;
            prevNode = gridRowNodeSelector(apiRef, sortedFilteredRowIds[prevIndex]);
          }
        }
        if (!prevNode || prevNode.type !== 'group' || prevNode.depth !== sourceNode.depth) {
          return null;
        }
        isLastChild = true;
        adjustedTargetNode = prevNode as GridGroupNode;
      }

      // Determine operation type
      const operationType = determineOperationType(sourceNode, adjustedTargetNode);

      if (operationType !== 'cross-parent-group') {
        return null;
      }

      // Calculate actual insertion index
      const actualTargetIndex = calculateTargetIndex(
        sourceNode,
        adjustedTargetNode,
        isLastChild,
        rowTree,
      );

      const operation = {
        sourceNode,
        targetNode: adjustedTargetNode,
        actualTargetIndex,
        isLastChild,
        operationType,
      };

      targetNode = adjustedTargetNode;

      // Groups must maintain same depth
      if (sourceNode.depth !== targetNode.depth) {
        return null;
      }

      return operation;
    },
    execute: async (operation, ctx) => {
      const { sourceNode, targetNode, isLastChild } = operation;
      const { apiRef, processRowUpdate, onProcessRowUpdateError } = ctx;

      const tree = gridRowTreeSelector(apiRef);
      const dataRowIdToModelLookup = gridRowsLookupSelector(apiRef);
      const columnsLookup = gridColumnLookupSelector(apiRef);
      const sanitizedRowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);

      // Collect all leaf descendants
      const allLeafIds = collectAllLeafDescendants(sourceNode as GridGroupNode, tree);

      if (allLeafIds.length === 0) {
        return;
      }

      // Initialize batch updater
      const updater = new GroupMoveRowUpdater(processRowUpdate, onProcessRowUpdateError);

      // Prepare updated rows
      const groupingRules = getGroupingRules({
        sanitizedRowGroupingModel,
        columnsLookup,
      });

      const targetParentPath = getNodePathInTree({ id: targetNode.parent!, tree });

      for (const leafId of allLeafIds) {
        const originalRow = dataRowIdToModelLookup[leafId];
        let updatedRow = { ...originalRow };

        for (let depth = 0; depth < targetParentPath.length; depth += 1) {
          const pathItem = targetParentPath[depth];
          if (pathItem.field) {
            const groupingRule = groupingRules.find((rule) => rule.field === pathItem.field);
            if (groupingRule) {
              const colDef = columnsLookup[groupingRule.field];
              if (groupingRule.groupingValueSetter && colDef) {
                updatedRow = groupingRule.groupingValueSetter(
                  pathItem.key,
                  updatedRow,
                  colDef,
                  apiRef,
                );
              } else {
                updatedRow[groupingRule.field] = pathItem.key;
              }
            }
          }
        }

        updater.queueRowUpdate(leafId, originalRow, updatedRow);
      }

      // Execute updates
      apiRef.current.setLoading(true);

      try {
        const { successful, failed, updates } = await updater.executeUpdates();

        if (successful.length > 0) {
          apiRef.current.setState((state: any) => {
            const updatedTree = { ...state.rows.tree };
            const treeDepths = { ...state.rows.treeDepths };
            let rootLevelRemovals = 0;

            if (failed.length === 0) {
              // Complete success: move entire group
              const sourceParentNode = updatedTree[sourceNode.parent!] as GridGroupNode;

              // Check if source parent still exists (it might have been removed in a previous operation)
              if (!sourceParentNode) {
                const targetParentNode = updatedTree[targetNode.parent!] as GridGroupNode;
                const targetIndex = targetParentNode.children.indexOf(targetNode.id);
                const newTargetChildren = [...targetParentNode.children];

                if (isLastChild) {
                  newTargetChildren.push(sourceNode.id);
                } else {
                  newTargetChildren.splice(targetIndex, 0, sourceNode.id);
                }

                updatedTree[targetNode.parent!] = {
                  ...targetParentNode,
                  children: newTargetChildren,
                };

                updatedTree[sourceNode.id] = {
                  ...sourceNode,
                  parent: targetNode.parent,
                };
              } else {
                const updatedSourceParentChildren = sourceParentNode.children.filter(
                  (id) => id !== sourceNode.id,
                );

                // Check if source parent becomes empty and handle cascading removals
                if (updatedSourceParentChildren.length === 0) {
                  const removedGroups = new Set<GridRowId>();
                  removedGroups.add(sourceNode.parent!);

                  // Check and remove empty ancestors
                  const parentOfSourceParent = (updatedTree[sourceNode.parent!] as GridGroupNode)
                    .parent;
                  if (parentOfSourceParent) {
                    rootLevelRemovals = removeEmptyAncestors(parentOfSourceParent, updatedTree, removedGroups);
                  }

                  // Apply the removals to the tree
                  removedGroups.forEach((groupId) => {
                    const group = updatedTree[groupId] as GridGroupNode;
                    if (group && group.parent && updatedTree[group.parent]) {
                      const parent = updatedTree[group.parent] as GridGroupNode;
                      updatedTree[group.parent] = {
                        ...parent,
                        children: parent.children.filter((childId) => childId !== groupId),
                      };
                    }
                    delete updatedTree[groupId];
                  });
                } else {
                  // Update source parent if it wasn't removed
                  updatedTree[sourceNode.parent!] = {
                    ...sourceParentNode,
                    children: updatedSourceParentChildren,
                  };
                }

                // Update target parent
                const targetParentNode = updatedTree[targetNode.parent!] as GridGroupNode;
                const targetIndex = targetParentNode.children.indexOf(targetNode.id);
                const newTargetChildren = [...targetParentNode.children];

                if (isLastChild) {
                  newTargetChildren.push(sourceNode.id);
                } else {
                  newTargetChildren.splice(targetIndex, 0, sourceNode.id);
                }

                updatedTree[targetNode.parent!] = {
                  ...targetParentNode,
                  children: newTargetChildren,
                };

                updatedTree[sourceNode.id] = {
                  ...sourceNode,
                  parent: targetNode.parent,
                };
              }
            }
            // Handle partial success case...

            return {
              ...state,
              rows: {
                ...state.rows,
                totalTopLevelRowCount: state.rows.totalTopLevelRowCount - rootLevelRemovals,
                tree: updatedTree,
                treeDepths,
              },
            };
          });

          apiRef.current.updateRows(updates);
          apiRef.current.publishEvent('rowsSet');
        }
      } finally {
        apiRef.current.setLoading(false);
      }
    },
  },
];

class RowReorderExecutor {
  private scenarios: ReorderScenario[];

  constructor(scenarios: ReorderScenario[]) {
    this.scenarios = scenarios;
  }

  async execute(ctx: ReorderExecutionContext): Promise<void> {
    // Try each scenario in order
    for (const scenario of this.scenarios) {
      const operation = scenario.detectOperation(ctx);

      if (operation) {
        // eslint-disable-next-line no-await-in-loop
        await scenario.execute(operation, ctx);
        return;
      }
    }

    warnOnce(
      [
        'MUI X: The parameters provided to the `setRowIndex()` resulted in a no-op.',
        'Consider looking at the documentation at https://mui.com/x/react-data-grid/row-grouping/',
      ],
      'warning',
    );
  }
}

// Class to handle updates with partial failure tracking
class GroupMoveRowUpdater {
  private rowsToUpdate = new Map<GridRowId, GridValidRowModel>();

  private originalRows = new Map<GridRowId, GridValidRowModel>();

  private successfulRowIds = new Set<GridRowId>();

  private failedRowIds = new Set<GridRowId>();

  private pendingRowUpdates: GridValidRowModel[] = [];

  constructor(
    private processRowUpdate: DataGridPremiumProcessedProps['processRowUpdate'] | undefined,
    private onProcessRowUpdateError:
      | DataGridPremiumProcessedProps['onProcessRowUpdateError']
      | undefined,
  ) {}

  queueRowUpdate(rowId: GridRowId, originalRow: GridValidRowModel, updatedRow: GridValidRowModel) {
    this.originalRows.set(rowId, originalRow);
    this.rowsToUpdate.set(rowId, updatedRow);
  }

  async executeUpdates(): Promise<{
    successful: GridRowId[];
    failed: GridRowId[];
    updates: GridValidRowModel[];
  }> {
    const rowIds = Array.from(this.rowsToUpdate.keys());

    if (rowIds.length === 0) {
      return { successful: [], failed: [], updates: [] };
    }

    // Handle each row update, tracking success/failure
    const handleRowUpdate = async (rowId: GridRowId) => {
      const newRow = this.rowsToUpdate.get(rowId)!;
      const oldRow = this.originalRows.get(rowId)!;

      try {
        if (typeof this.processRowUpdate === 'function') {
          const params: GridUpdateRowParams = {
            rowId,
            previousRow: oldRow,
            updatedRow: newRow,
          };
          const finalRow = await this.processRowUpdate(newRow, oldRow, params);
          this.pendingRowUpdates.push(finalRow || newRow);
          this.successfulRowIds.add(rowId);
        } else {
          this.pendingRowUpdates.push(newRow);
          this.successfulRowIds.add(rowId);
        }
      } catch (error) {
        this.failedRowIds.add(rowId);
        if (this.onProcessRowUpdateError) {
          this.onProcessRowUpdateError(error);
        } else if (process.env.NODE_ENV !== 'production') {
          warnOnce(
            [
              'MUI X: A call to `processRowUpdate()` threw an error which was not handled because `onProcessRowUpdateError()` is missing.',
              'To handle the error pass a callback to the `onProcessRowUpdateError()` prop, for example `<DataGrid onProcessRowUpdateError={(error) => ...} />`.',
              'For more detail, see https://mui.com/x/react-data-grid/editing/persistence/.',
            ],
            'error',
          );
        }
      }
    };

    // Use Promise.all with wrapped promises to avoid Promise.allSettled (browser support)
    // This pattern is taken from the clipboard import implementation
    const promises = rowIds.map((rowId) => {
      return new Promise<void>((resolve) => {
        handleRowUpdate(rowId).then(resolve).catch(resolve);
      });
    });

    await Promise.all(promises);

    return {
      successful: Array.from(this.successfulRowIds),
      failed: Array.from(this.failedRowIds),
      updates: this.pendingRowUpdates,
    };
  }
}

export const rowGroupingReorderExecutor = new RowReorderExecutor(reorderScenarios);
