import rowsPlugin, {
  type RowsPluginApi,
  type RowsPluginState,
  type RowsPluginOptions,
  type RowsPluginHooks,
} from './rows/rows';
import columnsPlugin, {
  type ColumnsPluginApi,
  type ColumnsPluginState,
  type ColumnsPluginOptions,
  type ColumnsPluginHooks,
} from './columns/columns';

export const internalPlugins = [rowsPlugin, columnsPlugin] as const;

export type InternalPluginsApi<TRow = any> = RowsPluginApi<TRow> & ColumnsPluginApi;

export type InternalPluginsState = RowsPluginState & ColumnsPluginState;

export type InternalPluginsOptions<TRow = any> = RowsPluginOptions<TRow> & ColumnsPluginOptions;

export type InternalPluginsHooks = RowsPluginHooks & ColumnsPluginHooks;
