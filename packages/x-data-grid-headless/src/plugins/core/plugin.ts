import { type Store } from '@base-ui/utils/store';
import { type PluginRegistry } from './pluginRegistry';

interface BaseApi {
  pluginRegistry: PluginRegistry;
}

export interface Plugin<
  TName extends string,
  TState,
  TApi,
  TParams extends Record<string, any> = any,
  TRequiredApi extends Record<string, any> = {},
> {
  name: TName;
  initialize: (params: TParams) => TState;
  use: (store: Store<any>, params: TParams, api: TRequiredApi & BaseApi) => TApi;
  selectors?: Record<string, (state: any, ...args: any[]) => any>;
}
