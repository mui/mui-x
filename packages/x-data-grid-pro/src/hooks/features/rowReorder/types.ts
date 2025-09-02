import { GridRowId, GridTreeNode } from '@mui/x-data-grid';
import type { GridRowTreeConfig } from '@mui/x-data-grid';
import { RefObject } from '@mui/x-internals/types';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';

export type DropPosition = 'above' | 'below';
export type DragDirection = 'up' | 'down';

export interface ReorderValidationContext {
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
}

export type ReorderOperationType = 'same-parent-swap' | 'cross-parent-leaf' | 'cross-parent-group';

export interface ReorderExecutionContext<ApiRef extends GridPrivateApiPro = GridPrivateApiPro> {
  sourceRowId: GridRowId;
  placeholderIndex: number;
  sortedFilteredRowIds: GridRowId[];
  sortedFilteredRowIndexLookup: Record<GridRowId, number>;
  rowTree: GridRowTreeConfig;
  apiRef: RefObject<ApiRef>;
  processRowUpdate?: DataGridProProcessedProps['processRowUpdate'];
  onProcessRowUpdateError?: DataGridProProcessedProps['onProcessRowUpdateError'];
}

export interface ReorderOperation {
  sourceNode: GridTreeNode;
  targetNode: GridTreeNode;
  actualTargetIndex: number;
  isLastChild: boolean;
  operationType: ReorderOperationType;
}
