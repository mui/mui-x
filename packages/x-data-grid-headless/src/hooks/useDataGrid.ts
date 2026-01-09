'use client';
import type { UnionToIntersection } from 'type-fest';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { Store } from '@base-ui/utils/store';
import { AnyPlugin, BaseApi, Plugin } from '../plugins/core/plugin';
import { PluginsApi, PluginsOptions, PluginsState } from '../plugins/core/helpers';
import { PluginRegistry } from '../plugins/core/pluginRegistry';
import {
  internalPlugins,
  InternalPluginsApi,
  InternalPluginsState,
  InternalPluginsHooks,
} from '../plugins/internal';

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

type ExtractPluginHooks<T> = T extends { createHooks?: (...args: any[]) => infer H } ? H : {};

type PluginsHooks<TPlugins extends readonly Plugin<any, any, any, any, any, any>[]> =
  UnionToIntersection<
    {
      [K in keyof TPlugins]: ExtractPluginHooks<TPlugins[K]>;
    }[number]
  > &
    InternalPluginsHooks;

type DataGridHooks<TPlugins extends readonly Plugin<any, any, any, any, any, any>[]> =
  PluginsHooks<TPlugins>;

interface DataGridInstance<
  TPlugins extends readonly Plugin<any, any, any, any, any, any>[],
  TRow = any,
> {
  options: UseDataGridOptions<TPlugins, TRow>;
  state: DataGridState<TPlugins>;
  store: Store<DataGridState<TPlugins>>;
  api: DataGridApi<TPlugins, TRow>;
  hooks: DataGridHooks<TPlugins>;
}

export const useDataGrid = <
  const TPlugins extends readonly Plugin<any, any, any, any, any, any>[],
  TRow extends object = any,
>(
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

  const hooks = useRefWithInit(() => {
    const allHooks: Record<string, any> = {};

    internalPlugins.forEach((plugin) => {
      if ('createHooks' in plugin && typeof plugin.createHooks === 'function') {
        Object.assign(allHooks, plugin.createHooks(stateStore as any));
      }
    });

    pluginRegistry.forEachUserPlugin((plugin) => {
      if ('createHooks' in plugin && typeof plugin.createHooks === 'function') {
        Object.assign(allHooks, (plugin as any).createHooks(stateStore));
      }
    });

    return allHooks as DataGridHooks<TPlugins>;
  }).current;

  return {
    store: stateStore,
    state: stateStore.state,
    api,
    hooks,
    options,
  };
};
