import { GridRowId, GridRowTreeConfig, GRID_ROOT_GROUP_ID } from '@mui/x-data-grid';
import { getTreeNodeDescendants } from '@mui/x-data-grid/internals';

export function skipFiltering(rowTree: GridRowTreeConfig) {
  const filteredRowsLookup: Record<GridRowId, boolean> = {};
  const filteredChildrenCountLookup: Record<GridRowId, number> = {};
  const filteredDescendantCountLookup: Record<GridRowId, number> = {};

  const nodes = Object.values(rowTree);
  for (let i = 0; i < nodes.length; i += 1) {
    const node: any = nodes[i];
    filteredRowsLookup[node.id] = true;
    filteredChildrenCountLookup[node.id] = node.serverChildrenCount ?? 0;
  }

  return {
    filteredRowsLookup,
    filteredChildrenCountLookup,
    filteredDescendantCountLookup,
  };
}

export function skipSorting(rowTree: GridRowTreeConfig) {
  return getTreeNodeDescendants(rowTree, GRID_ROOT_GROUP_ID, false);
}
