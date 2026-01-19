import { createSelector } from '@base-ui/utils/store';
import { type Plugin, createPlugin } from '../core/plugin';

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

const selectPaginationModel = createSelector(
  (state: PaginationState) => state.pagination.paginationModel,
);

const paginationSelectors = {
  paginationModel: selectPaginationModel,
};

interface PaginationApi {
  pagination: {
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
    setModel: (model: PaginationModel) => void;
    selectors: typeof paginationSelectors;
  };
}

type PaginationPlugin = Plugin<
  'pagination',
  PaginationState,
  PaginationApi,
  PaginationOptions,
  {} // TColumnMeta - no column metadata
>;

const paginationPlugin = createPlugin<PaginationPlugin>()({
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
        setPage: (_page) => {},
        setPageSize: (_pageSize) => {},
        setModel,
        selectors: paginationSelectors,
      },
    };
  },
});

export default paginationPlugin;
