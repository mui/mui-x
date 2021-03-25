export interface GridColumnReorderState {
  dragCol: string;
}

export function getInitialGridColumnReorderState(): GridColumnReorderState {
  return { dragCol: '' };
}
