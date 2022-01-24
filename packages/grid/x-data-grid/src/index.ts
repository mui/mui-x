/* eslint-disable import/export */
import {
  useGridApiContext as useUntypedGridApiContext,
  useGridApiRef as useUntypedGridApiRef,
  GridApiCommunity,
  GridApiRef,
  GridApiCommon,
} from '../../_modules_';

export * from '../../_modules_';
export * from './DataGrid';
export type { DataGridProps } from '../../_modules_/grid/models/props/DataGridProps';
export * from './useDataGridComponent';

export { MAX_PAGE_SIZE } from './useDataGridProps';

// Typing override to avoid breaking change until `__modules__` is removed

export const useGridApiContext = useUntypedGridApiContext as <
  GridApi extends GridApiCommon = GridApiCommunity,
>() => GridApiRef<GridApi>;

export const useGridApiRef = useUntypedGridApiRef as <
  GridApi extends GridApiCommon = GridApiCommunity,
>() => GridApiRef<GridApi>;
