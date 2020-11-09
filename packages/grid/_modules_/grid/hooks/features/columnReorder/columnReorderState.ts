export interface ColumnReorderState {
  dragCol: string;
}

export function getInitialColumnReorderState(): ColumnReorderState {
  return { dragCol: '' };
}
