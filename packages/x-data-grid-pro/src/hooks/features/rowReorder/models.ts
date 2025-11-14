import { GridTreeNode, GridValidRowModel } from '@mui/x-data-grid';

export type IsRowReorderableParams<R extends GridValidRowModel = any> = {
  row: R;
  rowNode: GridTreeNode;
};
