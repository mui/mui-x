import rowsPlugin, {
  type RowsPluginApi,
  type RowsPluginState,
  type RowsPluginOptions,
} from './rows/rows';
import columnsPlugin, {
  type ColumnsPluginApi,
  type ColumnsPluginState,
  type ColumnsPluginOptions,
} from './columns/columns';

export const internalPlugins = [rowsPlugin, columnsPlugin] as const;

export type InternalPluginsApi = RowsPluginApi & ColumnsPluginApi;

export type InternalPluginsState = RowsPluginState & ColumnsPluginState;

export type InternalPluginsOptions = RowsPluginOptions & ColumnsPluginOptions;
