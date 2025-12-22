'use client';
import * as React from 'react';
import { type Store } from '@base-ui/utils/store';
import { type Plugin } from '../../core/plugin';
import {
  type ColumnsState,
  type ColumnsApi,
  type ColumnsOptions,
  createColumnsState,
  createColumnsApi,
} from './columnUtils';

export interface ColumnsPluginState {
  columns: ColumnsState;
}

export interface ColumnsPluginApi {
  columns: ColumnsApi;
}

export interface ColumnsPluginOptions<TData = any> extends ColumnsOptions<TData> {
  initialState?: {
    columns?: Partial<ColumnsState>;
  };
}

const columnsPlugin = {
  name: 'columns',
  initialize: (params) => {
    // Extract initialState.columns if it exists (it might be spread at top level)
    const initialStateColumns = (params as any).initialState?.columns;
    return {
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
  selectors: {
    columns: {
      orderedFields: (state) => state.columns.orderedFields,
      lookup: (state) => state.columns.lookup,
      columnVisibilityModel: (state) => state.columns.columnVisibilityModel,
      initialColumnVisibilityModel: (state) => state.columns.initialColumnVisibilityModel,
      allColumns: (state) => {
        const { orderedFields, lookup } = state.columns;
        return orderedFields.map((field) => lookup[field]).filter(Boolean);
      },
      visibleColumns: (state) => {
        const { orderedFields, lookup, columnVisibilityModel } = state.columns;
        return orderedFields
          .filter((field) => columnVisibilityModel[field] !== false)
          .map((field) => lookup[field])
          .filter(Boolean);
      },
      column: (state, field: string) => state.columns.lookup[field],
    },
  },
} satisfies Plugin<'columns', ColumnsPluginState, ColumnsPluginApi, ColumnsPluginOptions>;

export default columnsPlugin;
