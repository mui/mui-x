import { GridRowId, GridTreeNode } from '@mui/x-data-grid-pro';
import type { GridRowTreeConfig } from '@mui/x-data-grid-pro';
import { RefObject } from '@mui/x-internals/types';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

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

export interface ReorderExecutionContext {
  sourceRowId: GridRowId;
  placeholderIndex: number;
  sortedFilteredRowIds: GridRowId[];
  sortedFilteredRowIndexLookup: Record<GridRowId, number>;
  rowTree: GridRowTreeConfig;
  apiRef: RefObject<GridPrivateApiPremium>;
  processRowUpdate?: DataGridPremiumProcessedProps['processRowUpdate'];
  onProcessRowUpdateError?: DataGridPremiumProcessedProps['onProcessRowUpdateError'];
}

export interface ReorderOperation {
  sourceNode: GridTreeNode;
  targetNode: GridTreeNode;
  actualTargetIndex: number;
  isLastChild: boolean;
  operationType: ReorderOperationType;
}

export interface ReorderScenario {
  name: string;
  detectOperation: (ctx: ReorderExecutionContext) => ReorderOperation | null;
  execute: (operation: ReorderOperation, ctx: ReorderExecutionContext) => Promise<void> | void;
}

export type ReorderOperationType = 'same-parent-swap' | 'cross-parent-leaf' | 'cross-parent-group';
