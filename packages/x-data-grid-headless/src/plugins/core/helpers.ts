import type { UnionToIntersection } from 'type-fest';
import type { AnyPlugin, ExtractPluginApi, ExtractPluginColumnMeta, Plugin } from './plugin';
import { InternalPluginsApi, InternalPluginsOptions, InternalPluginsState } from '../internal';

// Helper to extract params (options) from a plugin
export type ExtractPluginParams<T> =
  T extends Plugin<any, any, any, infer TParams, any, any, any, any> ? TParams : never;

// Helper to extract state from a plugin
export type ExtractPluginState<T> =
  T extends Plugin<any, infer TState, any, any, any, any, any, any> ? TState : never;

// Extract TDeps from Plugin type parameter (8th param)
// Order: TName, TState, TApi, TParams, TColumnMeta, THooks, TRequiredApi, TDeps
type ExtractPluginDeps<T> =
  T extends Plugin<any, any, any, any, any, any, any, infer TDeps> ? TDeps : readonly [];

// Check if TDeps is a concrete tuple (not just readonly AnyPlugin[])
type HasConcreteDeps<TDeps> = TDeps extends readonly []
  ? false
  : TDeps extends readonly AnyPlugin[]
    ? readonly [] extends TDeps
      ? false // TDeps is readonly AnyPlugin[] (too general)
      : true // TDeps is a concrete tuple
    : false;

// Recursively collect all plugins including their dependencies
// Use conditional to prevent infinite recursion on empty/generic deps
type CollectAllPlugins<T> = T extends AnyPlugin
  ? HasConcreteDeps<ExtractPluginDeps<T>> extends true
    ? T | CollectAllPlugins<ExtractPluginDeps<T>[number]>
    : T
  : never;

// Flatten plugins array to include all dependencies
type FlattenPluginsWithDeps<TPlugins extends readonly AnyPlugin[]> = TPlugins extends readonly []
  ? never
  : CollectAllPlugins<TPlugins[number]>;

// Safe union to intersection that handles never
type SafeUnionToIntersection<T> = [T] extends [never] ? {} : UnionToIntersection<T>;

// Union all plugin options (params) including dependencies
export type PluginsOptions<
  TPlugins extends readonly Plugin<any, any, any, any, any, any, any, any>[],
  TRow = any,
  TColumnMeta extends Record<string, any> = {},
> = SafeUnionToIntersection<ExtractPluginParams<FlattenPluginsWithDeps<TPlugins>>> &
  InternalPluginsOptions<TRow, TColumnMeta>;

// Union all plugin states including dependencies
export type PluginsState<
  TPlugins extends readonly Plugin<any, any, any, any, any, any, any, any>[],
> = SafeUnionToIntersection<ExtractPluginState<FlattenPluginsWithDeps<TPlugins>>> &
  InternalPluginsState;

// Union all plugin APIs including dependencies
export type PluginsApi<
  TPlugins extends readonly Plugin<any, any, any, any, any, any, any, any>[],
  TRow = any,
> = SafeUnionToIntersection<ExtractPluginApi<FlattenPluginsWithDeps<TPlugins>>> &
  InternalPluginsApi<TRow>;

// Union all plugin column metadata including dependencies
// Creates a type like { sorting: { sortable?: boolean }, grouping: { groupable?: boolean } }
export type PluginsColumnMeta<
  TPlugins extends readonly Plugin<any, any, any, any, any, any, any, any>[],
> = SafeUnionToIntersection<ExtractPluginColumnMeta<FlattenPluginsWithDeps<TPlugins>>>;
