'use client';
import * as React from 'react';
import { type Store, createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { type Plugin, createPlugin } from '../../core/plugin';
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

export interface ColumnsPluginOptions<
  TData = any,
  TColumnMeta extends Record<string, any> = {},
> extends ColumnsOptions<TData, TColumnMeta> {
  initialState?: {
    columns?: Partial<ColumnsState>;
  };
}

const selectOrderedFields = createSelector(
  (state: ColumnsPluginState) => state.columns.orderedFields,
);

const selectLookup = createSelector((state: ColumnsPluginState) => state.columns.lookup);

const selectColumnVisibilityModel = createSelector(
  (state: ColumnsPluginState) => state.columns.columnVisibilityModel,
);

const selectInitialColumnVisibilityModel = createSelector(
  (state: ColumnsPluginState) => state.columns.initialColumnVisibilityModel,
);

const selectAllColumns = createSelectorMemoized(
  selectOrderedFields,
  selectLookup,
  (orderedFields, lookup) => orderedFields.map((field) => lookup[field]).filter(Boolean),
);

const selectVisibleColumns = createSelectorMemoized(
  selectOrderedFields,
  selectLookup,
  selectColumnVisibilityModel,
  (orderedFields, lookup, columnVisibilityModel) =>
    orderedFields
      .filter((field) => columnVisibilityModel[field] !== false)
      .map((field) => lookup[field])
      .filter(Boolean),
);

const selectColumn = createSelector(selectLookup, (lookup, field: string) => lookup[field]);

const columnsSelectors = {
  orderedFields: selectOrderedFields,
  lookup: selectLookup,
  columnVisibilityModel: selectColumnVisibilityModel,
  initialColumnVisibilityModel: selectInitialColumnVisibilityModel,
  allColumns: selectAllColumns,
  visibleColumns: selectVisibleColumns,
  column: selectColumn,
};

export interface ColumnsPluginApi {
  columns: ColumnsApi & { selectors: typeof columnsSelectors };
}

type ColumnsPlugin = Plugin<'columns', ColumnsPluginState, ColumnsPluginApi, ColumnsPluginOptions>;

const columnsPlugin = createPlugin<ColumnsPlugin>()({
  name: 'columns',
  getInitialState: (state, params) => {
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

    return { columns: { ...columnsApi, selectors: columnsSelectors } };
  },
});

export default columnsPlugin;
