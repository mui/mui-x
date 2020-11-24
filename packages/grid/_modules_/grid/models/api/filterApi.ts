import { FilterItem, LinkOperator } from '../filterItem';

export interface FilterApi {
  showFilterPanel: (targetColumnField?: string) => void;
  upsertFilter: (item: FilterItem) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  deleteFilter: (item: FilterItem) => void;
  applyFilterLinkOperator: (operator: LinkOperator) => void;
}
