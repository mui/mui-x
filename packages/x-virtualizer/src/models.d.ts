export type Size = {
    width: number;
    height: number;
};
export type Row = any;
export type Column = any;
export type RowId = any;
export type RowEntry = {
    id: any;
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
export interface GridColumnsRenderContext {
    firstColumnIndex: number;
    lastColumnIndex: number;
}
export interface GridRenderContext extends GridColumnsRenderContext {
    firstRowIndex: number;
    lastRowIndex: number;
}
export interface GridScrollParams {
    left: number;
    top: number;
    renderContext?: GridRenderContext;
}
export type GridScrollFn = (v: GridScrollParams) => void;
export type PinnedRowPosition = keyof PinnedRows;
export type ScrollPosition = {
    top: number;
    left: number;
};
export declare enum ScrollDirection {
    NONE = 0,
    UP = 1,
    DOWN = 2,
    LEFT = 3,
    RIGHT = 4
}
export declare namespace ScrollDirection {
    function forDelta(dx: number, dy: number): ScrollDirection;
}
