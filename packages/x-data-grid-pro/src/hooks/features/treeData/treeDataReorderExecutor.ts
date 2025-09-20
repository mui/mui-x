/* eslint-disable class-methods-use-this */
import { gridRowNodeSelector, gridRowTreeSelector, gridRowsLookupSelector } from '@mui/x-data-grid';
import type {
  GridTreeNode,
  GridGroupNode,
  GridUpdateRowParams,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { warnOnce } from '@mui/x-internals/warning';
import { BaseReorderOperation, RowReorderExecutor } from '../rowReorder/reorderExecutor';
import { type ReorderOperation, type ReorderExecutionContext } from '../rowReorder/types';
import {
  determineOperationType,
  calculateTargetIndex,
  BatchRowUpdater,
  handleProcessRowUpdateError,
  collectAllDescendants,
  isDescendantOf,
  buildTreeDataPath,
  updateDescendantDepths,
} from '../rowReorder/utils';

/**
 * Handles reordering of items within the same parent group.
 */
class SameParentSwapOperation extends BaseReorderOperation {
  readonly operationType = 'same-parent-swap';

  detectOperation(ctx: ReorderExecutionContext): ReorderOperation | null {
    if (ctx.dropPosition === 'over') {
      return null;
    }

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

    let isLastChild = false;
    if (!targetNode) {
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

    let adjustedTargetNode: GridTreeNode = targetNode;

    // Case A and B adjustment
    if (
      targetNode.type === 'group' &&
      sourceNode.parent !== targetNode.parent &&
      sourceNode.depth > targetNode.depth
    ) {
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

    const operationType = determineOperationType(sourceNode, adjustedTargetNode);
    if (operationType !== 'same-parent-swap') {
      return null;
    }

    const actualTargetIndex = calculateTargetIndex(
      sourceNode,
      adjustedTargetNode,
      isLastChild,
      rowTree,
    );

    targetNode = adjustedTargetNode;

    return {
      sourceNode,
      targetNode,
      actualTargetIndex,
      isLastChild,
      operationType,
    };
  }

  executeOperation(operation: ReorderOperation, ctx: ReorderExecutionContext): void {
    const { sourceNode, actualTargetIndex } = operation;
    const { apiRef, sourceRowId } = ctx;

    apiRef.current.setState((state: any) => {
      const group = gridRowTreeSelector(apiRef)[sourceNode.parent!] as GridGroupNode;
      const currentChildren = [...group.children];
      const oldIndex = currentChildren.findIndex((row) => row === sourceRowId);

      if (oldIndex === -1 || actualTargetIndex === -1 || oldIndex === actualTargetIndex) {
        return state;
      }

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
  }
}

/**
 * Handles moving leaf nodes between different parents.
 */
class CrossParentLeafOperation extends BaseReorderOperation {
  readonly operationType = 'cross-parent-leaf';

  detectOperation(ctx: ReorderExecutionContext): ReorderOperation | null {
    // Fail for "over" position - let DropOnLeafOperation handle it
    if (ctx.dropPosition === 'over') {
      return null;
    }

    const {
      sourceRowId,
      placeholderIndex,
      sortedFilteredRowIds,
      rowTree,
      apiRef,
      setTreeDataPath,
    } = ctx;

    const sourceNode = gridRowNodeSelector(apiRef, sourceRowId);
    if (!sourceNode || sourceNode.type !== 'leaf') {
      return null;
    }

    // Check if setTreeDataPath is provided
    if (!setTreeDataPath) {
      if (process.env.NODE_ENV !== 'production') {
        warnOnce(
          'MUI X: Cross-parent reordering requires `setTreeDataPath()` prop to update row data paths. ' +
            'Please provide a `setTreeDataPath()` function to enable this feature.',
          'warning',
        );
      }
      return null;
    }

    // Find target node
    let targetIndex = placeholderIndex;
    if (targetIndex >= sortedFilteredRowIds.length && sortedFilteredRowIds.length > 0) {
      targetIndex = sortedFilteredRowIds.length - 1;
    }

    if (targetIndex < 0) {
      return null;
    }

    const targetNode = gridRowNodeSelector(apiRef, sortedFilteredRowIds[targetIndex]);
    if (!targetNode) {
      return null;
    }

    // Check if it's actually a cross-parent operation
    if (sourceNode.parent === targetNode.parent) {
      return null;
    }

    // Calculate where in the target parent this should go
    const actualTargetIndex = calculateTargetIndex(
      sourceNode,
      targetNode,
      placeholderIndex >= sortedFilteredRowIds.length,
      rowTree,
    );

    return {
      sourceNode,
      targetNode,
      actualTargetIndex,
      isLastChild: placeholderIndex >= sortedFilteredRowIds.length,
      operationType: 'cross-parent-leaf',
    };
  }

  async executeOperation(operation: ReorderOperation, ctx: ReorderExecutionContext): Promise<void> {
    const { sourceNode, targetNode, actualTargetIndex } = operation;
    const { apiRef, setTreeDataPath, processRowUpdate, onProcessRowUpdateError } = ctx;

    const rowTree = gridRowTreeSelector(apiRef);
    const dataRowIdToModelLookup = gridRowsLookupSelector(apiRef);

    // Get the target parent's path
    const targetParentNode = rowTree[targetNode.parent!];
    const targetPath = buildTreeDataPath(targetParentNode, rowTree);

    // Add the leaf's own key to the path
    const leafKey = sourceNode.type === 'leaf' ? sourceNode.groupingKey : null;
    const newPath = leafKey !== null ? [...targetPath, String(leafKey)] : targetPath;

    // Update the row data
    const originalRow = dataRowIdToModelLookup[sourceNode.id];
    let updatedRow = setTreeDataPath!(newPath, originalRow);

    // Process row update if needed
    if (processRowUpdate) {
      try {
        apiRef.current.setLoading(true);
        const processedRow = await processRowUpdate(updatedRow, originalRow, {
          rowId: sourceNode.id,
          previousRow: originalRow,
          updatedRow,
        } as GridUpdateRowParams);
        updatedRow = processedRow || updatedRow;
      } catch (error) {
        handleProcessRowUpdateError(error, onProcessRowUpdateError);
        return;
      } finally {
        apiRef.current.setLoading(false);
      }
    }

    // Update tree structure
    apiRef.current.setState((state: any) => {
      const updatedTree = { ...state.rows.tree };

      // Remove from source parent
      const sourceParent = updatedTree[sourceNode.parent!] as GridGroupNode;
      const sourceChildren = sourceParent.children.filter((id) => id !== sourceNode.id);

      // Convert source parent to leaf if now empty
      if (sourceChildren.length === 0) {
        updatedTree[sourceNode.parent!] = {
          ...sourceParent,
          type: 'leaf',
          children: undefined,
        };
      } else {
        updatedTree[sourceNode.parent!] = {
          ...sourceParent,
          children: sourceChildren,
        };
      }

      // Add to target parent
      const targetParent = updatedTree[targetNode.parent!] as GridGroupNode;
      const targetChildren = [...targetParent.children];
      targetChildren.splice(actualTargetIndex, 0, sourceNode.id);

      updatedTree[targetNode.parent!] = {
        ...targetParent,
        children: targetChildren,
      };

      // Update the node's parent reference and depth
      const parentNode = updatedTree[targetNode.parent!];
      updatedTree[sourceNode.id] = {
        ...sourceNode,
        parent: targetNode.parent,
        depth: parentNode.depth + 1,
      };

      return {
        ...state,
        rows: {
          ...state.rows,
          tree: updatedTree,
        },
      };
    });

    // Update the row in the grid
    apiRef.current.updateRows([updatedRow]);
    apiRef.current.publishEvent('rowsSet');
  }
}

/**
 * Handles dropping any node (leaf or group) "over" a leaf node.
 * This converts the target leaf into a parent group and makes the dragged node its child.
 */
class DropOnLeafOperation extends BaseReorderOperation {
  readonly operationType = 'drop-on-leaf';

  detectOperation(ctx: ReorderExecutionContext): ReorderOperation | null {
    const {
      sourceRowId,
      dropPosition,
      placeholderIndex,
      sortedFilteredRowIds,
      apiRef,
      setTreeDataPath,
    } = ctx;

    // Only applies to "over" drop position
    if (dropPosition !== 'over') {
      return null;
    }

    const sourceNode = gridRowNodeSelector(apiRef, sourceRowId);
    if (!sourceNode || sourceNode.type === 'footer') {
      return null;
    }

    // Check if setTreeDataPath is provided
    if (!setTreeDataPath) {
      if (process.env.NODE_ENV !== 'production') {
        warnOnce(
          'MUI X: Drop on leaf reordering requires `setTreeDataPath()` prop to update row data paths. ' +
            'Please provide a `setTreeDataPath()` function to enable this feature.',
          'warning',
        );
      }
      return null;
    }

    // Find target node
    let targetIndex = placeholderIndex;
    if (targetIndex >= sortedFilteredRowIds.length && sortedFilteredRowIds.length > 0) {
      targetIndex = sortedFilteredRowIds.length - 1;
    }

    if (targetIndex < 0) {
      return null;
    }

    const targetNode = gridRowNodeSelector(apiRef, sortedFilteredRowIds[targetIndex]);
    if (!targetNode || targetNode.type !== 'leaf') {
      return null;
    }

    // Target leaf will become a parent, so the actual target index is 0 (first child)
    const actualTargetIndex = 0;

    return {
      sourceNode,
      targetNode,
      actualTargetIndex,
      isLastChild: false,
      operationType: 'drop-on-leaf',
    };
  }

  async executeOperation(operation: ReorderOperation, ctx: ReorderExecutionContext): Promise<void> {
    const { sourceNode, targetNode } = operation;
    const { apiRef, setTreeDataPath, processRowUpdate, onProcessRowUpdateError } = ctx;

    const rowTree = gridRowTreeSelector(apiRef);
    const dataRowIdToModelLookup = gridRowsLookupSelector(apiRef);

    // Build target path for the new structure
    const targetPath = buildTreeDataPath(targetNode, rowTree);
    let rowsToUpdate: GridValidRowModel[] = [];

    // Handle source node path updates
    if (sourceNode.type === 'leaf') {
      // Simple leaf move
      const leafKey = sourceNode.groupingKey;
      const newPath = [...targetPath, String(leafKey)];

      const originalRow = dataRowIdToModelLookup[sourceNode.id];
      let updatedRow = setTreeDataPath!(newPath, originalRow);

      // Process row update if needed
      if (processRowUpdate) {
        try {
          apiRef.current.setLoading(true);
          const processedRow = await processRowUpdate(updatedRow, originalRow, {
            rowId: sourceNode.id,
            previousRow: originalRow,
            updatedRow,
          } as GridUpdateRowParams);
          updatedRow = processedRow || updatedRow;
        } catch (error) {
          handleProcessRowUpdateError(error, onProcessRowUpdateError);
          return;
        } finally {
          apiRef.current.setLoading(false);
        }
      }

      rowsToUpdate.push(updatedRow);
    } else {
      // Group move - update entire hierarchy
      const nodesToUpdate = collectAllDescendants(sourceNode as GridGroupNode, rowTree);
      nodesToUpdate.unshift(sourceNode); // Include the group itself

      // Calculate the original base path depth
      const sourceParentNode = rowTree[sourceNode.parent!];
      const sourceBasePath = buildTreeDataPath(sourceParentNode, rowTree);
      const sourceDepth = sourceBasePath.length;

      // Use BatchRowUpdater for efficient batch processing
      const updater = new BatchRowUpdater(apiRef, processRowUpdate, onProcessRowUpdateError);

      // Queue all row updates for batch processing
      for (const node of nodesToUpdate) {
        const originalRow = dataRowIdToModelLookup[node.id];

        // Get the current path
        const currentPath = buildTreeDataPath(node, rowTree);

        // Calculate relative path from the moved group
        const relativePath = currentPath.slice(sourceDepth);

        // Build new path under target leaf
        const newPath = [...targetPath, ...relativePath];

        // Update row data path
        const updatedRow = setTreeDataPath!(newPath, originalRow);

        // Queue the update (BatchRowUpdater will handle processRowUpdate)
        updater.queueUpdate(node.id, originalRow, updatedRow);
      }

      try {
        // Execute all batch updates
        const { successful, updates } = await updater.executeAll();

        // Only proceed with tree updates if we have successful updates
        if (successful.length === 0) {
          return;
        }

        rowsToUpdate = updates;
      } catch (error) {
        handleProcessRowUpdateError(error, onProcessRowUpdateError);
        return;
      }
    }

    // Update tree structure
    apiRef.current.setState((state: any) => {
      const updatedTree = { ...state.rows.tree };

      // Remove source from its current parent
      const sourceParent = updatedTree[sourceNode.parent!] as GridGroupNode;
      const sourceChildren = sourceParent.children.filter((id) => id !== sourceNode.id);

      // Convert source parent to leaf if now empty
      if (sourceChildren.length === 0) {
        updatedTree[sourceNode.parent!] = {
          ...sourceParent,
          type: 'leaf',
          children: undefined,
        };
      } else {
        updatedTree[sourceNode.parent!] = {
          ...sourceParent,
          children: sourceChildren,
        };
      }

      // Convert target leaf to group node with all required properties
      updatedTree[targetNode.id] = {
        ...targetNode,
        type: 'group',
        children: [sourceNode.id],
        childrenFromPath: {}, // Initialize empty lookup for tree data
        groupingField: null, // null for tree data (as opposed to row grouping)
        isAutoGenerated: false, // This is a user-created group via drag-drop
        childrenExpanded: true, // Default to expanded so user can see the result
      } as GridGroupNode;

      // Update source node's parent and depth
      updatedTree[sourceNode.id] = {
        ...sourceNode,
        parent: targetNode.id,
        depth: targetNode.depth + 1,
      };

      // If source was a group, update depths for all descendants
      if (sourceNode.type === 'group') {
        const depthDiff = targetNode.depth + 1 - sourceNode.depth;
        updateDescendantDepths(sourceNode as GridGroupNode, updatedTree, depthDiff);
      }

      return {
        ...state,
        rows: {
          ...state.rows,
          tree: updatedTree,
        },
      };
    });

    // Update rows in the grid
    apiRef.current.updateRows(rowsToUpdate);
    apiRef.current.publishEvent('rowsSet');
  }
}

/**
 * Handles moving group nodes (and all their descendants) between different parents.
 */
class CrossParentGroupOperation extends BaseReorderOperation {
  readonly operationType = 'cross-parent-group';

  detectOperation(ctx: ReorderExecutionContext): ReorderOperation | null {
    // Fail for "over" position - let DropOnLeafOperation handle it
    if (ctx.dropPosition === 'over') {
      return null;
    }

    const {
      sourceRowId,
      placeholderIndex,
      sortedFilteredRowIds,
      rowTree,
      apiRef,
      setTreeDataPath,
    } = ctx;

    const sourceNode = gridRowNodeSelector(apiRef, sourceRowId);
    if (!sourceNode || sourceNode.type !== 'group') {
      return null;
    }

    if (!setTreeDataPath) {
      if (process.env.NODE_ENV !== 'production') {
        warnOnce(
          'MUI X: Cross-parent reordering requires `setTreeDataPath()` prop to update row data paths.',
          'warning',
        );
      }
      return null;
    }

    // Find target node
    let targetIndex = placeholderIndex;
    if (targetIndex >= sortedFilteredRowIds.length && sortedFilteredRowIds.length > 0) {
      targetIndex = sortedFilteredRowIds.length - 1;
    }

    if (targetIndex < 0) {
      return null;
    }

    const targetNode = gridRowNodeSelector(apiRef, sortedFilteredRowIds[targetIndex]);
    if (!targetNode) {
      return null;
    }

    // Check if it's actually a cross-parent operation
    if (sourceNode.parent === targetNode.parent) {
      return null;
    }

    // Validate not moving into own descendant (validator should catch this too)
    if (isDescendantOf(targetNode, sourceNode, rowTree)) {
      return null;
    }

    const actualTargetIndex = calculateTargetIndex(
      sourceNode,
      targetNode,
      placeholderIndex >= sortedFilteredRowIds.length,
      rowTree,
    );

    return {
      sourceNode,
      targetNode,
      actualTargetIndex,
      isLastChild: placeholderIndex >= sortedFilteredRowIds.length,
      operationType: 'cross-parent-group',
    };
  }

  async executeOperation(operation: ReorderOperation, ctx: ReorderExecutionContext): Promise<void> {
    const { sourceNode, targetNode, actualTargetIndex } = operation;
    const { apiRef, setTreeDataPath, processRowUpdate, onProcessRowUpdateError } = ctx;

    const rowTree = gridRowTreeSelector(apiRef);
    const dataRowIdToModelLookup = gridRowsLookupSelector(apiRef);

    // Collect all nodes that need updating (group + all descendants)
    const nodesToUpdate = collectAllDescendants(sourceNode as GridGroupNode, rowTree);
    nodesToUpdate.unshift(sourceNode); // Include the group itself

    // Calculate new base path for the moved group
    const targetParentNode = rowTree[targetNode.parent!];
    const newBasePath = buildTreeDataPath(targetParentNode, rowTree);

    // Calculate the original base path depth
    const sourceParentNode = rowTree[sourceNode.parent!];
    const sourceBasePath = buildTreeDataPath(sourceParentNode, rowTree);
    const sourceDepth = sourceBasePath.length;

    // Use BatchRowUpdater for efficient batch processing
    const updater = new BatchRowUpdater(apiRef, processRowUpdate, onProcessRowUpdateError);

    // Queue all row updates for batch processing
    for (const node of nodesToUpdate) {
      const originalRow = dataRowIdToModelLookup[node.id];

      // Get the current path
      const currentPath = buildTreeDataPath(node, rowTree);

      // Calculate relative path from the moved group
      const relativePath = currentPath.slice(sourceDepth);

      // Build new path
      const newPath = [...newBasePath, ...relativePath];

      // Update row data path
      const updatedRow = setTreeDataPath!(newPath, originalRow);

      // Queue the update (BatchRowUpdater will handle processRowUpdate)
      updater.queueUpdate(node.id, originalRow, updatedRow);
    }

    try {
      // Execute all batch updates
      const { successful, updates } = await updater.executeAll();

      // Only proceed with tree updates if we have successful updates
      if (successful.length > 0) {
        // Update tree structure (partial moves are allowed)
        apiRef.current.setState((state: any) => {
          const updatedTree = { ...state.rows.tree };

          // Remove from source parent
          const sourceParent = updatedTree[sourceNode.parent!] as GridGroupNode;
          const sourceChildren = sourceParent.children.filter((id) => id !== sourceNode.id);

          // Convert source parent to leaf if now empty
          if (sourceChildren.length === 0) {
            updatedTree[sourceNode.parent!] = {
              ...sourceParent,
              type: 'leaf',
              children: undefined,
            };
          } else {
            updatedTree[sourceNode.parent!] = {
              ...sourceParent,
              children: sourceChildren,
            };
          }

          // Add to target parent
          const targetParent = updatedTree[targetNode.parent!] as GridGroupNode;
          const targetChildren = [...targetParent.children];
          targetChildren.splice(actualTargetIndex, 0, sourceNode.id);

          updatedTree[targetNode.parent!] = {
            ...targetParent,
            children: targetChildren,
          };

          // Update the group's parent reference and depth
          const newParentNode = updatedTree[targetNode.parent!];
          const newGroupDepth = newParentNode.depth + 1;

          updatedTree[sourceNode.id] = {
            ...sourceNode,
            parent: targetNode.parent,
            depth: newGroupDepth,
          };

          // Update depths for all descendants
          const depthDiff = newGroupDepth - sourceNode.depth;
          updateDescendantDepths(sourceNode as GridGroupNode, updatedTree, depthDiff);

          return {
            ...state,
            rows: {
              ...state.rows,
              tree: updatedTree,
            },
          };
        });

        // Update all successful rows in the grid
        apiRef.current.updateRows(updates);
        apiRef.current.publishEvent('rowsSet');
      }
    } finally {
      apiRef.current.setLoading(false);
    }
  }
}

export const treeDataReorderExecutor = new RowReorderExecutor([
  new SameParentSwapOperation(),
  new CrossParentLeafOperation(),
  new DropOnLeafOperation(),
  new CrossParentGroupOperation(),
]);
