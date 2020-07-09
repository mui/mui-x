import { ColDef } from '../colDef/colDef';
import { SortModel } from '../sortModel';

export interface ColumnSortedParams {
  sortedColumns: ColDef[];
  sortModel: SortModel;
}
