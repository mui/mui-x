import type { RefObject } from '@mui/x-internals/types';
import {
  GRID_ROOT_GROUP_ID,
  gridRowNodeSelector,
  type GridRowId,
  type GridTreeNode,
  type GridGroupNode,
  type GridRowTreeConfig,
  type GridLeafNode,
  type GridKeyValue,
  type GridValidRowModel,
  type GridUpdateRowParams,
} from '@mui/x-data-grid-pro';
import { warnOnce } from '@mui/x-internals/warning';
import type { RowTreeBuilderGroupingCriterion } from '@mui/x-data-grid-pro/internals';
import type { ReorderValidationContext as Ctx, ReorderOperationType } from './types';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

// TODO: Share these conditions with the executor by making the contexts similar
/**
 * Reusable validation conditions for row reordering validation
 */
export const conditions = {
  // Node type checks
  isGroupToGroup: (ctx: Ctx) => ctx.sourceNode.type === 'group' && ctx.targetNode.type === 'group',

  isLeafToLeaf: (ctx: Ctx) => ctx.sourceNode.type === 'leaf' && ctx.targetNode.type === 'leaf',

  isLeafToGroup: (ctx: Ctx) => ctx.sourceNode.type === 'leaf' && ctx.targetNode.type === 'group',

  isGroupToLeaf: (ctx: Ctx) => ctx.sourceNode.type === 'group' && ctx.targetNode.type === 'leaf',

  // Drop position checks
  isDropAbove: (ctx: Ctx) => ctx.dropPosition === 'above',
  isDropBelow: (ctx: Ctx) => ctx.dropPosition === 'below',

  // Depth checks
  sameDepth: (ctx: Ctx) => ctx.sourceNode.depth === ctx.targetNode.depth,

  sourceDepthGreater: (ctx: Ctx) => ctx.sourceNode.depth > ctx.targetNode.depth,

  targetDepthIsSourceMinusOne: (ctx: Ctx) => ctx.targetNode.depth === ctx.sourceNode.depth - 1,

  // Parent checks
  sameParent: (ctx: Ctx) => ctx.sourceNode.parent === ctx.targetNode.parent,

  // Node state checks
  targetGroupExpanded: (ctx: Ctx) =>
    (ctx.targetNode.type === 'group' && (ctx.targetNode as GridGroupNode).childrenExpanded) ??
    false,

  targetGroupCollapsed: (ctx: Ctx) =>
    ctx.targetNode.type === 'group' && !(ctx.targetNode as GridGroupNode).childrenExpanded,

  // Previous/Next node checks
  hasPrevNode: (ctx: Ctx) => ctx.prevNode !== null,
  hasNextNode: (ctx: Ctx) => ctx.nextNode !== null,

  prevIsLeaf: (ctx: Ctx) => ctx.prevNode?.type === 'leaf',
  prevIsGroup: (ctx: Ctx) => ctx.prevNode?.type === 'group',
  nextIsLeaf: (ctx: Ctx) => ctx.nextNode?.type === 'leaf',
  nextIsGroup: (ctx: Ctx) => ctx.nextNode?.type === 'group',

  prevDepthEquals: (ctx: Ctx, depth: number) => ctx.prevNode?.depth === depth,

  prevDepthEqualsSource: (ctx: Ctx) => ctx.prevNode?.depth === ctx.sourceNode.depth,

  // Complex checks
  prevBelongsToSource: (ctx: Ctx) => {
    if (!ctx.prevNode) {
      return false;
    }
    // Check if prevNode.parent OR any of its ancestors === sourceNode.id
    let currentId = ctx.prevNode.parent;
    while (currentId) {
      if (currentId === ctx.sourceNode.id) {
        return true;
      }
      const node = ctx.rowTree[currentId];
      if (!node) {
        break;
      }
      currentId = node.parent;
    }
    return false;
  },

  // Position checks
  isAdjacentPosition: (ctx: Ctx) => {
    const { sourceRowIndex, targetRowIndex, dropPosition } = ctx;
    return (
      (dropPosition === 'above' && targetRowIndex === sourceRowIndex + 1) ||
      (dropPosition === 'below' && targetRowIndex === sourceRowIndex - 1)
    );
  },

  // First child check
  targetFirstChildIsGroupWithSourceDepth: (ctx: Ctx) => {
    if (ctx.targetNode.type !== 'group') {
      return false;
    }
    const targetGroup = ctx.targetNode as GridGroupNode;
    const firstChild = targetGroup.children?.[0] ? ctx.rowTree[targetGroup.children[0]] : null;
    return firstChild?.type === 'group' && firstChild.depth === ctx.sourceNode.depth;
  },

  targetFirstChildDepthEqualsSource: (ctx: Ctx) => {
    if (ctx.targetNode.type !== 'group') {
      return false;
    }
    const targetGroup = ctx.targetNode as GridGroupNode;
    const firstChild = targetGroup.children?.[0] ? ctx.rowTree[targetGroup.children[0]] : null;
    return firstChild ? firstChild.depth === ctx.sourceNode.depth : false;
  },
};

