import { type Store, useStore } from '@base-ui/utils/store';
import type { Plugin } from '../core/plugin';

export interface PaginationModel {
  page: number;
  pageSize: number;
}

interface PaginationOptions {
  paginationModel?: PaginationModel;
  onPaginationModelChange?: (model: PaginationModel) => void;
  pageSizeOptions?: number[];
  initialState?: {
    pagination?: {
      paginationModel?: PaginationModel;
    };
  };
}

interface PaginationState {
  pagination: {
    paginationModel: PaginationModel;
  };
}

interface PaginationApi {
  pagination: {
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
    setModel: (model: PaginationModel) => void;
  };
}

const createPaginationHooks = (store: Store<PaginationState>) => ({
  pagination: {
    usePaginationModel: () => useStore(store, (state) => state.pagination.paginationModel),
  },
});

export type PaginationPluginHooks = ReturnType<typeof createPaginationHooks>;

const paginationPlugin: Plugin<
  'pagination',
  PaginationState,
  PaginationApi,
  PaginationOptions,
  {}, // TColumnMeta - no column metadata
  PaginationPluginHooks
> = {
  name: 'pagination',
  initialize: (params) => ({
    pagination: {
      paginationModel: params.initialState?.pagination?.paginationModel ??
        params.paginationModel ?? {
          page: 0,
          pageSize: 10,
        },
    },
  }),
  use: (_store, _params, _api) => {
    const setModel = (_model: PaginationModel) => {};

    return {
      pagination: {
        setPage: (_page: number) => {},
        setPageSize: (_pageSize: number) => {},
        setModel,
      },
    };
  },
  createHooks: createPaginationHooks,
};

export default paginationPlugin;
