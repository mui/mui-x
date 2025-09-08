/* eslint-disable class-methods-use-this */
import { gridRowNodeSelector, gridRowTreeSelector } from '@mui/x-data-grid';
import type { GridTreeNode, GridGroupNode } from '@mui/x-data-grid';
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

class CrossParentOperation extends BaseReorderOperation {
  readonly operationType = 'cross-parent';

  detectOperation(ctx: ReorderExecutionContext): ReorderOperation | null {
    // TODO: Claude, implement this
    return null;
  }

  executeOperation(operation: ReorderOperation, ctx: ReorderExecutionContext): void {
    // TODO: Claude, implement this
  }
}

export const treeDataReorderExecutor = new RowReorderExecutor([
  new SameParentSwapOperation(),
  new CrossParentOperation(),
]);
