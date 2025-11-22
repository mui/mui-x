/* eslint-disable @typescript-eslint/no-redeclare */

export type Size = { width: number; height: number };
export const Size = {
  EMPTY: { width: 0, height: 0 },
  equals: (a: Size, b: Size) => a.width === b.width && a.height === b.height,
};

export type Row = { [key: string | symbol]: any };
export type Column = { [key: string | symbol]: any };
export type ColumnWithWidth = {
  computedWidth: number;
} & Column;

export type RowId = any; // TODO

export type RowEntry = {
  id: any; // TODO
  model: Row;
};

export type PinnedRows = {
  top: RowEntry[];
  bottom: RowEntry[];
};
export const PinnedRows = {
  EMPTY: { top: [], bottom: [] } as PinnedRows,
};

export type PinnedColumns = {
  left: Column[];
  right: Column[];
};
export const PinnedColumns = {
  EMPTY: { left: [], right: [] } as PinnedColumns,
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
export const ScrollPosition = {
  EMPTY: { top: 0, left: 0 },
  equals: (a: ScrollPosition, b: ScrollPosition) => a.top === b.top && a.left === b.left,
};

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

export type RowRange = { firstRowIndex: number; lastRowIndex: number };
