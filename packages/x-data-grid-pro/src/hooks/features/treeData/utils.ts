import {
  GRID_ROOT_GROUP_ID,
  gridRowsLookupSelector,
  gridRowTreeSelector,
  type GridRowId,
  type GridTreeNode,
  type GridGroupNode,
  type GridValidRowModel,
  type GridLeafNode,
  type GridRowTreeConfig,
} from '@mui/x-data-grid';
import { warnOnce } from '@mui/x-internals/warning';
import type { ReorderExecutionContext } from '../rowReorder/types';
import {
  BatchRowUpdater,
  collectAllDescendants,
  updateDescendantDepths,
} from '../rowReorder/utils';

export const buildTreeDataPath = (node: GridTreeNode, tree: GridRowTreeConfig): string[] => {
  const path: string[] = [];
  let current = node;

  while (current && current.id !== GRID_ROOT_GROUP_ID) {
    if ((current.type === 'leaf' || current.type === 'group') && current.groupingKey !== null) {
      path.unshift(String(current.groupingKey));
    }
    current = tree[current.parent!];
  }

  return path;
};

export function displaySetTreeDataPathWarning(operationName: string): void {
  warnOnce(
    `MUI X: ${operationName} requires \`setTreeDataPath()\` prop to update row data paths. ` +
      'Please provide a `setTreeDataPath()` function to enable this feature.',
    'warning',
  );
}

export function removeNodeFromSourceParent(
  updatedTree: Record<string, GridTreeNode>,
  sourceNode: GridTreeNode,
): void {
  const sourceParent = updatedTree[sourceNode.parent!] as GridGroupNode;
  const sourceChildren = sourceParent.children.filter((id) => id !== sourceNode.id);

  if (sourceChildren.length === 0) {
    updatedTree[sourceNode.parent!] = {
      ...sourceParent,
      type: 'leaf',
      children: undefined,
    } as unknown as GridLeafNode;
  } else {
    updatedTree[sourceNode.parent!] = {
      ...sourceParent,
      children: sourceChildren,
    };
  }
}

export async function updateLeafPath(
  sourceNode: GridTreeNode,
  targetPath: string[],
  ctx: ReorderExecutionContext,
): Promise<GridValidRowModel | null> {
  const { apiRef, setTreeDataPath, processRowUpdate, onProcessRowUpdateError } = ctx;
  const dataRowIdToModelLookup = gridRowsLookupSelector(apiRef);

  const leafKey = sourceNode.type === 'leaf' ? sourceNode.groupingKey : null;
  const newPath = leafKey !== null ? [...targetPath, String(leafKey)] : targetPath;

  const originalRow = dataRowIdToModelLookup[sourceNode.id];
  const updatedRow = setTreeDataPath!(newPath, originalRow);

  const updater = new BatchRowUpdater(apiRef, processRowUpdate, onProcessRowUpdateError);
  updater.queueUpdate(sourceNode.id, originalRow, updatedRow);

  const { successful, updates } = await updater.executeAll();

  if (successful.length === 0) {
    return null;
  }

  return updates[0];
}

export async function updateGroupHierarchyPaths(
  sourceNode: GridGroupNode,
  sourceBasePath: string[],
  targetPath: string[],
  ctx: ReorderExecutionContext,
): Promise<GridValidRowModel[]> {
  const { apiRef, setTreeDataPath, processRowUpdate, onProcessRowUpdateError } = ctx;
  const rowTree = gridRowTreeSelector(apiRef);
  const dataRowIdToModelLookup = gridRowsLookupSelector(apiRef);

  const nodesToUpdate = collectAllDescendants(sourceNode, rowTree);
  nodesToUpdate.unshift(sourceNode); // Include the group itself

  const sourceDepth = sourceBasePath.length;
  const updater = new BatchRowUpdater(apiRef, processRowUpdate, onProcessRowUpdateError);

  for (const node of nodesToUpdate) {
    const originalRow = dataRowIdToModelLookup[node.id];
    const currentPath = buildTreeDataPath(node, rowTree);
    const relativePath = currentPath.slice(sourceDepth);
    const newPath = [...targetPath, ...relativePath];
    const updatedRow = setTreeDataPath!(newPath, originalRow);
    updater.queueUpdate(node.id, originalRow, updatedRow);
  }

  const { successful, updates } = await updater.executeAll();

  if (successful.length === 0) {
    return [];
  }

  return updates;
}

export function updateNodeParentAndDepth(
  updatedTree: Record<string, GridTreeNode>,
  node: GridTreeNode,
  newParentId: GridRowId,
  newDepth: number,
): void {
  updatedTree[node.id] = {
    ...node,
    parent: newParentId,
    depth: newDepth,
  };

  if (node.type === 'group') {
    const depthDiff = newDepth - node.depth;
    updateDescendantDepths(node as GridGroupNode, updatedTree, depthDiff);
  }
}
