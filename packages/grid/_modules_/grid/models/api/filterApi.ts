import { FilterItem } from '../../hooks/features/filter/visibleRowsState';

export interface FilterApi {
  showFilterPanel: (targetColumnField?: string) => void;
  upsertFilter: (item: FilterItem) => void;
  applyFilter: (item: FilterItem) => void;
  clearFilter: () => void;
  deleteFilter: (item: FilterItem) => void;
}
