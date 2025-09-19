import type { GridRowId, GridTreeNode, GridRowTreeConfig } from '@mui/x-data-grid';
import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import type { DropPosition } from './reorderValidationTypes';

export type {
  DropPosition,
  DragDirection,
  ReorderValidationContext,
} from './reorderValidationTypes';

export type ReorderOperationType =
  | 'same-parent-swap'
  | 'cross-parent-leaf'
  | 'cross-parent-group'
  | 'drop-on-leaf';

export interface ReorderExecutionContext<ApiRef extends GridPrivateApiPro = GridPrivateApiPro> {
  sourceRowId: GridRowId;
  dropPosition: DropPosition;
  placeholderIndex: number;
  sortedFilteredRowIds: GridRowId[];
  sortedFilteredRowIndexLookup: Record<GridRowId, number>;
  rowTree: GridRowTreeConfig;
  apiRef: RefObject<ApiRef>;
  processRowUpdate?: DataGridProProcessedProps['processRowUpdate'];
  onProcessRowUpdateError?: DataGridProProcessedProps['onProcessRowUpdateError'];
  setTreeDataPath?: DataGridProProcessedProps['setTreeDataPath'];
}

export interface ReorderOperation {
  sourceNode: GridTreeNode;
  targetNode: GridTreeNode;
  actualTargetIndex: number;
  isLastChild: boolean;
  operationType: ReorderOperationType;
}
