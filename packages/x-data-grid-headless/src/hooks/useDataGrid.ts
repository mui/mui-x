'use client';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { Store } from '@base-ui/utils/store';
import { ColumnDef } from '../columnDef/columnDef';
import { BaseApi, Plugin } from '../plugins/core/plugin';
import { PluginsApi, PluginsOptions, PluginsState } from '../plugins/core/helpers';
import { PluginRegistry } from '../plugins/core/pluginRegistry';
import { internalPlugins, InternalPluginsApi, InternalPluginsState } from '../plugins/internal';

// ================================
// Core Options
// ================================

interface CoreDataGridOptions<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  loading?: boolean;
  rowCount?: number;
}

// ================================
// Combined Types
// ================================

type UseDataGridOptions<
  TData,
  TPlugins extends readonly Plugin<any, any, any, any, any>[],
> = CoreDataGridOptions<TData> &
  PluginsOptions<TPlugins> & {
    plugins: TPlugins;
    initialState?: Partial<PluginsState<TPlugins>>;
  };

type DataGridState<TPlugins extends readonly Plugin<any, any, any, any, any>[]> =
  PluginsState<TPlugins>;

type DataGridApi<TPlugins extends readonly Plugin<any, any, any, any, any>[]> =
  PluginsApi<TPlugins>;

// ================================
// Instance
// ================================

interface DataGridInstance<TData, TPlugins extends readonly Plugin<any, any, any, any, any>[]> {
  options: UseDataGridOptions<TData, TPlugins>;
  state: DataGridState<TPlugins>;
  store: Store<DataGridState<TPlugins>>;
  api: DataGridApi<TPlugins>;
}

// ================================
// Hook
// ================================

export const useDataGrid = <
  TData,
  const TPlugins extends readonly Plugin<any, any, any, any, any>[],
>(
  options: UseDataGridOptions<TData, TPlugins>,
): DataGridInstance<TData, TPlugins> => {
  const { pluginRegistry, stateStore } = useRefWithInit(() => {
    // 1. Create registry with internal + user plugins (order maintained)
    const registry = new PluginRegistry(internalPlugins, options.plugins);

    // 2. Initialize internal plugin states FIRST
    const baseStateParts: Record<string, any>[] = [];
    internalPlugins.forEach((plugin) => {
      const pluginState = plugin.initialize({
        ...options,
        ...options.initialState,
      } as any);
      baseStateParts.push(pluginState as Record<string, any>);
    });
    const baseState = Object.assign({}, ...baseStateParts) as InternalPluginsState;

    // 3. Initialize user plugin states
    const userPluginStateParts: Record<string, any>[] = [];
    registry.forEachUserPlugin((plugin) => {
      const pluginState = plugin.initialize({
        ...options,
        ...options.initialState,
      } as any);
      userPluginStateParts.push(pluginState as Record<string, any>);
    });
    const userPluginState = Object.assign({}, ...userPluginStateParts);

    // 4. Create store with base + user plugin state
    const store = new Store<DataGridState<TPlugins>>(
      Object.assign({}, baseState, userPluginState) as DataGridState<TPlugins>,
    );

    return {
      pluginRegistry: registry,
      stateStore: store,
    };
  }).current;

  // Create base API from internal plugins (called on every render so hooks work)
  const baseApi = useRefWithInit(() => {
    return {
      pluginRegistry,
    } as BaseApi & InternalPluginsApi;
  }).current;

  // Initialize internal plugin APIs (called on every render so hooks inside work)
  internalPlugins.forEach((plugin: Plugin<any, any, any, any, any>) => {
    const pluginApi = plugin.use(stateStore, options as any, baseApi);
    Object.assign(baseApi, pluginApi);
  });

  // Build full API: base (internal) + user plugins
  const api = useRefWithInit(() => {
    return {
      ...baseApi,
    } as DataGridApi<TPlugins>;
  }).current;

  // Initialize user plugin APIs (called on every render so hooks inside work)
  pluginRegistry.forEachUserPlugin((plugin) => {
    const pluginApi = plugin.use(stateStore, options, baseApi);
    Object.assign(api, pluginApi);
  });

  return {
    store: stateStore,
    state: stateStore.state,
    api,
    options,
  };
};
