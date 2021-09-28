import { GridLinkOperator } from '../../../models/gridFilterItem';
import { GridFilterModel } from '../../../models/gridFilterModel';
import { GridRowId } from '../../../models/gridRows';

export const getDefaultGridFilterModel: () => GridFilterModel = () => ({
  items: [],
  linkOperator: GridLinkOperator.And,
});

export const getEmptyVisibleRows = (): Omit<GridFilterState, 'filterModel'> => ({
  visibleRowsLookup: {},
  visibleRows: [],
  visibleRowCount: 0,
  visibleTopLevelRowCount: 0,
});

export interface GridFilterState {
  filterModel: GridFilterModel;

  /**
   * Visibility status of each row after applying the filtering
   * The expanded children rows are also set to `true`
   */
  visibleRowsLookup: Record<GridRowId, boolean>;

  /**
   * Rows visible after applying the filtering
   * It also contains the expanded children rows
   */
  visibleRows: GridRowId[];

  /**
   * Amount of rows after applying the filtering
   * It also count the expanded children rows
   */
  visibleRowCount: number;

  /**
   * Amount of rows after applying the filtering
   * It does not count the expanded children rows
   */
  visibleTopLevelRowCount: number;
}
