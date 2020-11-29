import { FilterItem, LinkOperator } from '../filterItem';

export interface FilterApi {
  showFilterPanel: (targetColumnField?: string) => void;
  upsertFilter: (item: FilterItem) => void;
  applyFilters: () => void;
  applyFilter: (item: FilterItem, linkOperator?: LinkOperator) => void;
  deleteFilter: (item: FilterItem) => void;
  applyFilterLinkOperator: (operator: LinkOperator) => void;
}
