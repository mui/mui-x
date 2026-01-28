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

export { rowsPlugin, columnsPlugin };
export const internalPlugins = [rowsPlugin, columnsPlugin] as const;

export type InternalPluginsApi<TRow = any, TColumnMeta = {}> = RowsPluginApi<TRow> &
  ColumnsPluginApi<TColumnMeta>;

export type InternalPluginsState = RowsPluginState & ColumnsPluginState;

export type InternalPluginsOptions<TRow = any, TColumnMeta = {}> = RowsPluginOptions<TRow> &
  ColumnsPluginOptions<TRow, TColumnMeta>;
