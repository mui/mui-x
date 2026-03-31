import { GRID_ROOT_GROUP_ID, gridClasses, } from '@mui/x-data-grid';
import { warnOnce } from '@mui/x-internals/warning';
// Re-export to be made part of `rowReorderUtils`
export { getNodePathInTree } from '../../../utils/tree/utils';
/**
 * Finds the closest cell element from the given event target.
 * If the target itself is a cell, returns it.
 * Otherwise, searches for the closest parent with 'cell' in its className.
 * @param target - The event target to start searching from
 * @returns The cell element or the original target if no cell is found
 */
export function findCellElement(target) {
    const element = target;
    if (!element) {
        return element;
    }
    // Check if the target itself is a cell
    if (element instanceof Element && element.classList.contains(gridClasses.cell)) {
        return element;
    }
    // Try to find the closest cell parent
    const cellElement = element.closest(`[class*="${gridClasses.cell}"]`);
    return cellElement || element;
}
export function determineOperationType(sourceNode, targetNode) {
    if (sourceNode.parent === targetNode.parent) {
        return 'same-parent-swap';
    }
    if (sourceNode.type === 'leaf') {
        return 'cross-parent-leaf';
    }
    return 'cross-parent-group';
}
export function calculateTargetIndex(sourceNode, targetNode, isLastChild, rowTree) {
    if (sourceNode.parent === targetNode.parent && !isLastChild) {
        // Same parent: find target's position in parent's children
        const parent = rowTree[sourceNode.parent];
        return parent.children.findIndex((id) => id === targetNode.id);
    }
    if (isLastChild) {
        // Append at the end
        const targetParent = rowTree[targetNode.parent];
        return targetParent.children.length;
    }
    // Find position in target parent
    const targetParent = rowTree[targetNode.parent];
    const targetIndex = targetParent.children.findIndex((id) => id === targetNode.id);
    return targetIndex >= 0 ? targetIndex : 0;
}
// Recursively collect all leaf node IDs from a group
export const collectAllLeafDescendants = (groupNode, tree) => {
    const leafIds = [];
    const collectFromNode = (nodeId) => {
        const node = tree[nodeId];
        if (node.type === 'leaf') {
            leafIds.push(nodeId);
        }
        else if (node.type === 'group') {
            node.children.forEach(collectFromNode);
        }
    };
    groupNode.children.forEach(collectFromNode);
    return leafIds;
};
// Recursively collect all descendant nodes (groups and leaves) from a group
export const collectAllDescendants = (groupNode, tree) => {
    const descendants = [];
    const collectFromNode = (nodeId) => {
        const node = tree[nodeId];
        if (node) {
            descendants.push(node);
            if (node.type === 'group') {
                node.children.forEach(collectFromNode);
            }
        }
    };
    groupNode.children.forEach(collectFromNode);
    return descendants;
};
// Check if a node is a descendant of another node
export const isDescendantOf = (possibleDescendant, ancestor, tree) => {
    let current = possibleDescendant;
    while (current && current.id !== GRID_ROOT_GROUP_ID) {
        if (current.id === ancestor.id) {
            return true;
        }
        current = tree[current.parent];
    }
    return false;
};
// Update depths for all descendant nodes recursively
export const updateDescendantDepths = (group, tree, depthDiff) => {
    const updateNodeDepth = (nodeId) => {
        const node = tree[nodeId];
        if (node) {
            tree[nodeId] = {
                ...node,
                depth: node.depth + depthDiff,
            };
            if (node.type === 'group') {
                node.children.forEach(updateNodeDepth);
            }
        }
    };
    group.children.forEach(updateNodeDepth);
};
/**
 * Finds an existing group node with the same groupingKey and groupingField under a parent.
 *
 * @param parentNode - The parent group node to search in
 * @param groupingKey - The grouping key to match
 * @param groupingField - The grouping field to match
 * @param tree - The row tree configuration
 * @returns The existing group node if found, null otherwise
 */
export function findExistingGroupWithSameKey(parentNode, groupingKey, groupingField, tree) {
    for (const childId of parentNode.children) {
        const childNode = tree[childId];
        if (childNode &&
            childNode.type === 'group' &&
            childNode.groupingKey === groupingKey &&
            childNode.groupingField === groupingField) {
            return childNode;
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
export function removeEmptyAncestors(groupId, tree, removedGroups) {
    let rootLevelRemovals = 0;
    let currentGroupId = groupId;
    while (currentGroupId && currentGroupId !== GRID_ROOT_GROUP_ID) {
        const group = tree[currentGroupId];
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
        currentGroupId = group.parent;
    }
    return rootLevelRemovals;
}
export function handleProcessRowUpdateError(error, onProcessRowUpdateError) {
    if (onProcessRowUpdateError) {
        onProcessRowUpdateError(error);
    }
    else {
        warnOnce([
            'MUI X: A call to `processRowUpdate()` threw an error which was not handled because `onProcessRowUpdateError()` is missing.',
            'To handle the error pass a callback to the `onProcessRowUpdateError()` prop, for example `<DataGrid onProcessRowUpdateError={(error) => ...} />`.',
            'For more detail, see https://mui.com/x/react-data-grid/editing/persistence/.',
        ], 'error');
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
 * const updater = new BatchRowUpdater(apiRef, processRowUpdate, onError);
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
    apiRef;
    processRowUpdate;
    onProcessRowUpdateError;
    rowsToUpdate = new Map();
    originalRows = new Map();
    successfulRowIds = new Set();
    failedRowIds = new Set();
    pendingRowUpdates = [];
    constructor(apiRef, processRowUpdate, onProcessRowUpdateError) {
        this.apiRef = apiRef;
        this.processRowUpdate = processRowUpdate;
        this.onProcessRowUpdateError = onProcessRowUpdateError;
    }
    queueUpdate(rowId, originalRow, updatedRow) {
        this.originalRows.set(rowId, originalRow);
        this.rowsToUpdate.set(rowId, updatedRow);
    }
    async executeAll() {
        const rowIds = Array.from(this.rowsToUpdate.keys());
        if (rowIds.length === 0) {
            return { successful: [], failed: [], updates: [] };
        }
        // Handle each row update, tracking success/failure
        const handleRowUpdate = async (rowId) => {
            const newRow = this.rowsToUpdate.get(rowId);
            const oldRow = this.originalRows.get(rowId);
            try {
                if (typeof this.processRowUpdate === 'function') {
                    const params = {
                        rowId,
                        previousRow: oldRow,
                        updatedRow: newRow,
                    };
                    const finalRow = await this.processRowUpdate(newRow, oldRow, params);
                    this.pendingRowUpdates.push(finalRow || newRow);
                    this.successfulRowIds.add(rowId);
                }
                else {
                    this.pendingRowUpdates.push(newRow);
                    this.successfulRowIds.add(rowId);
                }
            }
            catch (error) {
                this.failedRowIds.add(rowId);
                handleProcessRowUpdateError(error, this.onProcessRowUpdateError);
            }
        };
        // Use Promise.all with wrapped promises to avoid Promise.allSettled (browser support)
        const promises = rowIds.map((rowId) => {
            return new Promise((resolve) => {
                handleRowUpdate(rowId).then(resolve).catch(resolve);
            });
        });
        this.apiRef.current.setLoading(true);
        await Promise.all(promises);
        this.apiRef.current.setLoading(false);
        return {
            successful: Array.from(this.successfulRowIds),
            failed: Array.from(this.failedRowIds),
            updates: this.pendingRowUpdates,
        };
    }
}
