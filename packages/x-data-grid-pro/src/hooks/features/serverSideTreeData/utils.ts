import {
  GridRowId,
  GridRowTreeConfig,
  GRID_ROOT_GROUP_ID,
  GridDataSourceGroupNode,
} from '@mui/x-data-grid';
import {
  defaultGridFilterLookup,
  getTreeNodeDescendants,
  GridRowTreeCreationParams,
} from '@mui/x-data-grid/internals';

export function skipFiltering(rowTree: GridRowTreeConfig) {
  const filteredChildrenCountLookup: Record<GridRowId, number> = {};

  const nodes = Object.values(rowTree);
  for (let i = 0; i < nodes.length; i += 1) {
    const node: any = nodes[i];
    filteredChildrenCountLookup[node.id] = node.serverChildrenCount ?? 0;
  }

  return {
    filteredRowsLookup: defaultGridFilterLookup.filteredRowsLookup,
    filteredChildrenCountLookup,
    filteredDescendantCountLookup: defaultGridFilterLookup.filteredDescendantCountLookup,
  };
}

export function skipSorting(rowTree: GridRowTreeConfig) {
  return getTreeNodeDescendants(rowTree, GRID_ROOT_GROUP_ID, false);
}

export function getParentPath(
  rowId: GridRowId,
  treeCreationParams: GridRowTreeCreationParams,
): string[] {
  if (
    treeCreationParams.updates.type !== 'full' ||
    !treeCreationParams.previousTree?.[rowId] ||
    treeCreationParams.previousTree[rowId].depth < 1 ||
    !('path' in treeCreationParams.previousTree[rowId])
  ) {
    return [];
  }

  return (treeCreationParams.previousTree[rowId] as GridDataSourceGroupNode).path || [];
}
