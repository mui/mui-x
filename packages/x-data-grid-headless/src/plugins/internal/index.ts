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
import elementsPlugin, {
  type ElementsPluginApi,
  type ElementsPluginState,
  type ElementsPluginOptions,
} from './elements/elements';

export const internalPlugins = [rowsPlugin, columnsPlugin, elementsPlugin] as const;

export type InternalPluginsApi<TRow = any> = RowsPluginApi<TRow> & ColumnsPluginApi & ElementsPluginApi;

export type InternalPluginsState = RowsPluginState & ColumnsPluginState & ElementsPluginState;

export type InternalPluginsOptions<TRow = any, TColumnMeta = {}> = RowsPluginOptions<TRow> &
  ColumnsPluginOptions<TRow, TColumnMeta> &
  ElementsPluginOptions;
