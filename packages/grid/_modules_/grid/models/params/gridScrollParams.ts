export interface GridScrollParams {
  left: number;
  top: number;
  absoluteTop: number;
}

export type GridScrollFn = (v: GridScrollParams) => void;
