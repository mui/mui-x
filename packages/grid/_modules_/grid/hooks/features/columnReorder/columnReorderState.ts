import { ColDef } from '../../../models/colDef';

export interface ColumnReorderState {
  dragCol: ColDef | null;
}

export function getInitialColumnReorderState(): ColumnReorderState {
  return { dragCol: null };
}
