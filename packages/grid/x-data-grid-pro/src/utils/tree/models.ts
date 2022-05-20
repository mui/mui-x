import {
  GridFooterNode,
  GridGroupNode,
  GridKeyValue,
  GridLeafNode,
  GridRowId,
} from '@mui/x-data-grid';

export interface RowTreeBuilderGroupingCriteria {
  field: string | null;
  key: GridKeyValue;
}

export interface RowTreeBuilderNode {
  id: GridRowId;
  path: RowTreeBuilderGroupingCriteria[];
}

export interface TempGridGroupNode extends Omit<GridGroupNode, 'children' | 'childrenExpanded'> {
  children: Record<GridRowId, GridRowId>;
}

export type TempGridTreeNode = GridLeafNode | GridFooterNode | TempGridGroupNode;
