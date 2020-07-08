import { SortModel } from '../sortModel';
import { ColumnSortedParams } from '../params/columnSortedParams';

export interface SortApi {
  getSortModel: () => SortModel;
  setSortModel: (model: SortModel) => void;
  onColumnsSorted: (handler: (param: ColumnSortedParams) => void) => () => void;
}
