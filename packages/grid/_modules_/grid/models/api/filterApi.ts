import { FilterItem, LinkOperator } from '../../hooks/features/filter/visibleRowsState';

export interface FilterApi {
  showFilterPanel: (targetColumnField?: string) => void;
  upsertFilter: (item: FilterItem) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  deleteFilter: (item: FilterItem) => void;
  applyFilterLinkOperator: (operator: LinkOperator) => void;
}
