'use client';
import type { UnionToIntersection } from 'type-fest';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { Store } from '@base-ui/utils/store';
import { BaseApi, Plugin } from '../plugins/core/plugin';
import { PluginsApi, PluginsOptions, PluginsState } from '../plugins/core/helpers';
import { PluginRegistry } from '../plugins/core/pluginRegistry';
import {
  internalPlugins,
  InternalPluginsApi,
  InternalPluginsState,
  InternalPluginsSelectors,
} from '../plugins/internal';

// ================================
// Combined Types
// ================================

type UseDataGridOptions<
  TPlugins extends readonly Plugin<any, any, any, any, any>[],
  TRow = any,
> = PluginsOptions<TPlugins, TRow> & {
  plugins: TPlugins;
  initialState?: Partial<PluginsState<TPlugins>>;
};

type DataGridState<TPlugins extends readonly Plugin<any, any, any, any, any>[]> =
  PluginsState<TPlugins>;

type DataGridApi<
  TPlugins extends readonly Plugin<any, any, any, any, any>[],
  TRow = any,
> = PluginsApi<TPlugins, TRow>;

// Helper to extract selectors from a plugin, preserving their shape
type ExtractPluginSelectors<T> = T extends { selectors?: infer S } ? S : {};

// Merge all plugin selectors (internal + user plugins), preserving their shape
type PluginsSelectors<TPlugins extends readonly Plugin<any, any, any, any, any>[]> =
  UnionToIntersection<
    {
      [K in keyof TPlugins]: ExtractPluginSelectors<TPlugins[K]>;
    }[number]
  > &
    InternalPluginsSelectors;

type DataGridSelectors<TPlugins extends readonly Plugin<any, any, any, any, any>[]> =
  PluginsSelectors<TPlugins>;

// ================================
// Instance
// ================================

interface DataGridInstance<
  TPlugins extends readonly Plugin<any, any, any, any, any>[],
  TRow = any,
> {
  options: UseDataGridOptions<TPlugins, TRow>;
  state: DataGridState<TPlugins>;
  store: Store<DataGridState<TPlugins>>;
  api: DataGridApi<TPlugins, TRow>;
  selectors: DataGridSelectors<TPlugins>;
}

// ================================
// Hook
// ================================

export const useDataGrid = <
  const TPlugins extends readonly Plugin<any, any, any, any, any>[],
  TRow extends object = any,
>(
  options: UseDataGridOptions<TPlugins, TRow>,
): DataGridInstance<TPlugins, TRow> => {
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
    } as BaseApi & InternalPluginsApi<TRow>;
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
    } as DataGridApi<TPlugins, TRow>;
  }).current;

  // Initialize user plugin APIs (called on every render so hooks inside work)
  pluginRegistry.forEachUserPlugin((plugin) => {
    const pluginApi = plugin.use(stateStore, options, baseApi);
    Object.assign(api, pluginApi);
  });

  // Collect selectors from all plugins, preserving their shape
  const selectors = useRefWithInit(() => {
    const allSelectors: Record<string, any> = {};

    // Collect selectors from internal plugins
    internalPlugins.forEach((plugin) => {
      if (plugin.selectors) {
        Object.assign(allSelectors, plugin.selectors);
      }
    });

    // Collect selectors from user plugins
    pluginRegistry.forEachUserPlugin((plugin) => {
      if (plugin.selectors) {
        Object.assign(allSelectors, plugin.selectors);
      }
    });

    return allSelectors as DataGridSelectors<TPlugins>;
  }).current;

  return {
    store: stateStore,
    state: stateStore.state,
    api,
    selectors,
    options,
  };
};
