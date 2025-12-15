import { type Store } from '@base-ui/utils/store';
import { type PluginRegistry } from './pluginRegistry';
import type { InternalPluginsApi, InternalPluginsOptions, InternalPluginsState } from '../internal';

export interface BaseApi {
  pluginRegistry: PluginRegistry;
}

type Selector<TState> = (state: TState, ...args: any[]) => any;

export interface Plugin<
  TName extends string,
  TState,
  TApi,
  TParams extends Record<string, any> = any,
  TRequiredApi extends Record<string, any> = {},
> {
  name: TName;
  initialize: (params: TParams) => TState;
  use: (
    store: Store<TState & InternalPluginsState>,
    params: TParams & InternalPluginsOptions,
    api: TRequiredApi & BaseApi & InternalPluginsApi,
  ) => TApi;
  selectors?: Record<string, Selector<TState> | Record<string, Selector<TState>>>;
}
