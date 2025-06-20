export type Size = { width: number; height: number };

export type Row = any; // TODO
export type Column = any; // TODO

export type RowId = any; // TODO

export type RowEntry = {
  id: any; // TODO
  model: Row;
};

export type PinnedRows = {
  top: Row[];
  bottom: Row[];
};

export type PinnedColumns = {
  left: Column[];
  right: Column[];
};

export type FocusedCell = {
  rowIndex: number;
  columnIndex: number;
  id?: any;
  field?: string;
};

export interface ColumnsRenderContext {
  firstColumnIndex: number;
  lastColumnIndex: number;
}
export interface RenderContext extends ColumnsRenderContext {
  firstRowIndex: number;
  lastRowIndex: number;
}

export interface GridScrollParams {
  left: number;
  top: number;
  renderContext?: RenderContext;
}

export type GridScrollFn = (v: GridScrollParams) => void;

export type PinnedRowPosition = keyof PinnedRows;

export type ScrollPosition = { top: number; left: number };

export enum ScrollDirection {
  NONE,
  UP,
  DOWN,
  LEFT,
  RIGHT,
}
export namespace ScrollDirection {
  export function forDelta(dx: number, dy: number) {
    if (dx === 0 && dy === 0) {
      return ScrollDirection.NONE;
    }
    /* eslint-disable */
    if (Math.abs(dy) >= Math.abs(dx)) {
      if (dy > 0) {
        return ScrollDirection.DOWN;
      } else {
        return ScrollDirection.UP;
      }
    } else {
      if (dx > 0) {
        return ScrollDirection.RIGHT;
      } else {
        return ScrollDirection.LEFT;
      }
    }
    /* eslint-enable */
  }
}
