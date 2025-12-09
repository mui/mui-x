import { gridRowNodeSelector, gridRowTreeSelector } from '@mui/x-data-grid';
import type { GridTreeNode, GridGroupNode, GridValidRowModel } from '@mui/x-data-grid';
import { BaseReorderOperation, RowReorderExecutor } from '../rowReorder/reorderExecutor';
import { type ReorderOperation, type ReorderExecutionContext } from '../rowReorder/types';
import { calculateTargetIndex, isDescendantOf } from '../rowReorder/utils';
import {
  displaySetTreeDataPathWarning,
  removeNodeFromSourceParent,
  updateLeafPath,
  updateGroupHierarchyPaths,
  updateNodeParentAndDepth,
  buildTreeDataPath,
} from './utils';

/**
 * Handles reordering of items within the same parent group.
 */
export class SameParentSwapOperation extends BaseReorderOperation {
  readonly operationType = 'same-parent-swap';

  detectOperation(ctx: ReorderExecutionContext): ReorderOperation | null {
    if (ctx.dropPosition === 'inside') {
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

    // Check if below last node in the same group as source node
    const isBelowPosition = ctx.dropPosition === 'below';

    if (isBelowPosition && sourceNode.parent !== adjustedTargetNode.parent) {
      const unAdjustedTargetIndex = placeholderIndex - 1;
      const unAdjustedTargetNode = gridRowNodeSelector(
        apiRef,
        sortedFilteredRowIds[unAdjustedTargetIndex],
      );
      if (unAdjustedTargetNode && unAdjustedTargetNode.parent === sourceNode.parent) {
        adjustedTargetNode = unAdjustedTargetNode;
        isLastChild = true;
      }
    }

    if (sourceNode.parent !== adjustedTargetNode.parent) {
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
      operationType: this.operationType,
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
    // Fail for "inside" position - let DropOnLeafOperation handle it
    if (ctx.dropPosition === 'inside') {
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

    if (!setTreeDataPath) {
      displaySetTreeDataPathWarning('Cross-parent reordering');
    }

    let targetIndex = placeholderIndex;
    if (targetIndex === sortedFilteredRowIds.length && sortedFilteredRowIds.length > 0) {
      targetIndex = sortedFilteredRowIds.length - 1;
    }

    if (targetIndex < 0) {
      return null;
    }

    const targetNode = gridRowNodeSelector(apiRef, sortedFilteredRowIds[targetIndex]);
    if (!targetNode) {
      return null;
    }

    if (sourceNode.parent === targetNode.parent) {
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
      operationType: this.operationType,
    };
  }

  async executeOperation(operation: ReorderOperation, ctx: ReorderExecutionContext): Promise<void> {
    const { sourceNode, targetNode, actualTargetIndex } = operation;
    const { apiRef } = ctx;

    const rowTree = gridRowTreeSelector(apiRef);

    const targetParentNode = rowTree[targetNode.parent!];
    const targetPath = buildTreeDataPath(targetParentNode, rowTree);

    const updatedRow = await updateLeafPath(sourceNode, targetPath, ctx);

    if (!updatedRow) {
      return;
    }

    // Update tree structure
    apiRef.current.setState((state: any) => {
      const updatedTree = { ...state.rows.tree };

      removeNodeFromSourceParent(updatedTree, sourceNode);

      const targetParent = updatedTree[targetNode.parent!] as GridGroupNode;
      const targetChildren = [...targetParent.children];
      targetChildren.splice(actualTargetIndex, 0, sourceNode.id);

      updatedTree[targetNode.parent!] = {
        ...targetParent,
        children: targetChildren,
      };

      const parentNode = updatedTree[targetNode.parent!];
      updateNodeParentAndDepth(updatedTree, sourceNode, targetNode.parent!, parentNode.depth + 1);

      return {
        ...state,
        rows: {
          ...state.rows,
          tree: updatedTree,
        },
      };
    });

    apiRef.current.updateRows([updatedRow]);
    apiRef.current.publishEvent('rowsSet');
  }
}

/**
 * Handles dropping any node (leaf or group) "inside" a leaf node.
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

    if (dropPosition !== 'inside') {
      return null;
    }

    const sourceNode = gridRowNodeSelector(apiRef, sourceRowId);
    if (!sourceNode || sourceNode.type === 'footer') {
      return null;
    }

    if (!setTreeDataPath) {
      displaySetTreeDataPathWarning('Drop on leaf reordering');
    }

    // Find target node
    let targetIndex = placeholderIndex;
    if (targetIndex === sortedFilteredRowIds.length && sortedFilteredRowIds.length > 0) {
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
      operationType: this.operationType,
    };
  }

  async executeOperation(operation: ReorderOperation, ctx: ReorderExecutionContext): Promise<void> {
    const { sourceNode, targetNode } = operation;
    const { apiRef } = ctx;

    const rowTree = gridRowTreeSelector(apiRef);

    // Build target path for the new structure
    const targetPath = buildTreeDataPath(targetNode, rowTree);
    let rowsToUpdate: GridValidRowModel[] = [];

    // Handle source node path updates
    if (sourceNode.type === 'leaf') {
      // Simple leaf move
      const updatedRow = await updateLeafPath(sourceNode, targetPath, ctx);

      if (!updatedRow) {
        return;
      }

      rowsToUpdate.push(updatedRow);
    } else {
      // Group move - update entire hierarchy
      const sourceParentNode = rowTree[sourceNode.parent!];
      const sourceBasePath = buildTreeDataPath(sourceParentNode, rowTree);

      rowsToUpdate = await updateGroupHierarchyPaths(
        sourceNode as GridGroupNode,
        sourceBasePath,
        targetPath,
        ctx,
      );

      if (rowsToUpdate.length === 0) {
        return;
      }
    }

    apiRef.current.setState((state: any) => {
      const updatedTree = { ...state.rows.tree };

      removeNodeFromSourceParent(updatedTree, sourceNode);

      updatedTree[targetNode.id] = {
        ...targetNode,
        type: 'group',
        children: [sourceNode.id],
        childrenFromPath: {},
        groupingField: null,
        isAutoGenerated: false,
        childrenExpanded: true,
      } as GridGroupNode;

      updateNodeParentAndDepth(updatedTree, sourceNode, targetNode.id, targetNode.depth + 1);

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
 * Handles dropping any node (leaf or group) "inside" a group node.
 * This makes the dragged node the first child of the target group.
 */
class DropOnGroupOperation extends BaseReorderOperation {
  readonly operationType = 'drop-on-group';

  detectOperation(ctx: ReorderExecutionContext): ReorderOperation | null {
    const {
      sourceRowId,
      dropPosition,
      placeholderIndex,
      sortedFilteredRowIds,
      apiRef,
      setTreeDataPath,
      rowTree,
    } = ctx;

    // Only applies to "inside" drop position
    if (dropPosition !== 'inside') {
      return null;
    }

    const sourceNode = gridRowNodeSelector(apiRef, sourceRowId);
    if (!sourceNode || sourceNode.type === 'footer') {
      return null;
    }

    if (!setTreeDataPath) {
      displaySetTreeDataPathWarning('Drop on group reordering');
    }

    let targetIndex = placeholderIndex;
    if (targetIndex === sortedFilteredRowIds.length && sortedFilteredRowIds.length > 0) {
      targetIndex = sortedFilteredRowIds.length - 1;
    }

    if (targetIndex < 0) {
      return null;
    }

    const targetNode = gridRowNodeSelector(apiRef, sortedFilteredRowIds[targetIndex]);
    if (!targetNode || targetNode.type !== 'group') {
      return null;
    }

    if (isDescendantOf(targetNode, sourceNode, rowTree)) {
      return null;
    }

    const actualTargetIndex = 0;

    return {
      sourceNode,
      targetNode,
      actualTargetIndex,
      isLastChild: false,
      operationType: this.operationType,
    };
  }

  async executeOperation(operation: ReorderOperation, ctx: ReorderExecutionContext): Promise<void> {
    const { sourceNode, targetNode } = operation;
    const { apiRef } = ctx;

    const rowTree = gridRowTreeSelector(apiRef);

    // Build target path for the new structure
    const targetPath = buildTreeDataPath(targetNode, rowTree);
    let rowsToUpdate: GridValidRowModel[] = [];

    // Handle source node path updates
    if (sourceNode.type === 'leaf') {
      // Simple leaf move
      const updatedRow = await updateLeafPath(sourceNode, targetPath, ctx);

      if (!updatedRow) {
        return;
      }

      rowsToUpdate.push(updatedRow);
    } else {
      // Group move - update entire hierarchy
      const sourceParentNode = rowTree[sourceNode.parent!];
      const sourceBasePath = buildTreeDataPath(sourceParentNode, rowTree);

      rowsToUpdate = await updateGroupHierarchyPaths(
        sourceNode as GridGroupNode,
        sourceBasePath,
        targetPath,
        ctx,
      );

      if (rowsToUpdate.length === 0) {
        return;
      }
    }

    // Update tree structure
    apiRef.current.setState((state: any) => {
      const updatedTree = { ...state.rows.tree };

      // Remove source from its current parent
      removeNodeFromSourceParent(updatedTree, sourceNode);

      // Add source as first child of target group
      const targetGroup = updatedTree[targetNode.id] as GridGroupNode;
      const targetChildren = [sourceNode.id, ...targetGroup.children];

      updatedTree[targetNode.id] = {
        ...targetGroup,
        children: targetChildren,
      };

      updateNodeParentAndDepth(updatedTree, sourceNode, targetNode.id, targetNode.depth + 1);

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
    if (ctx.dropPosition === 'inside') {
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
      displaySetTreeDataPathWarning('Cross-parent reordering');
    }

    // Find target node
    let targetIndex = placeholderIndex;
    if (targetIndex === sortedFilteredRowIds.length && sortedFilteredRowIds.length > 0) {
      targetIndex = sortedFilteredRowIds.length - 1;
    }

    if (targetIndex < 0) {
      return null;
    }

    const targetNode = gridRowNodeSelector(apiRef, sortedFilteredRowIds[targetIndex]);
    if (!targetNode) {
      return null;
    }

    if (sourceNode.parent === targetNode.parent) {
      return null;
    }

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
      operationType: this.operationType,
    };
  }

  async executeOperation(operation: ReorderOperation, ctx: ReorderExecutionContext): Promise<void> {
    const { sourceNode, targetNode, actualTargetIndex } = operation;
    const { apiRef } = ctx;

    const rowTree = gridRowTreeSelector(apiRef);

    // Calculate new base path for the moved group
    const targetParentNode = rowTree[targetNode.parent!];
    const newBasePath = buildTreeDataPath(targetParentNode, rowTree);

    // Calculate the original base path depth
    const sourceParentNode = rowTree[sourceNode.parent!];
    const sourceBasePath = buildTreeDataPath(sourceParentNode, rowTree);

    // Update group hierarchy paths
    const updates = await updateGroupHierarchyPaths(
      sourceNode as GridGroupNode,
      sourceBasePath,
      newBasePath,
      ctx,
    );

    if (updates.length > 0) {
      // Update tree structure (partial moves are allowed)
      apiRef.current.setState((state: any) => {
        const updatedTree = { ...state.rows.tree };

        // Remove from source parent
        removeNodeFromSourceParent(updatedTree, sourceNode);

        // Add to target parent
        const targetParent = updatedTree[targetNode.parent!] as GridGroupNode;
        const targetChildren = [...targetParent.children];
        targetChildren.splice(actualTargetIndex, 0, sourceNode.id);

        updatedTree[targetNode.parent!] = {
          ...targetParent,
          children: targetChildren,
        };

        const newParentNode = updatedTree[targetNode.parent!];
        const newGroupDepth = newParentNode.depth + 1;
        updateNodeParentAndDepth(updatedTree, sourceNode, targetNode.parent!, newGroupDepth);

        return {
          ...state,
          rows: {
            ...state.rows,
            tree: updatedTree,
          },
        };
      });

      apiRef.current.updateRows(updates);
      apiRef.current.publishEvent('rowsSet');
    }
  }
}

export const treeDataReorderExecutor = new RowReorderExecutor([
  new SameParentSwapOperation(),
  new CrossParentLeafOperation(),
  new DropOnLeafOperation(),
  new DropOnGroupOperation(),
  new CrossParentGroupOperation(),
]);
