import { type Store } from '@base-ui/utils/store';
import type { UnionToIntersection } from 'type-fest';
import type { InternalPluginsApi, InternalPluginsOptions, InternalPluginsState } from '../internal';

export interface BaseApi {
  pluginRegistry: PluginRegistryApi;
}

export type AnyPlugin = Plugin<any, any, any, any, any, any>;

// Extract API type from a plugin
export type ExtractPluginApi<T> =
  T extends Plugin<any, any, infer TApi, any, any, any> ? TApi : never;

// Extract column metadata from a plugin
export type ExtractPluginColumnMeta<T> =
  T extends Plugin<infer TName, any, any, any, infer TColumnMeta, any>
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

// Extract state from plugin
export type ExtractPluginState<T> =
  T extends Plugin<any, infer TState, any, any, any, any> ? TState : never;

// Recursively extract all state from dependencies including transitive deps
export type ExtractAllDependenciesState<TDeps extends readonly AnyPlugin[]> =
  TDeps extends readonly [infer First extends AnyPlugin, ...infer Rest extends readonly AnyPlugin[]]
    ? ExtractPluginState<First> &
        (First extends { dependencies: infer D }
          ? D extends readonly AnyPlugin[]
            ? ExtractAllDependenciesState<D>
            : {}
          : {}) &
        ExtractAllDependenciesState<Rest>
    : {};

// The state available to a plugin's getInitialState method
export type AvailableState<TDeps extends readonly AnyPlugin[]> = InternalPluginsState &
  ExtractAllDependenciesState<TDeps>;

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
  TDeps extends readonly AnyPlugin[] = readonly AnyPlugin[],
> {
  name: TName;
  dependencies?: TDeps;
  getInitialState: (
    state: AvailableState<TDeps>,
    params: TParams,
  ) => AvailableState<TDeps> & TState;
  use: (
    store: Store<TState & InternalPluginsState>,
    params: TParams & InternalPluginsOptions,
    api: ExtractAllDependenciesApi<TDeps> & BaseApi & InternalPluginsApi,
  ) => TApi;
}

// Helper type to extract Plugin type params
// Order: TName, TState, TApi, TParams, TColumnMeta, TDeps
type PluginName<T> = T extends Plugin<infer N, any, any, any, any, any> ? N : never;
type PluginState<T> = T extends Plugin<any, infer S, any, any, any, any> ? S : never;
type PluginApi<T> = T extends Plugin<any, any, infer A, any, any, any> ? A : never;
type PluginParams<T> = T extends Plugin<any, any, any, infer P, any, any> ? P : never;
type PluginColumnMeta<T> = T extends Plugin<any, any, any, any, infer C, any> ? C : never;

// Helper to create a plugin with automatic dependency type inference
// Usage: createPlugin<PluginType>()(pluginImpl) - the double call allows TDeps inference
export function createPlugin<TPlugin extends AnyPlugin>() {
  return <const TDeps extends readonly AnyPlugin[] = readonly []>(
    plugin: Omit<TPlugin, 'dependencies' | 'use' | 'getInitialState'> & {
      dependencies?: TDeps;
      getInitialState: (
        state: AvailableState<TDeps>,
        params: ExtractPluginParams<TPlugin>,
      ) => AvailableState<TDeps> & ExtractPluginState<TPlugin>;
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
    TDeps
  > => plugin as any;
}

// Extract params from plugin
type ExtractPluginParams<T> =
  T extends Plugin<any, any, any, infer TParams, any, any> ? TParams : never;
