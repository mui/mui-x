import type { GridRowId, GridTreeNode } from '@mui/x-data-grid';

export type DropPosition = 'above' | 'below' | 'over';
export type DragDirection = 'up' | 'down';

export type ReorderValidationContext = {
  sourceNode: GridTreeNode;
  targetNode: GridTreeNode;
  prevNode: GridTreeNode | null;
  nextNode: GridTreeNode | null;
  rowTree: Record<GridRowId, GridTreeNode>;
  dropPosition: DropPosition;
  dragDirection: DragDirection;
  targetRowIndex: number;
  sourceRowIndex: number;
  expandedSortedRowIndexLookup: Record<GridRowId, number>;
};
