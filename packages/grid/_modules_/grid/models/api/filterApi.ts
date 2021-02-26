import { FilterModel } from '../../hooks/features/filter/FilterModelState';
import { GridFilterItem, GridLinkOperator } from '../gridFilterItem';
import { GridRowModel } from '../gridRows';
import { GridFilterModelParams } from '../params/gridFilterModelParams';

export interface FilterApi {
  showFilterPanel: (targetColumnField?: string) => void;
  hideFilterPanel: () => void;
  upsertFilter: (item: GridFilterItem) => void;
  applyFilters: () => void;
  applyFilter: (item: GridFilterItem, linkOperator?: GridLinkOperator) => void;
  deleteFilter: (item: GridFilterItem) => void;
  applyFilterLinkOperator: (operator: GridLinkOperator) => void;
  onFilterModelChange: (handler: (params: GridFilterModelParams) => void) => void;
  setFilterModel: (model: FilterModel) => void;
  getVisibleRowModels: () => GridRowModel[];
}
