import { Size } from './core';

export interface DimensionsState {
  /**
   * Indicates that the dimensions have been initialized.
   */
  isReady: boolean;
  /**
   * The root container size.
   */
  root: Size;
  /**
   * The viewport size including scrollbars.
   */
  viewportOuterSize: Size;
  /**
   * The viewport size not including scrollbars.
   */
  viewportInnerSize: Size;
  /**
   * The size of the main content (unpinned rows & columns).
   */
  contentSize: Size;
  /**
   * The minimum size to display the grid, including all pinned sections and headers.
   */
  minimumSize: Size;
  /**
   * Indicates if a scroll is currently needed to go from the beginning of the first column to the end of the last column.
   */
  hasScrollX: boolean;
  /**
   * Indicates if a scroll is currently needed to go from the beginning of the first row to the end of the last row.
   */
  hasScrollY: boolean;
  /**
   * Size of the scrollbar used to scroll the rows in pixel.
   * It is defined even when the scrollbar is currently not needed.
   */
  scrollbarSize: number;
  /**
   * Width of a row. At least as wide as `viewportOuterSize.width`.
   */
  rowWidth: number;
  /**
   * Height of a row.
   */
  rowHeight: number;
  /**
   * Size of all the columns.
   */
  columnsTotalWidth: number;
  /**
   * Size of left pinned columns.
   */
  leftPinnedWidth: number;
  /**
   * Size of right pinned columns.
   */
  rightPinnedWidth: number;
  /**
   * Size of the top container.
   */
  topContainerHeight: number;
  /**
   * Size of the bottom container.
   */
  bottomContainerHeight: number;
  /**
   * Indicates that the container takes the height of its content.
   */
  autoHeight: boolean;
  /**
   * Minimal height to display the content area.
   */
  minimalContentHeight: string | number | undefined;
}

/**
 * The rows total height and positions.
 */
export interface RowsMetaState {
  /**
   * The number of rows in the current page.
   */
  rowCount: number;
  /**
   * The height shared by every row of the current page, or `null` if the rows have
   * different heights.
   */
  uniformRowHeight: number | null;
  /**
   * The position of each row.
   * With uniform rows, the array is only built on first access: prefer `RowsMeta.getPosition`.
   */
  positions: number[];
  /**
   * The sum of all visible grid rows in the current rows.
   */
  currentPageTotalHeight: number;
  /**
   * The total height of the pinned top rows.
   */
  pinnedTopRowsTotalHeight: number;
  /**
   * The total height of the pinned bottom rows.
   */
  pinnedBottomRowsTotalHeight: number;
}

export interface RowSpacing {
  top?: number;
  bottom?: number;
}

export type HeightEntry = {
  content: number;
  spacingTop: number;
  spacingBottom: number;
  detail: number;

  autoHeight: boolean;
  needsFirstMeasurement: boolean;
};

export const RowsMeta = {
  /** Creates the state; with uniform rows, `positions` is built lazily on first access. */
  create: (
    rowsMeta: Omit<RowsMetaState, 'positions'> & { positions: number[] | null },
  ): RowsMetaState => {
    const { uniformRowHeight, rowCount, positions } = rowsMeta;
    if (uniformRowHeight === null || positions !== null) {
      return rowsMeta as RowsMetaState;
    }
    let lazyPositions: number[] | undefined;
    // Enumerable so that spreading or serializing the state keeps the `positions` key.
    return Object.defineProperty(rowsMeta, 'positions', {
      enumerable: true,
      get: () => {
        lazyPositions ??= Array.from({ length: rowCount }, (_, i) => i * uniformRowHeight);
        return lazyPositions;
      },
    }) as RowsMetaState;
  },
  /** Position of the row at `index`, or `undefined` out of range, like an array lookup. */
  getPosition: (rowsMeta: RowsMetaState, index: number): number | undefined => {
    if (rowsMeta.uniformRowHeight === null) {
      return rowsMeta.positions[index];
    }
    return index >= 0 && index < rowsMeta.rowCount ? index * rowsMeta.uniformRowHeight : undefined;
  },
  /** Height of the slot of the row at `index` (spacing and detail included), or 0 out of range. */
  getSlotHeight: (rowsMeta: RowsMetaState, index: number): number => {
    const position = RowsMeta.getPosition(rowsMeta, index);
    if (position === undefined) {
      return 0;
    }
    const nextPosition =
      RowsMeta.getPosition(rowsMeta, index + 1) ?? rowsMeta.currentPageTotalHeight;
    return nextPosition - position;
  },
};
