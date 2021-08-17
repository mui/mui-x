export interface GridClasses {
  /**
   * Styles applied to the root element.
   */
  root?: string;
  /**
   * Styles applied to the columnHeader element.
   */
  columnHeader?: string;
  /**
   * Styles applied to the row element.
   */
  row?: string;
  /**
   * Styles applied to the cell element.
   */
  cell?: string;
}

export type GridClassKey = keyof GridClasses;
