import type { UnionToIntersection } from 'type-fest';
import type { Plugin } from './plugin';
import { InternalPluginsApi, InternalPluginsOptions, InternalPluginsState } from '../internal';

// Helper to extract params (options) from a plugin
export type ExtractPluginParams<T> =
  T extends Plugin<any, any, any, infer TParams, any> ? TParams : never;

// Helper to extract state from a plugin
export type ExtractPluginState<T> =
  T extends Plugin<any, infer TState, any, any, any> ? TState : never;

// Helper to extract API from a plugin
export type ExtractPluginApi<T> = T extends Plugin<any, any, infer TApi, any, any> ? TApi : never;

// Union all plugin options (params)
export type PluginsOptions<
  TPlugins extends readonly Plugin<any, any, any, any, any>[],
  TRow = any,
> = UnionToIntersection<
  {
    [K in keyof TPlugins]: ExtractPluginParams<TPlugins[K]>;
  }[number]
> &
  InternalPluginsOptions<TRow>;

// Union all plugin states
export type PluginsState<TPlugins extends readonly Plugin<any, any, any, any, any>[]> =
  UnionToIntersection<
    {
      [K in keyof TPlugins]: ExtractPluginState<TPlugins[K]>;
    }[number]
  > &
    InternalPluginsState;

// Union all plugin APIs
export type PluginsApi<
  TPlugins extends readonly Plugin<any, any, any, any, any>[],
  TRow = any,
> = UnionToIntersection<
  {
    [K in keyof TPlugins]: ExtractPluginApi<TPlugins[K]>;
  }[number]
> &
  InternalPluginsApi<TRow>;
