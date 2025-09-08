/* eslint-disable class-methods-use-this */
import {
  gridRowNodeSelector,
  gridRowTreeSelector,
  gridRowsLookupSelector,
  GRID_ROOT_GROUP_ID,
} from '@mui/x-data-grid';
import type {
  GridTreeNode,
  GridGroupNode,
  GridUpdateRowParams,
  GridRowTreeConfig,
} from '@mui/x-data-grid';
import { warnOnce } from '@mui/x-internals/warning';
import { BaseReorderOperation, RowReorderExecutor } from '../rowReorder/reorderExecutor';
import { type ReorderOperation, type ReorderExecutionContext } from '../rowReorder/types';
import { determineOperationType, calculateTargetIndex } from '../rowReorder/utils';

/**
 * Handles reordering of items within the same parent group.
 */
class SameParentSwapOperation extends BaseReorderOperation {
  readonly operationType = 'same-parent-swap';

  detectOperation(ctx: ReorderExecutionContext): ReorderOperation | null {
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
    const { sourceRowId, placeholderIndex, sortedFilteredRowIds, rowTree, apiRef } = ctx;

    const sourceNode = gridRowNodeSelector(apiRef, sourceRowId);
    if (!sourceNode || sourceNode.type !== 'leaf') {
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

    // Check if setTreeDataPath is provided
    if (!setTreeDataPath) {
      if (process.env.NODE_ENV !== 'production') {
        warnOnce(
          'MUI X: Cross-parent reordering requires setTreeDataPath prop to update row data paths. ' +
            'Please provide a setTreeDataPath function to enable this feature.',
          'warning',
        );
      }
      return;
    }

    const rowTree = gridRowTreeSelector(apiRef);
    const dataRowIdToModelLookup = gridRowsLookupSelector(apiRef);

    // Get the target parent's path
    const targetParentNode = rowTree[targetNode.parent!];
    const targetPath = buildPathToNode(targetParentNode, rowTree);

    // Add the leaf's own key to the path
    const leafKey = sourceNode.type === 'leaf' ? sourceNode.groupingKey : null;
    const newPath = leafKey !== null ? [...targetPath, String(leafKey)] : targetPath;

    // Update the row data
    const originalRow = dataRowIdToModelLookup[sourceNode.id];
    let updatedRow = setTreeDataPath(newPath, originalRow);

    // Process row update if needed
    if (processRowUpdate) {
      try {
        const processedRow = await processRowUpdate(updatedRow, originalRow, {
          rowId: sourceNode.id,
          previousRow: originalRow,
          updatedRow,
        } as GridUpdateRowParams);
        updatedRow = processedRow || updatedRow;
      } catch (error) {
        if (onProcessRowUpdateError) {
          onProcessRowUpdateError(error);
        }
        return;
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

export const treeDataReorderExecutor = new RowReorderExecutor([
  new SameParentSwapOperation(),
  new CrossParentLeafOperation(),
]);

// TODO Move it to utils/reuse existing ones
function buildPathToNode(node: GridTreeNode, tree: GridRowTreeConfig): string[] {
  const path: string[] = [];
  let current = node;

  while (current && current.id !== GRID_ROOT_GROUP_ID) {
    if ((current.type === 'leaf' || current.type === 'group') && current.groupingKey !== null) {
      path.unshift(String(current.groupingKey));
    }
    current = tree[current.parent!];
  }

  return path;
}
