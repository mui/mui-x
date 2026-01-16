import * as React from 'react';
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

const createPaginationHooks = (store: Store<PaginationState>) => ({
  usePaginationModel: () => useStore(store, (state) => state.pagination.paginationModel),
});

interface PaginationApi {
  pagination: {
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
    setModel: (model: PaginationModel) => void;
    hooks: ReturnType<typeof createPaginationHooks>;
  };
}

const paginationPlugin: Plugin<
  'pagination',
  PaginationState,
  PaginationApi,
  PaginationOptions,
  {} // TColumnMeta - no column metadata
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
  use: (store, _params, _api) => {
    const setModel = (_model: PaginationModel) => {};

    const hooks = React.useMemo(() => createPaginationHooks(store), [store]);

    return {
      pagination: {
        setPage: (_page) => {},
        setPageSize: (_pageSize) => {},
        setModel,
        hooks,
      },
    };
  },
};

export default paginationPlugin;
