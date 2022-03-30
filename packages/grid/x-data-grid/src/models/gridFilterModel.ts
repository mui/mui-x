import { GridFilterItem, GridLinkOperator, GridQuickFilterLogic } from './gridFilterItem';

/**
 * Model describing the filters to apply to the grid.
 */
export interface GridFilterModel {
  /**
   * @default []
   */
  items: GridFilterItem[];

  /**
   * - `GridLinkOperator.And`: the row must pass all the filter items.
   * - `GridLinkOperator.Or`: the row must pass at least on filter item.
   * @default `GridLinkOperator.Or`
   */
  linkOperator?: GridLinkOperator;

  /**
   * values used to quick filter rows
   * @default `[]`
   */
  quickFilterValues?: any[];

  /**
   * - `GridQuickFilterLogic.And`: the row must pass all the values.
   * - `GridQuickFilterLogic.Or`: the row must pass at least one value.
   * @default `GridQuickFilterLogic.Or`
   */
  quickFilterLogic?: GridQuickFilterLogic;
}
