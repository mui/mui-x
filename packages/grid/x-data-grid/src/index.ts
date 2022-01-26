/* eslint-disable import/export */
import {
  useGridApiContext as useUntypedGridApiContext,
  useGridApiRef as useUntypedGridApiRef,
  GridApiCommunity,
  GridApiRef,
  GridApiCommon,
  GridInitialStateCommunity,
  GridStateCommunity,
} from '../../_modules_';

export * from '../../_modules_';
export * from './DataGrid';
export type { DataGridProps } from '../../_modules_/grid/models/props/DataGridProps';
export * from './useDataGridComponent';

export { MAX_PAGE_SIZE } from './useDataGridProps';

// Typing override to avoid breaking change until `__modules__` is removed

/**
 * @deprecated Use `GridApiCommunity`
 */
export type GridApi = GridApiCommunity;

/**
 * @deprecated Use `GridInitialStateCommunity` instead.
 */
export type GridInitialState = GridInitialStateCommunity;

/**
 * @deprecated Use `GridStateCommunity` instead.
 */
export type GridState = GridStateCommunity;

export const useGridApiContext = useUntypedGridApiContext as <
  Api extends GridApiCommon = GridApiCommunity,
>() => GridApiRef<Api>;

export const useGridApiRef = useUntypedGridApiRef as <
  Api extends GridApiCommon = GridApiCommunity,
>() => GridApiRef<Api>;