export function determineOperationType(
  sourceNode: GridTreeNode,
  targetNode: GridTreeNode,
): ReorderOperationType {
  if (sourceNode.parent === targetNode.parent) {
    return 'same-parent-swap';
  }
  if (sourceNode.type === 'leaf') {
    return 'cross-parent-leaf';
  }
  return 'cross-parent-group';
}

export function calculateTargetIndex(
  sourceNode: GridTreeNode,
  targetNode: GridTreeNode,
  isLastChild: boolean,
  rowTree: Record<GridRowId, GridTreeNode>,
): number {
  if (sourceNode.parent === targetNode.parent && !isLastChild) {
    // Same parent: find target's position in parent's children
    const parent = rowTree[sourceNode.parent!] as GridGroupNode;
    return parent.children.findIndex((id) => id === targetNode.id);
  }

  if (isLastChild) {
    // Append at the end
    const targetParent = rowTree[targetNode.parent!] as GridGroupNode;
    return targetParent.children.length;
  }

  // Find position in target parent
  const targetParent = rowTree[targetNode.parent!] as GridGroupNode;
  const targetIndex = targetParent.children.findIndex((id) => id === targetNode.id);
  return targetIndex >= 0 ? targetIndex : 0;
}

// Get the path from a node to the root in the tree
export const getNodePathInTree = ({
  id,
  tree,
}: {
  id: GridRowId;
  tree: GridRowTreeConfig;
}): RowTreeBuilderGroupingCriterion[] => {
  const path: RowTreeBuilderGroupingCriterion[] = [];
  let node = tree[id] as GridGroupNode | GridLeafNode;

  while (node.id !== GRID_ROOT_GROUP_ID) {
    path.push({
      field: node.type === 'leaf' ? null : node.groupingField,
      key: node.groupingKey,
    });

    node = tree[node.parent!] as GridGroupNode | GridLeafNode;
  }

  path.reverse();

  return path;
};

// Recursively collect all leaf node IDs from a group
export const collectAllLeafDescendants = (
  groupNode: GridGroupNode,
  tree: GridRowTreeConfig,
): GridRowId[] => {
  const leafIds: GridRowId[] = [];

  const collectFromNode = (nodeId: GridRowId) => {
    const node = tree[nodeId];
    if (node.type === 'leaf') {
      leafIds.push(nodeId);
    } else if (node.type === 'group') {
      (node as GridGroupNode).children.forEach(collectFromNode);
    }
  };

  groupNode.children.forEach(collectFromNode);
  return leafIds;
};

/**
 * Adjusts the target node based on specific reorder scenarios and constraints.
 *
 * This function applies scenario-specific logic to find the actual target node
 * for operations, handling cases like:
 * - Moving to collapsed groups
 * - Depth-based adjustments
 * - End-of-list positioning
 *
 * @param sourceNode The node being moved
 * @param targetNode The initial target node
 * @param targetIndex The index of the target node in the visible rows
 * @param placeholderIndex The index where the placeholder appears
 * @param sortedFilteredRowIds Array of visible row IDs in display order
 * @param apiRef Reference to the grid API
 * @returns Object containing the adjusted target node and last child flag
 */
