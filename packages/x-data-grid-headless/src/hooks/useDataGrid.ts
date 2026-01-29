'use client';
import * as React from 'react';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { Store, useStore, type ReadonlyStore } from '@base-ui/utils/store';
import {
  type AnyPlugin,
  type BaseApi,
  type PluginsApi,
  type PluginsColumnMeta,
  type PluginsOptions,
  type PluginsState,
  PluginRegistry,
} from '../plugins';
import { internalPlugins, type InternalPluginsApi } from '../plugins/internal';
import type { ColumnState, ColumnLookup } from '../plugins/internal/columns/columnUtils';

type UseDataGridOptions<TPlugins extends readonly AnyPlugin[], TRow = any> = PluginsOptions<
  TPlugins,
  TRow,
  PluginsColumnMeta<TPlugins>
> & {
  plugins: TPlugins;
  initialState?: Partial<PluginsState<TPlugins>>;
};

type DataGridState<TPlugins extends readonly AnyPlugin[]> = PluginsState<TPlugins>;

type DataGridApi<TPlugins extends readonly AnyPlugin[], TRow = any> = PluginsApi<TPlugins, TRow>;

// Transform selector return types to use the correct column metadata from plugins
// This allows static selectors like `columnsPlugin.selectors.visibleColumns` to return
// properly typed columns with plugin-specific metadata (e.g., sortable, filterable)
type TransformColumnMeta<T, TColumnMeta> =
  // ColumnState<any>[] -> ColumnState<TColumnMeta>[]
  T extends (infer U)[]
    ? U extends ColumnState<any>
      ? ColumnState<TColumnMeta>[]
      : T
    : // ColumnLookup<any> -> ColumnLookup<TColumnMeta>
      T extends ColumnLookup<any>
      ? ColumnLookup<TColumnMeta>
      : // ColumnState<any> | undefined -> ColumnState<TColumnMeta> | undefined
        T extends ColumnState<any> | undefined
        ? ColumnState<TColumnMeta> | undefined
        : T;

interface DataGridStore<TState> {
  use: <Value>(selector: (state: TState) => Value) => Value;
  getState: () => TState;
}

function createPublicStore<TState>(store: ReadonlyStore<TState>): DataGridStore<TState> {
  return {
    use: (selector) => useStore(store, selector),
    getState: () => store.state,
  };
}

interface DataGridInstance<TPlugins extends readonly AnyPlugin[], TRow = any> {
  options: UseDataGridOptions<TPlugins, TRow>;
  use: <Value>(
    selector: (state: DataGridState<TPlugins>) => Value,
  ) => TransformColumnMeta<Value, PluginsColumnMeta<TPlugins>>;
  getState: () => DataGridState<TPlugins>;
  api: DataGridApi<TPlugins, TRow>;
}

export const useDataGrid = <const TPlugins extends readonly AnyPlugin[], TRow extends object = any>(
  options: UseDataGridOptions<TPlugins, TRow>,
): DataGridInstance<TPlugins, TRow> => {
  const { pluginRegistry, stateStore } = useRefWithInit(() => {
    const registry = new PluginRegistry(internalPlugins, options.plugins);

    let accumulatedState: Record<string, any> = { ...options.initialState };
    internalPlugins.forEach((plugin) => {
      accumulatedState = plugin.initialize(accumulatedState as any, options as any);
    });

    registry.forEachUserPlugin((plugin) => {
      accumulatedState = plugin.initialize(accumulatedState, options as any);
    });

    const store = new Store<DataGridState<TPlugins>>(accumulatedState as DataGridState<TPlugins>);

    return {
      pluginRegistry: registry,
      stateStore: store,
    };
  }).current;

  const baseApi = useRefWithInit(() => {
    return {
      pluginRegistry,
    } as unknown as BaseApi & InternalPluginsApi<TRow>;
  }).current;

  internalPlugins.forEach((plugin: AnyPlugin) => {
    const pluginApi = plugin.use(stateStore, options as any, baseApi);
    Object.assign(baseApi, pluginApi);
  });

  const api = useRefWithInit(() => {
    return {
      ...baseApi,
    } as DataGridApi<TPlugins, TRow>;
  }).current;

  // Pass the accumulating api object so dependencies' APIs are available
  pluginRegistry.forEachUserPlugin((plugin) => {
    const pluginApi = plugin.use(stateStore, options, api);
    Object.assign(api, pluginApi);
  });

  const publicStore = React.useMemo(() => createPublicStore(stateStore), [stateStore]);

  return {
    getState: publicStore.getState,
    use: publicStore.use as DataGridInstance<TPlugins, TRow>['use'],
    api,
    options,
  };
};
