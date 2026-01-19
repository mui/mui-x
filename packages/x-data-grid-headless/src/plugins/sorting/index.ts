import { createSelector } from '@base-ui/utils/store';
import { type Plugin, createPlugin } from '../core/plugin';

export type SortModel = Array<{
  field: string;
  sort: 'asc' | 'desc';
}>;

// Options that will be merged into UseDataGridOptions
interface SortingOptions {
  sortModel?: SortModel;
  onSortModelChange?: (model: SortModel) => void;
  enableSorting?: boolean;
  enableMultiSort?: boolean;
  initialState?: {
    sorting?: {
      sortModel?: SortModel;
    };
  };
}

// State that will be merged into DataGridState
interface SortingState {
  sorting: {
    sortModel: SortModel;
  };
}

const selectSortModel = createSelector((state: SortingState) => state.sorting.sortModel);

const sortingSelectors = {
  sortModel: selectSortModel,
};

// API that will be merged into DataGridInstance.api
interface SortingApi {
  sorting: {
    setSortModel: (model: SortModel) => void;
    getSortModel: () => SortModel;
    sortColumn: (field: string, direction: 'asc' | 'desc') => void;
    selectors: typeof sortingSelectors;
  };
}

// Plugin implementation
interface SortingColumnMeta {
  sortable?: boolean;
}

type SortingPlugin = Plugin<'sorting', SortingState, SortingApi, SortingOptions, SortingColumnMeta>;

const sortingPlugin = createPlugin<SortingPlugin>()({
  name: 'sorting',
  initialize: (params) => ({
    sorting: {
      sortModel: params.initialState?.sorting?.sortModel ?? params.sortModel ?? [],
    },
  }),
  use: (store, _params, _api) => {
    const setSortModel = (_model: SortModel) => {};
    const sortColumn = (_field: string, _direction: 'asc' | 'desc') => {};

    return {
      sorting: {
        setSortModel,
        getSortModel: () => store.state.sorting.sortModel,
        sortColumn,
        selectors: sortingSelectors,
      },
    };
  },
});

export default sortingPlugin;
