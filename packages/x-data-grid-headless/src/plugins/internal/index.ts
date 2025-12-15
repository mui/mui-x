import rowsPlugin, {
  type RowsPluginApi,
  type RowsPluginState,
  type RowsPluginOptions,
} from './rows/rows';

export const internalPlugins = [rowsPlugin] as const;

export type InternalPluginsApi = RowsPluginApi;

export type InternalPluginsState = RowsPluginState;

export type InternalPluginsOptions = RowsPluginOptions;
