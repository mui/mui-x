import { ContainerProps } from './containerProps';

/**
 * The object containing the column properties of the rendering state.
 */
export interface RenderColumnsProps {
  /**
   * The column index of the first rendered column
   */
  firstColIdx: number;
  /**
   * The column index of the last rendered column
   */
  lastColIdx: number;
  /**
   * The left empty width required to position the viewport at the beginning of the first rendered column
   */
  leftEmptyWidth: number;
  /**
   * The right empty width limit the position the viewport to the end of the last rendered column
   */
  rightEmptyWidth: number;
}

/**
 * The object containing the row properties of the rendering state.
 */
export interface RenderRowProps {
  /**
   * The rendering zone page calculated with the scroll position
   */
  page: number;
  /**
   * The first rendered row in the rendering zone
   */
  firstRowIdx: number;
  /**
   * The last rendered row in the rendering zone
   */
  lastRowIdx: number;
}

/**
 * The object containing the pagination properties of the rendering state.
 */
export interface RenderPaginationProps {
  /**
   * The current page if pagination is enabled
   */
  paginationCurrentPage?: number;
  /**
   * The current page size if pagination is enabled.
   */
  pageSize?: number;
}

/**
 * The full rendering state.
 */
export type RenderContextProps = ContainerProps &
  RenderColumnsProps &
  RenderRowProps &
  RenderPaginationProps;