export function adjustTargetNode(
  sourceNode: GridTreeNode,
  targetNode: GridTreeNode,
  targetIndex: number,
  placeholderIndex: number,
  sortedFilteredRowIds: GridRowId[],
  apiRef: RefObject<GridPrivateApiPremium>,
): { adjustedTargetNode: GridTreeNode; isLastChild: boolean } {
  let adjustedTargetNode: GridTreeNode = targetNode;
  let isLastChild = false;

  // Handle end-of-list case
  if (placeholderIndex >= sortedFilteredRowIds.length && sortedFilteredRowIds.length > 0) {
    isLastChild = true;
  }

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
      const node = apiRef.current.getRowNode(sortedFilteredRowIds[i]);
      if (node && node.depth < sourceNode.depth) {
        break;
      }
      if (node && node.depth === sourceNode.depth) {
        adjustedTargetNode = node;
        break;
      }
      i -= 1;
    }
  }

  // Case D adjustment: Leaf to group where we need previous leaf
  if (
    sourceNode.type === 'leaf' &&
    targetNode.type === 'group' &&
    targetNode.depth < sourceNode.depth
  ) {
    isLastChild = true;
    const prevIndex = placeholderIndex - 1;
    if (prevIndex >= 0) {
      const prevRowId = sortedFilteredRowIds[prevIndex];
      const leafTargetNode = gridRowNodeSelector(apiRef, prevRowId);
      if (leafTargetNode && leafTargetNode.type === 'leaf') {
        adjustedTargetNode = leafTargetNode;
      }
    }
  }

  return { adjustedTargetNode, isLastChild };
}

/**
 * Finds an existing group node with the same groupingKey and groupingField under a parent.
 *
 * @param parentNode - The parent group node to search in
 * @param groupingKey - The grouping key to match
 * @param groupingField - The grouping field to match
 * @param tree - The row tree configuration
 * @returns The existing group node if found, null otherwise
 */
export function findExistingGroupWithSameKey(
  parentNode: GridGroupNode,
  groupingKey: GridKeyValue,
  groupingField: string,
  tree: GridRowTreeConfig,
): GridGroupNode | null {
  for (const childId of parentNode.children) {
    const childNode = tree[childId];
    if (
      childNode &&
      childNode.type === 'group' &&
      (childNode as GridGroupNode).groupingKey === groupingKey &&
      (childNode as GridGroupNode).groupingField === groupingField
    ) {
      return childNode as GridGroupNode;
    }
  }
  return null;
}

/**
 * Removes empty ancestor groups from the tree after a row move operation.
 * Walks up the tree from the given group, removing any empty groups encountered.
 *
 * @param groupId - The ID of the group to start checking from
 * @param tree - The row tree configuration
 * @param removedGroups - Set to track which groups have been removed
 * @returns The number of root-level groups that were removed
 */
export function removeEmptyAncestors(
  groupId: GridRowId,
  tree: GridRowTreeConfig,
  removedGroups: Set<GridRowId>,
): number {
  let rootLevelRemovals = 0;
  let currentGroupId = groupId;

  while (currentGroupId && currentGroupId !== GRID_ROOT_GROUP_ID) {
    const group = tree[currentGroupId] as GridGroupNode;
    if (!group) {
      break;
    }

    const remainingChildren = group.children.filter((childId) => !removedGroups.has(childId));

    if (remainingChildren.length > 0) {
      break;
    }

    if (group.depth === 0) {
      rootLevelRemovals += 1;
    }

    removedGroups.add(currentGroupId);
    currentGroupId = group.parent!;
  }

  return rootLevelRemovals;
}

export function handleProcessRowUpdateError(
  error: any,
  onProcessRowUpdateError?: DataGridPremiumProcessedProps['onProcessRowUpdateError'],
): void {
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
}

/**
 * Handles batch row updates with partial failure tracking.
 *
 * This class is designed for operations that need to update multiple rows
 * atomically (like moving entire groups), while gracefully handling cases
 * where some updates succeed and others fail.
 *
 * @example
 * ```tsx
 * const updater = new BatchRowUpdater(processRowUpdate, onError);
 *
 * // Queue multiple updates
 * updater.queueUpdate('row1', originalRow1, newRow1);
 * updater.queueUpdate('row2', originalRow2, newRow2);
 *
 * // Execute all updates
 * const { successful, failed, updates } = await updater.executeAll();
 *
 * // Handle results
 * if (successful.length > 0) {
 *   apiRef.current.updateRows(updates);
 * }
 * ```
 */
export class BatchRowUpdater {
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

  queueUpdate(
    rowId: GridRowId,
    originalRow: GridValidRowModel,
    updatedRow: GridValidRowModel,
  ): void {
    this.originalRows.set(rowId, originalRow);
    this.rowsToUpdate.set(rowId, updatedRow);
  }

  async executeAll(): Promise<{
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
        handleProcessRowUpdateError(error, this.onProcessRowUpdateError);
      }
    };

    // Use Promise.all with wrapped promises to avoid Promise.allSettled (browser support)
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
