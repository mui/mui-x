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
  };
}

type PaginationPlugin = Plugin<
  'pagination',
  PaginationState,
  typeof paginationSelectors,
  PaginationApi,
  PaginationOptions
>;

const paginationPlugin = createPlugin<PaginationPlugin>()({
  name: 'pagination',
  selectors: paginationSelectors,
  getInitialState: (state, params) => ({
    ...state,
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
      },
    };
  },
});

export default paginationPlugin;
