/**
 * The object containing the column properties of the rendering state.
 */
export interface GridRenderColumnsProps {
  /**
   * The index of the first rendered column.
   */
  firstColIdx: number;
  /**
   * The index of the last rendered column.
   */
  lastColIdx: number;
  /**
   * The left offset required to position the viewport at the beginning of the first rendered column.
   */
  leftEmptyWidth: number;
  /**
   * The right offset required to position the viewport to the end of the last rendered column.
   */
  rightEmptyWidth: number;
}

/**
 * The object containing the row properties of the rendering state.
 */
export interface GridRenderRowProps {
  /**
   * The rendering zone page calculated from the scroll position.
   */
  page: number;
  /**
   * The index of the first rendered row.
   */
  firstRowIdx: number;
  /**
   * The index of the last rendered row.
   */
  lastRowIdx: number;
}

/**
 * The object containing the pagination properties of the rendering state.
 */
export interface GridRenderPaginationProps {
  /**
   * The current page.
   */
  paginationCurrentPage: number;
  /**
   * The page size.
   */
  pageSize: number;
}

/**
 * The full rendering state.
 */
export type GridRenderContextProps = GridRenderColumnsProps &
  GridRenderRowProps &
  GridRenderPaginationProps;
