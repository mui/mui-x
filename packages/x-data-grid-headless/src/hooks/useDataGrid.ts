import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { Store } from '@base-ui/utils/store';
import { ColumnDef } from '../columnDef/columnDef';
import { Plugin } from '../plugins/core/plugin';
import { PluginsApi, PluginsOptions, PluginsState } from '../plugins/core/helpers';
import { PluginRegistry } from '../plugins/core/pluginRegistry';
import { BaseApi, BaseState } from '../core/plugins';
import { internalPlugins } from '../plugins/internal';

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

// Full options = Core + Plugin options
type UseDataGridOptions<
  TData,
  TPlugins extends readonly Plugin<any, any, any, any, any>[],
> = CoreDataGridOptions<TData> &
  PluginsOptions<TPlugins> & {
    plugins: TPlugins;
    initialState?: Partial<PluginsState<TPlugins>>;
  };

// Full state = BaseState (internal plugins) + User Plugin states
type DataGridState<TPlugins extends readonly Plugin<any, any, any, any, any>[]> =
  PluginsState<TPlugins>;

// Full API = BaseApi (internal plugins) + User Plugin APIs
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
  const { pluginRegistry, stateStore, baseApi } = useRefWithInit(() => {
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
    const baseState = Object.assign({}, ...baseStateParts) as BaseState;

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

    // 5. Create base API from internal plugins
    const base = {
      pluginRegistry: registry,
    } as BaseApi;

    // Initialize internal plugin APIs
    internalPlugins.forEach((plugin: Plugin<any, any, any, any, any>) => {
      const pluginApi = plugin.use(store, options as any, base);
      Object.assign(base, pluginApi);
    });

    return {
      pluginRegistry: registry,
      stateStore: store,
      baseApi: base,
    };
  }).current;

  // Build full API: base (internal) + user plugins
  const api = useRefWithInit(() => {
    const fullApi: DataGridApi<TPlugins> = {
      ...baseApi,
    } as DataGridApi<TPlugins>;

    // Initialize user plugin APIs (they receive baseApi which includes internal plugin APIs)
    pluginRegistry.forEachUserPlugin((plugin) => {
      const pluginApi = plugin.use(stateStore, options, baseApi);
      Object.assign(fullApi, pluginApi);
    });

    return fullApi;
  }).current;

  return {
    store: stateStore,
    state: stateStore.state,
    api,
    options,
  };
};
