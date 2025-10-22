import type { GridTreeNode } from '@mui/x-data-grid';
import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';

export type DropPosition = 'above' | 'below' | 'over';
export type DragDirection = 'up' | 'down';

export type ReorderValidationContext = {
  apiRef: RefObject<GridPrivateApiPro>;
  sourceNode: GridTreeNode;
  targetNode: GridTreeNode;
  prevNode: GridTreeNode | null;
  nextNode: GridTreeNode | null;
  dropPosition: DropPosition;
  dragDirection: DragDirection;
};
