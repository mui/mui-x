// import { ColDef } from '../../../models/colDef';

export interface ColumnReorderState {
  dragCol: string;
}

export function getInitialColumnReorderState(): ColumnReorderState {
  return { dragCol: '' };
}
