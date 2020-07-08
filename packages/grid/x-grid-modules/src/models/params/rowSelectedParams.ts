import { RowData } from '../rows';

export interface RowSelectedParams {
  data: RowData;
  rowIndex: number;
  isSelected: boolean;
}
