/* eslint-disable import/export */
import {
  useGridApiContext as useUntypedGridApiContext,
  useGridApiRef as useUntypedGridApiRef,
} from '../../_modules_';

export * from '../../_modules_';
export * from './DataGrid';
export type { DataGridProps } from '../../_modules_/grid/models/props/DataGridProps';
export * from './useDataGridComponent';

export { MAX_PAGE_SIZE } from './useDataGridProps';

export const useGridApiContext =
  useUntypedGridApiContext as () => import('../../_modules_').GridApiRefCommunity;
export const useGridApiRef =
  useUntypedGridApiRef as () => import('../../_modules_').GridApiRefCommunity;
