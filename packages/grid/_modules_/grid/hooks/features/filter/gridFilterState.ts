import { GridLinkOperator } from '../../../models/gridFilterItem';
import { GridFilterModel } from '../../../models/gridFilterModel';
import { GridRowId } from '../../../models/gridRows';

export const getDefaultGridFilterModel: () => GridFilterModel = () => ({
  items: [],
  linkOperator: GridLinkOperator.And,
});

export interface GridFilterState {
  filterModel: GridFilterModel;

  /**
   * If a row is not registered in this lookup, it is supposed to be visible
   */
  visibleRowsLookup: Record<GridRowId, boolean>;
  visibleRows: GridRowId[];

  /**
   * Amount of visible descendants for each row
   * For the Tree Data, it includes all the intermediate depth levels (= amount of children + amount of grand children + ...)
   * For the Row Grouping by Column, it does not include the intermediate depth levels (= amount of descendant of maximum depth)
   * If a row is not registered in this lookup, it is supposed to have no descendant.
   */
  visibleDescendantsCountLookup: Record<GridRowId, number>;
}

export interface GridFilterInitialState {
  filterModel?: GridFilterModel;
}
