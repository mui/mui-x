import { GridRowModel, GridRowTreeNode } from '../../../../_modules_';

export interface GridTreeDataApi {
  groupRows: (flatRows: GridRowModel[]) => GridRowTreeNode[];
}
