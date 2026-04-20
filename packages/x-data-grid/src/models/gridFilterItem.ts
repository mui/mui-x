import type { GridBaseColDef } from './colDef/gridColDef';

/**
 * Filter item definition interface.
 * @demos
 *   - [Custom filter operator](/x/react-data-grid/filtering/customization/#create-a-custom-operator)
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
  field: GridBaseColDef['field'];
  /**
   * The filtering value.
   * The operator filtering function will decide for each row if the row values is correct compared to this value.
   */
  value?: any;
  /**
   * The name of the operator we want to apply.
   * A custom operator is supported by providing any string value.
   */
  operator:
    | 'contains'
    | 'doesNotContain'
    | 'equals'
    | 'doesNotEqual'
    | 'startsWith'
    | 'endsWith'
    | '='
    | '!='
    | '>'
    | '>='
    | '<'
    | '<='
    | 'is'
    | 'not'
    | 'after'
    | 'onOrAfter'
    | 'before'
    | 'onOrBefore'
    | 'isEmpty'
    | 'isNotEmpty'
    | 'isAnyOf'
    | (string & {});
}

enum GridLogicOperator {
  And = 'and',
  Or = 'or',
}

export { GridLogicOperator };
