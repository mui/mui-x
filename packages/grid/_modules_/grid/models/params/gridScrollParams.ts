export interface GridScrollParams {
  left: number;
  top: number;
}

export type GridScrollFn = (v: GridScrollParams) => void;
