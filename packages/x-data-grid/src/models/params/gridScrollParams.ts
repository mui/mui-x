export interface GridColumnsRenderContext {
  firstColumnIndex: number;
  lastColumnIndex: number;
}

/**
 * Provides the current render context range for rows and columns.
 * End index is exclusive - [firstRowIndex, lastRowIndex) and [firstColumnIndex, lastColumnIndex)
 */
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
