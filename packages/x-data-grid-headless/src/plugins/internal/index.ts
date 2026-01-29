import type { RowsPluginApi, RowsPluginState, RowsPluginOptions } from './rows/rows';
import type { ColumnsPluginApi, ColumnsPluginState, ColumnsPluginOptions } from './columns/columns';

export type InternalPluginsApi<TRow = any, TColumnMeta = {}> = RowsPluginApi<TRow> &
  ColumnsPluginApi<TColumnMeta>;

export type InternalPluginsState = RowsPluginState & ColumnsPluginState;

export interface IntlOptions {
  intl?: {
    locale?: string | string[];
  };
}

export type InternalPluginsOptions<TRow = any, TColumnMeta = {}> = RowsPluginOptions<TRow> &
  ColumnsPluginOptions<TRow, TColumnMeta> &
  IntlOptions;
