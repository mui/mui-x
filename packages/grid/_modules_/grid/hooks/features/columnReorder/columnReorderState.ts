export interface ColumnReorderState {
  dragCol: string;
}

export function getInitialGridColumnReorderState(): ColumnReorderState {
  return { dragCol: '' };
}
