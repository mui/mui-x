import { FilterModel } from '../../hooks/features/filter/FilterModelState';
import { FilterItem, GridLinkOperator } from '../filterItem';
import { FilterModelParams } from '../params/filterModelParams';

export interface FilterApi {
  showFilterPanel: (targetColumnField?: string) => void;
  hideFilterPanel: () => void;
  upsertFilter: (item: FilterItem) => void;
  applyFilters: () => void;
  applyFilter: (item: FilterItem, linkOperator?: GridLinkOperator) => void;
  deleteFilter: (item: FilterItem) => void;
  applyFilterLinkOperator: (operator: GridLinkOperator) => void;
  onFilterModelChange: (handler: (params: FilterModelParams) => void) => void;
  setFilterModel: (model: FilterModel) => void;
}
