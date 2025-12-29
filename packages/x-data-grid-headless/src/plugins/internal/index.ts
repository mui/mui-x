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

export type InternalPluginsApi<TRow = any> = RowsPluginApi<TRow> & ColumnsPluginApi;

export type InternalPluginsState = RowsPluginState & ColumnsPluginState;

export type InternalPluginsOptions<TRow = any> = RowsPluginOptions<TRow> & ColumnsPluginOptions;

// Extract selectors from internal plugins, preserving their shape
type ExtractInternalPluginSelectors<T> = T extends { selectors?: infer S } ? S : {};

export type InternalPluginsSelectors = ExtractInternalPluginSelectors<typeof rowsPlugin> &
  ExtractInternalPluginSelectors<typeof columnsPlugin>;
