'use client';
import * as React from 'react';
import { type Store, useStore, createSelector, createSelectorMemoized } from '@base-ui/utils/store';
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

const createColumnsHooks = (store: Store<ColumnsPluginState>) => ({
  useOrderedFields: () => useStore(store, selectOrderedFields),
  useLookup: () => useStore(store, selectLookup),
  useColumnVisibilityModel: () => useStore(store, selectColumnVisibilityModel),
  useInitialColumnVisibilityModel: () => useStore(store, selectInitialColumnVisibilityModel),
  useAllColumns: () => useStore(store, selectAllColumns),
  useVisibleColumns: () => useStore(store, selectVisibleColumns),
  useColumn: (field: string) => useStore(store, selectColumn, field),
});

export interface ColumnsPluginApi {
  columns: ColumnsApi & { hooks: ReturnType<typeof createColumnsHooks> };
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

    const hooks = React.useMemo(() => createColumnsHooks(store), [store]);

    return { columns: { ...columnsApi, hooks } };
  },
} satisfies Plugin<
  'columns',
  ColumnsPluginState,
  ColumnsPluginApi,
  ColumnsPluginOptions
>;

export default columnsPlugin;
