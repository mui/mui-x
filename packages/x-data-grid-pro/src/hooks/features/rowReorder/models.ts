import type { GridTreeNode, GridValidRowModel } from '@mui/x-data-grid';
import type { RefObject } from '@mui/x-internals/types';
import type { RowReorderDropPosition, RowReorderDragDirection } from '@mui/x-data-grid/internals';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';

export type IsRowReorderableParams<R extends GridValidRowModel = any> = {
  row: R;
  rowNode: GridTreeNode;
};

export type ReorderValidationContext = {
  apiRef: RefObject<GridPrivateApiPro>;
  sourceNode: GridTreeNode;
  targetNode: GridTreeNode;
  prevNode: GridTreeNode | null;
  nextNode: GridTreeNode | null;
  dropPosition: RowReorderDropPosition;
  dragDirection: RowReorderDragDirection;
};
