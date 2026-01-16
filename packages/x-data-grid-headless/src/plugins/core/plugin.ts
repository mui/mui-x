import { type Store } from '@base-ui/utils/store';
import type { UnionToIntersection } from 'type-fest';
import type { InternalPluginsApi, InternalPluginsOptions, InternalPluginsState } from '../internal';

export interface BaseApi {
  pluginRegistry: PluginRegistryApi;
}

export type AnyPlugin = Plugin<any, any, any, any, any, any, any, any>;

// Extract API type from a plugin
export type ExtractPluginApi<T> =
  T extends Plugin<any, any, infer TApi, any, any, any, any, any> ? TApi : never;

// Extract column metadata from a plugin
export type ExtractPluginColumnMeta<T> =
  T extends Plugin<infer TName, any, any, any, infer TColumnMeta, any, any, any>
    ? [TColumnMeta] extends [Record<string, never>]
      ? never
      : { [K in TName]: TColumnMeta }
    : never;

// Extract API from an array of plugins (dependencies)
export type ExtractDependenciesApi<TDeps extends readonly AnyPlugin[]> = UnionToIntersection<
  {
    [K in keyof TDeps]: ExtractPluginApi<TDeps[K]>;
  }[number]
>;

// Recursively extract all APIs from dependencies including transitive deps
export type ExtractAllDependenciesApi<TDeps extends readonly AnyPlugin[]> = TDeps extends readonly [
  infer First extends AnyPlugin,
  ...infer Rest extends readonly AnyPlugin[],
]
  ? ExtractPluginApi<First> &
      (First extends { dependencies: infer D }
        ? D extends readonly AnyPlugin[]
          ? ExtractAllDependenciesApi<D>
          : {}
        : {}) &
      ExtractAllDependenciesApi<Rest>
  : {};

// Plugin registry API available inside plugins
export interface PluginRegistryApi {
  hasPlugin<TPlugin extends AnyPlugin>(
    _api: BaseApi,
    pluginName: TPlugin['name'],
  ): _api is BaseApi & ExtractPluginApi<TPlugin>;
}

export interface Plugin<
  TName extends string,
  TState,
  TApi,
  TParams extends Record<string, any> = any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TColumnMeta = {},
  THooks = {},
  TRequiredApi extends Record<string, any> = {},
  TDeps extends readonly AnyPlugin[] = readonly AnyPlugin[],
> {
  name: TName;
  dependencies?: TDeps;
  initialize: (params: TParams) => TState;
  use: (
    store: Store<TState & InternalPluginsState>,
    params: TParams & InternalPluginsOptions,
    api: TRequiredApi & ExtractAllDependenciesApi<TDeps> & BaseApi & InternalPluginsApi,
  ) => TApi;
  createHooks?: (store: Store<TState & InternalPluginsState>) => THooks;
}

// Helper type to extract Plugin type params
// Order: TName, TState, TApi, TParams, TColumnMeta, THooks, TRequiredApi, TDeps
type PluginName<T> = T extends Plugin<infer N, any, any, any, any, any, any, any> ? N : never;
type PluginState<T> = T extends Plugin<any, infer S, any, any, any, any, any, any> ? S : never;
type PluginApi<T> = T extends Plugin<any, any, infer A, any, any, any, any, any> ? A : never;
type PluginParams<T> = T extends Plugin<any, any, any, infer P, any, any, any, any> ? P : never;
type PluginColumnMeta<T> = T extends Plugin<any, any, any, any, infer C, any, any, any> ? C : never;
type PluginHooks<T> = T extends Plugin<any, any, any, any, any, infer H, any, any> ? H : never;
type PluginRequiredApi<T> =
  T extends Plugin<any, any, any, any, any, any, infer R, any> ? R : never;

// Helper to create a plugin with automatic dependency type inference
// Usage: createPlugin<PluginType>()(pluginImpl) - the double call allows TDeps inference
export function createPlugin<TPlugin extends AnyPlugin>() {
  return <const TDeps extends readonly AnyPlugin[] = readonly []>(
    plugin: Omit<TPlugin, 'dependencies' | 'use'> & {
      dependencies?: TDeps;
      use: (
        store: Store<ExtractPluginState<TPlugin> & InternalPluginsState>,
        params: ExtractPluginParams<TPlugin> & InternalPluginsOptions,
        api: ExtractAllDependenciesApi<TDeps> & BaseApi & InternalPluginsApi,
      ) => ExtractPluginApi<TPlugin>;
    },
  ): Plugin<
    PluginName<TPlugin>,
    PluginState<TPlugin>,
    PluginApi<TPlugin>,
    PluginParams<TPlugin>,
    PluginColumnMeta<TPlugin>,
    PluginHooks<TPlugin>,
    PluginRequiredApi<TPlugin>,
    TDeps
  > => plugin as any;
}

// Extract state from plugin for use in createPlugin
type ExtractPluginState<T> =
  T extends Plugin<any, infer TState, any, any, any, any, any, any> ? TState : never;

// Extract params from plugin for use in createPlugin
type ExtractPluginParams<T> =
  T extends Plugin<any, any, any, infer TParams, any, any, any, any> ? TParams : never;
