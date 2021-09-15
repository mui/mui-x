import { GridRowId } from '../../../models/gridRows';

export interface GridVisibleRowsTreeNode {
  id: GridRowId;
  children: GridVisibleRowsTreeNode[];
}

export interface GridVisibleRowsTreeLookupNode {
  isVisible: boolean;
  children: GridVisibleRowsTreeLookup;
}

export type GridVisibleRowsTreeLookup = { [id: GridRowId]: GridVisibleRowsTreeLookupNode };

export interface VisibleGridRowsState {
  visibleRowsLookup: Record<GridRowId, boolean>;
  visibleRows?: GridRowId[];

  // Tree
  // visibleRowsTreeLookup: GridVisibleRowsTreeLookup;
  // visibleRowsTree?: GridVisibleRowsTreeNode[];
  // visibleRowsCount: number | null,
  // flatVisibleRows?: [],
}

export const getInitialVisibleGridRowsState: () => VisibleGridRowsState = () => ({
  visibleRowsLookup: {},
  // visibleRowsTreeLookup: {},
  // visibleRowsCount: null,
});
