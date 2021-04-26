export interface GridColumnResizeState {
  resizingColumnField: string;
}

export function getInitialGridColumnResizeState(): GridColumnResizeState {
  return { resizingColumnField: '' };
}
