'use client';
import * as React from 'react';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { Store, useStore, ReadonlyStore } from '@base-ui/utils/store';
import { AnyPlugin, BaseApi } from '../plugins/core/plugin';
import {
  PluginsApi,
  PluginsColumnMeta,
  PluginsOptions,
  PluginsState,
} from '../plugins/core/helpers';
import { PluginRegistry } from '../plugins/core/pluginRegistry';
import { internalPlugins, InternalPluginsApi, InternalPluginsState } from '../plugins/internal';

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
  store: DataGridStore<DataGridState<TPlugins>>;
  api: DataGridApi<TPlugins, TRow>;
}

export const useDataGrid = <const TPlugins extends readonly AnyPlugin[], TRow extends object = any>(
  options: UseDataGridOptions<TPlugins, TRow>,
): DataGridInstance<TPlugins, TRow> => {
  const { pluginRegistry, stateStore } = useRefWithInit(() => {
    const registry = new PluginRegistry(internalPlugins, options.plugins);

    const baseStateParts: Record<string, any>[] = [];
    internalPlugins.forEach((plugin) => {
      const pluginState = plugin.initialize({
        ...options,
        ...options.initialState,
      } as any);
      baseStateParts.push(pluginState as Record<string, any>);
    });
    const baseState = Object.assign({}, ...baseStateParts) as InternalPluginsState;

    const userPluginStateParts: Record<string, any>[] = [];
    registry.forEachUserPlugin((plugin) => {
      const pluginState = plugin.initialize({
        ...options,
        ...options.initialState,
      } as any);
      userPluginStateParts.push(pluginState as Record<string, any>);
    });
    const userPluginState = Object.assign({}, ...userPluginStateParts);

    const store = new Store<DataGridState<TPlugins>>(
      Object.assign({}, baseState, userPluginState) as DataGridState<TPlugins>,
    );

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
    store: publicStore,
    api,
    options,
  };
};
