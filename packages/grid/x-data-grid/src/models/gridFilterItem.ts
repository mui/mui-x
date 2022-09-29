/**
 * Filter item definition interface.
 */
export interface GridFilterItem {
  /**
   * Must be unique.
   * Only useful when the model contains several items.
   */
  id?: number | string;
  /**
   * The column from which we want to filter the rows.
   */
  columnField: string;
  /**
   * The filtering value.
   * The operator filtering function will decide for each row if the row values is correct compared to this value.
   */
  value?: any;
  /**
   * The name of the operator we want to apply.
   * Will become required on `@mui/x-data-grid@6.X`.
   */
  operatorValue?: string;
}

enum GridLinkOperator {
  And = 'and',
  Or = 'or',
}

export { GridLinkOperator };
