import type { RowsPluginApi, RowsPluginState, RowsPluginOptions } from './rows/types';
import type { ColumnsPluginApi, ColumnsPluginState, ColumnsPluginOptions } from './columns/columns';
import type { ElementsPluginApi, ElementsPluginState } from './elements/elements';

export type InternalPluginsApi<TRow = any, TColumnMeta = {}> = RowsPluginApi<TRow> &
  ColumnsPluginApi<TColumnMeta> &
  ElementsPluginApi;

export type InternalPluginsState = RowsPluginState & ColumnsPluginState & ElementsPluginState;

export interface IntlOptions {
  intl?: {
    locale?: string | string[];
  };
}

export type InternalPluginsOptions<TRow = any, TColumnMeta = {}> = RowsPluginOptions<TRow> &
  ColumnsPluginOptions<TRow, TColumnMeta> &
  IntlOptions;
