import { type Store, useStore } from '@base-ui/utils/store';
import type { Plugin } from '../core/plugin';

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

// API that will be merged into DataGridInstance.api
interface SortingApi {
  sorting: {
    setSortModel: (model: SortModel) => void;
    getSortModel: () => SortModel;
    sortColumn: (field: string, direction: 'asc' | 'desc') => void;
  };
}

const createSortingHooks = (store: Store<SortingState>) => ({
  sorting: {
    useSortModel: () => useStore(store, (state) => state.sorting.sortModel),
  },
});

export type SortingPluginHooks = ReturnType<typeof createSortingHooks>;

// Plugin implementation
interface SortingColumnMeta {
  sortable?: boolean;
}

const sortingPlugin: Plugin<
  'sorting',
  SortingState,
  SortingApi,
  SortingOptions,
  SortingColumnMeta,
  SortingPluginHooks
> = {
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
      },
    };
  },
  createHooks: createSortingHooks,
};

export default sortingPlugin;
