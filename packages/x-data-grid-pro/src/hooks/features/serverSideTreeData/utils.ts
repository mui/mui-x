import { GridRowId, GridRowTreeConfig } from '@mui/x-data-grid';

export const skipFiltering = (params: { rowTree: GridRowTreeConfig }) => {
  const { rowTree } = params;
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
};
