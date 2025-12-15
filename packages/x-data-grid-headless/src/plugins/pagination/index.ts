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

const paginationPlugin = {
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
  selectors: {
    pagination: {
      model: (state) => state.pagination.paginationModel,
    },
  },
} satisfies Plugin<'pagination', PaginationState, PaginationApi, PaginationOptions>;

export default paginationPlugin;
