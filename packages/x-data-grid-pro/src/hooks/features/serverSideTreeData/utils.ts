import { GridRowId, GridRowTreeConfig, GRID_ROOT_GROUP_ID } from '@mui/x-data-grid';
import { getTreeNodeDescendants } from '@mui/x-data-grid/internals';

export function skipFiltering(rowTree: GridRowTreeConfig) {
  const filteredRowsLookup: Record<GridRowId, boolean> = {};
  const filteredDescendantCountLookup: Record<GridRowId, number> = {};

  const nodes = Object.values(rowTree);
  for (let i = 0; i < nodes.length; i += 1) {
    const node: any = nodes[i];
    filteredRowsLookup[node.id] = true;
  }

  return {
    filteredRowsLookup,
    filteredDescendantCountLookup,
  };
}

export function skipSorting(rowTree: GridRowTreeConfig) {
  return getTreeNodeDescendants(rowTree, GRID_ROOT_GROUP_ID, false);
}
