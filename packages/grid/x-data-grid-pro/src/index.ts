/* eslint-disable import/export */
import {
  useGridApiContext as useUntypedGridApiContext,
  useGridApiRef as useUntypedGridApiRef,
  GridApiPro,
  GridApiRef,
  GridApiCommon,
} from '../../_modules_';

export { LicenseInfo } from '@mui/x-license-pro';
export * from '../../_modules_';
export type { DataGridProProps } from '../../_modules_/grid/models/props/DataGridProProps';
export * from './DataGridPro';

// Typing override to avoid breaking change until `__modules__` is removed

export const useGridApiContext = useUntypedGridApiContext as <
  GridApi extends GridApiCommon = GridApiPro,
>() => GridApiRef<GridApi>;

export const useGridApiRef = useUntypedGridApiRef as <
  GridApi extends GridApiCommon = GridApiPro,
>() => GridApiRef<GridApi>;

/**
 * The full grid API.
 * @deprecated Use `GridApiPro` instead.
 */
export type GridApi = GridApiPro;
