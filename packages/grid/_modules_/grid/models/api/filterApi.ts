import { FilterItem } from '../../hooks/features/filter/hiddenRowsState';

export interface FilterApi {
  showFilterPanel: (targetColumnField?: string) => void;
  upsertFilter: (item: FilterItem) => void;
  clearFilter: () => void;
  deleteFilter: (item: FilterItem) => void;
}
