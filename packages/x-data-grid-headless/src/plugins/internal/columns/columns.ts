'use client';
import * as React from 'react';
import type { Store } from '@base-ui/utils/store';
import { type Plugin, createPlugin } from '../../core/plugin';
import type {
  ColumnsState,
  ColumnsPluginState,
  ColumnsPluginApi,
  ColumnsPluginOptions,
} from './types';
import { createColumnsState, createColumnsApi } from './columnUtils';
import { columnsSelectors } from './selectors';

type ColumnsPlugin = Plugin<
  'columns',
  ColumnsPluginState,
  typeof columnsSelectors,
  ColumnsPluginApi,
  ColumnsPluginOptions
>;

const columnsPlugin = createPlugin<ColumnsPlugin>()({
  name: 'columns',
  order: 20,
  selectors: columnsSelectors,
  initialize: (state, params) => {
    const initialStateColumns = params.initialState?.columns;
    return {
      ...state,
      columns: createColumnsState(
        params.columns,
        params.columnVisibilityModel ?? {},
        initialStateColumns,
      ),
    };
  },
  use: (store, params, _api) => {
    const columnsApi = createColumnsApi(store as Store<{ columns: ColumnsState }>, {
      columns: params.columns,
      columnVisibilityModel: params.columnVisibilityModel,
    });

    // Handle prop changes with effects
    const prevColumnsRef = React.useRef(params.columns);
    const prevColumnVisibilityModelRef = React.useRef(params.columnVisibilityModel);

    // Update columns when columns prop changes
    React.useEffect(() => {
      if (prevColumnsRef.current !== params.columns) {
        prevColumnsRef.current = params.columns;
        columnsApi.update(params.columns);
      }
    }, [params.columns, columnsApi]);

    // Update column visibility model when it changes
    React.useEffect(() => {
      if (prevColumnVisibilityModelRef.current !== params.columnVisibilityModel) {
        prevColumnVisibilityModelRef.current = params.columnVisibilityModel;
        if (params.columnVisibilityModel !== undefined) {
          columnsApi.setVisibilityModel(params.columnVisibilityModel);
        }
      }
    }, [params.columnVisibilityModel, columnsApi]);

    return { columns: columnsApi };
  },
});

export default columnsPlugin;
