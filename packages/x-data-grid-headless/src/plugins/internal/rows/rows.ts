import { type Store } from '@base-ui/utils/store';
import { type Plugin } from '../../core/plugin';
import {
  type RowsState,
  type RowsApi,
  type RowsOptions,
  createRowsState,
  createRowsApi,
} from './rowUtils';

export interface RowsPluginState {
  rows: RowsState;
}

export interface RowsPluginApi {
  rows: RowsApi;
}

export interface RowsPluginOptions<TData = any> extends RowsOptions<TData> {
  initialState?: {
    rows?: Partial<RowsState>;
  };
}

const rowsPlugin = {
  name: 'rows',
  initialize: (params) => ({
    rows: createRowsState(params.data, params.getRowId, params.loading ?? false, params.rowCount),
  }),
  use: (store, params, _api) => {
    const rowsApi = createRowsApi(store as Store<{ rows: RowsState }>, {
      data: params.data,
      getRowId: params.getRowId,
      loading: params.loading,
      rowCount: params.rowCount,
    });
    return { rows: rowsApi };
  },
} satisfies Plugin<'rows', RowsPluginState, RowsPluginApi, RowsPluginOptions>;

export default rowsPlugin;
